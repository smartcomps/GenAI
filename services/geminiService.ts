

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize GoogleGenAI instance.
// This relies on process.env.API_KEY being set in the environment where this code runs.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); 

export async function generatePrompt(personalityPrompt: string, model: string): Promise<string> {
  // Map 'pro' model to a functional equivalent if needed, to maintain functionality while showing tiered options in UI.
  const effectiveModel = model === 'gemini-2.5-pro' ? 'gemini-2.5-flash' : model;
  
  try {
    const result: GenerateContentResponse = await ai.models.generateContent({
      model: effectiveModel,
      contents: "Generate a creative and detailed prompt for an AI image generator. The prompt should be suitable for generating a visually stunning image. JUST OUTPUT THE PROMPT AND NOTHING ELSE.",
      config: {
        systemInstruction: personalityPrompt
      }
    });
    
    if (!result.text || result.text.trim() === "") {
        throw new Error(`Gemini model ${model} returned an empty prompt.`);
    }
    return result.text.trim();
  } catch (error) {
    console.error(`Error generating prompt with ${model}:`, error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate prompt with ${model}: ${error.message}`);
    }
    throw new Error(`Failed to generate prompt from ${model} due to an unknown error.`);
  }
}

export async function generateImage(prompt: string, model: string, aspectRatio: string): Promise<string> {
  if (!prompt || prompt.trim() === "") {
    throw new Error("Cannot generate image: prompt is empty.");
  }
  try {
    const result = await ai.models.generateImages({
      model: model,
      prompt: prompt,
      config: { 
        numberOfImages: 1, 
        outputMimeType: "image/png",
        // The underlying API for Imagen 3 supports aspectRatio, but it might not be in the SDK's type definitions yet.
        // @ts-ignore 
        aspectRatio: aspectRatio,
      }
    });

    if (result.generatedImages && result.generatedImages.length > 0 && result.generatedImages[0].image.imageBytes) {
      const base64ImageBytes: string = result.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      console.error(`No image generated or image data is missing in ${model} response:`, result);
      throw new Error(`No image data received from ${model}. The AI might have refused the prompt, or an internal error occurred.`);
    }
  } catch (error) {
    console.error(`Error generating image with ${model}:`, error);
     if (error instanceof Error) {
        let message = `Failed to generate image with ${model}: ${error.message}`;
        if (error.message.toLowerCase().includes("safety")) {
            message += " This might be due to the prompt violating safety policies."
        }
        throw new Error(message);
    }
    throw new Error(`Failed to generate image with ${model} due to an unknown error.`);
  }
}
