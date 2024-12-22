"use server";

import { generateImage } from "./actions/generateImage";
import ImageGenerator from "./components/ImageGenerator";

export default async function Home() {
  return <ImageGenerator generateImage={generateImage} />;
}