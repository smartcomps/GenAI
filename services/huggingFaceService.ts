/**
 * Generates an image using the Hugging Face Inference API.
 * This service is for open-source models like FLUX.1.
 * @param prompt The text prompt for image generation.
 * @param model The model ID on Hugging Face (e.g., 'black-forest-labs/FLUX.1-schnell').
 * @returns A promise that resolves to a base64 data URL of the generated image.
 */
export async function generateImageWithHuggingFace(prompt: string, model: string): Promise<string> {
    const HUGGING_FACE_API_URL = `https://api-inference.huggingface.co/models/${model}`;
    const HF_TOKEN = process.env.HF_TOKEN; 

    if (!HF_TOKEN) {
        throw new Error("A Hugging Face API token (HF_TOKEN) is not configured for this application. Please contact the administrator.");
    }
    
    let response: Response;
    try {
        response = await fetch(HUGGING_FACE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt,
            })
        });
    } catch (networkError) {
        console.error(`Network error when calling Hugging Face API for ${model}:`, networkError);
        throw new Error(`A network error occurred while trying to contact the image generation service for model ${model}.`);
    }

    // If the response is not OK, it's an error (e.g., 4xx, 5xx)
    if (!response.ok) {
        let errorData;
        let errorMessage = `Failed to generate image with ${model}. Status: ${response.status}.`;
        try {
            errorData = await response.json();
            if (errorData.error) {
                errorMessage = errorData.error;
                // Handle the specific case where the model is loading
                if (errorData.estimated_time) {
                    errorMessage += ` The model is loading, please try again in about ${Math.ceil(errorData.estimated_time)} seconds.`
                }
            } else {
                 errorMessage += ` Response: ${JSON.stringify(errorData)}`;
            }
        } catch (e) {
            try {
                // If the error response is not JSON, try to read as text
                const textError = await response.text();
                errorMessage += ` Response: ${textError}`;
            } catch (textErr) {
                // Could not read body
                 errorMessage += ` Could not read error response body.`;
            }
        }
        console.error(`Hugging Face API error for ${model}:`, errorMessage);
        throw new Error(errorMessage);
    }
    
    // If response is OK, it should be an image blob
    try {
        const blob = await response.blob();
        
        if (blob.type.startsWith('image/')) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
                reader.onerror = (err) => reject(new Error("Failed to convert image blob to base64."));
                reader.readAsDataURL(blob);
            });
        } else {
            console.warn(`Hugging Face API returned a non-image response for ${model} even with a 200 OK status.`, blob);
            throw new Error(`The image generation service for ${model} returned an unexpected response type: ${blob.type}.`);
        }
    } catch(e) {
        console.error(`Error processing successful Hugging Face response for ${model}:`, e);
        if (e instanceof Error) throw e;
        throw new Error(`An unknown error occurred while processing the generated image from ${model}.`);
    }
}
