import { sql } from '@vercel/postgres';

type ImageRecord = {
  id: string;
  prompt: string;
  imageUrl: string;
  generationTime: number;
  createdAt: Date;
};
export async function storeImageGeneration(prompt: string, imageUrl: string, generationTime: number) {
  try {
    await sql`
      INSERT INTO image_generations (
        prompt,
        image_url,
        generation_time,
        created_at
      ) VALUES (
        ${prompt},
        ${imageUrl},
        ${generationTime},
        NOW()
      )
    `;
  } catch (error) {
    console.error('Failed to store image generation:', error);
    throw error;
  }
}
export async function getImageHistory(): Promise<ImageRecord[]> {
  try {
    const { rows } = await sql<ImageRecord>`
      SELECT
        id,
        prompt,
        image_url as "imageUrl",
        generation_time as "generationTime",
        created_at as "createdAt"
      FROM image_generations
      ORDER BY created_at DESC
      LIMIT 50
    `;
    return rows;
  } catch (error) {
    console.error('Failed to fetch image history:', error);
    throw error;
  }
}
