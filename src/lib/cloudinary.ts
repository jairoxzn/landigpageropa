import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function uploadImage(
  data: string,
  folder: string = "lucia-jeans"
): Promise<{ url: string; publicId: string }> {
  const res = await cloudinary.uploader.upload(data, {
    folder,
    transformation: [{ quality: "auto", fetch_format: "auto" }]
  });
  return { url: res.secure_url, publicId: res.public_id };
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
