"use client";

import { useState } from "react";
import ImageGrid from "./imageGrid";

type ImageRecord = {
  id: string;
  prompt: string;
  imageUrl: string;
  generationTime: number;
  createdAt: Date;
};

interface ImageGeneratorProps {
    generateImage: (
        text: string
    ) => Promise<{success: boolean; imageUrl?: string; records?: ImageRecord[] ,error?: string}>;
}

export default function ImageGenerator({ generateImage }: ImageGeneratorProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageHistory, setImageHistory] = useState<ImageRecord[]>([]);
  const [imageDisplay, setImageDisplay] = useState<ImageRecord[]>([]);

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  // Toggle function for sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await generateImage(inputText);
      
      if (!data.success) {
        throw new Error(data.error || "Failed to generate image");
      }

      if (data.imageUrl) {
        const img = new Image();
        const url = data.imageUrl;
        img.onload = () => {
          setImageUrl(url);
        };
        img.src = data.imageUrl;
      } else {
        throw new Error("No image URL received");
      }

      if (data.records) {
        const records = data.records;
        setImageHistory(records);
        setImageDisplay((prevDisplay) => [...prevDisplay, records[0]]);
      } else {
        throw new Error("No records found");
      }
      
      setInputText("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // TODO: Update the UI here to show the images generated
    
<div className="flex flex-col min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="bg-black text-blue-400 p-4">
        <h1 className="text-3xl font-semibold drop-shadow-md flex justify-center items-center">DreamScape</h1>
        <button
          onClick={toggleSidebar}
          className="text-xl font-semibold mt-2 h-10 transition-colors duration-150 rounded-lg focus:shadow-outline text-blue-400"
        >
          {isSidebarVisible ? "Hide History" : "Show History"}
        </button>
      </header>

      {/* Content Section */}
      <div className="flex flex-grow bg-black text-white h-screen">
        {/* Sidebar */}
        <aside
          className={`transition-all duration-300 ${
            isSidebarVisible ? "w-1/4" : "w-0"
          } bg-gray-900 border-r border-gray-700`}
        >
          {isSidebarVisible && (
            <div className="h-full overflow-y-auto p-4">
              <ul className="space-y-4">
                {imageHistory.length > 0 ? (
                  imageHistory.map((record) => (
                    <li
                      key={record.id}
                      className="p-2 rounded-md border border-gray-600 bg-gray-800 shadow-sm"
                    >
                      <p><strong>Prompt:</strong> {record.prompt}</p>
                      <p><strong>Time:</strong> {new Date(record.createdAt).toLocaleString()}</p>
                      <img
                        src={record.imageUrl}
                        alt="Record preview"
                        className="w-full h-20 object-cover rounded-md mt-2"
                      />
                      <p><strong>Latency:</strong> {record.generationTime.toLocaleString()}s</p>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No history available.</p>
                )}
              </ul>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main
  className={`flex flex-col gap-4 p-4 transition-all duration-300 ${
    isSidebarVisible ? "w-3/4" : "w-full"
  }`}
>
  {/* Image Grid Section */}
  <ImageGrid images={imageDisplay} 
  onRemoveImage={(id) => setImageDisplay((prev) => prev.filter((img) => img.id !== id))}
  />

  {/* Prompt Bar */}
  <footer className="w-full max-w-3xl mx-auto">
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-blue-500 text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the image you want to generate..."
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>
    </form>
  </footer>
</main>

      </div>
    </div>

  );
}
