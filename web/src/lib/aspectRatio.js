/**
 * Reads an image file's natural dimensions and checks them against a
 * target aspect ratio within a tolerance (default ±2%).
 */
export function checkAspectRatio(file, targetRatio, tolerance = 0.02) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const ratio = img.width / img.height;
      const diff = Math.abs(ratio - targetRatio) / targetRatio;
      URL.revokeObjectURL(url);
      resolve({ ok: diff <= tolerance, ratio, width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image dimensions.'));
    };

    img.src = url;
  });
}

export const RATIO_16_9 = 16 / 9;
export const RATIO_9_16 = 9 / 16;
