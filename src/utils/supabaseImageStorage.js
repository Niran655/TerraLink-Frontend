import { supabase } from "../supabaseClient";

const IMAGE_BUCKET = "images";

export function getImageStoragePath(imageUrlOrPath) {
  if (!imageUrlOrPath) return "";

  if (!/^https?:\/\//i.test(imageUrlOrPath)) {
    return imageUrlOrPath;
  }

  try {
    const url = new URL(imageUrlOrPath);
    const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) return "";

    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return "";
  }
}

export async function deleteImagesFromStorage(images) {
  const paths = [...new Set(images.map(getImageStoragePath).filter(Boolean))];
  if (!paths.length) return;

  const { error } = await supabase.storage.from(IMAGE_BUCKET).remove(paths);
  if (error) throw error;
}

export async function deleteImageFromStorage(imageUrlOrPath) {
  await deleteImagesFromStorage([imageUrlOrPath]);
}
