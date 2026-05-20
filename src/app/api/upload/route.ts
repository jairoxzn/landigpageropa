import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buf.toString("base64")}`;

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json(
        { error: "Cloudinary no configurado" },
        { status: 500 }
      );
    }
    const result = await uploadImage(dataUri, "lucia-jeans");
    return NextResponse.json(result);
  } catch (e) {
    console.error("upload error", e);
    return NextResponse.json({ error: "Error al subir" }, { status: 500 });
  }
}
