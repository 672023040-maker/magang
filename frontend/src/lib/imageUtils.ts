export async function preprocessImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas context not available');

  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const quality = mimeType === 'image/jpeg' ? 0.9 : undefined;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))),
      mimeType,
      quality
    );
  });

  const extension = mimeType === 'image/png' ? 'png' : 'jpg';
  const newName = file.name.replace(/\.[^.]+$/, '') + '.' + extension;

  return new File([blob], newName, { type: mimeType, lastModified: Date.now() });
}