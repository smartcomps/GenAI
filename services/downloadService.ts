/**
 * Downloads an image from a given URL with a specified filename.
 * Uses the Fetch API to get the image as a blob for robust downloading.
 * Falls back to a direct link download if blob creation fails.
 * @param imageUrl The URL of the image to download (can be a data URL or a remote URL).
 * @param filename The desired filename for the downloaded image.
 */
export const downloadImage = (imageUrl: string, filename: string): void => {
  if (!imageUrl) return;

  fetch(imageUrl)
    .then(res => {
      if (!res.ok) throw new Error(`Network response was not ok: ${res.statusText}`);
      return res.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch(err => {
      console.error('Failed to download image using blob, falling back to data URL:', err);
      // Fallback for browsers that might have issues with blobs or for CORS errors
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
};
