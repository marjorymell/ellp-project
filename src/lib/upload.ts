import { put } from "@vercel/blob"

export async function uploadImage(file: File): Promise<string> {
  try {
    const blob = await put(file.name, file, {
      access: "public",
    })
    return blob.url
  } catch (error) {
    console.error("Erro no upload:", error)
    throw new Error("Falha no upload da imagem")
  }
}

export function validateImageFile(file: File): boolean {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.")
  }

  if (file.size > maxSize) {
    throw new Error("Arquivo muito grande. Máximo 5MB.")
  }

  return true
}
