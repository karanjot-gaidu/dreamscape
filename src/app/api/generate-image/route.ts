import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";
import { getImageHistory, storeImageGeneration }  from '@/src/app/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    const apiSercret = request.headers.get("X-API-SECRET");
    if (apiSercret != process.env.API_SECRET) {
      return NextResponse.json({error: "Unauthorized"}, { status: 401});
    }

    console.log(text);
    const modalUrl = process.env.MODAL_URL || "";
    const url = new URL(modalUrl);
    url.searchParams.set("prompt", text)
    const startTime = new Date();
    console.log("Requesting URL", url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.API_KEY || "",
        Accept: "image/jpeg",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Response", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const filename = `${crypto.randomUUID()}.jpg`

    const blob = await put(filename, imageBuffer, {
      access: "public",
      contentType: "image/jpeg",
    })
    const endTime = new Date();
    const generationTime = (endTime.getTime() - startTime.getTime()) / 1000;
    await storeImageGeneration(text, blob.url, generationTime);
    const rows = await getImageHistory();
    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
      records: rows,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
