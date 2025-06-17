export async function uploadToCloudinary(file: File): Promise<string> {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    console.log("🔧 Configurações do Cloudinary:")
    console.log("Cloud Name:", cloudName)
    console.log("Upload Preset:", uploadPreset)
    console.log("Arquivo:", file.name, file.type, file.size)

    if (!cloudName || !uploadPreset) {
      throw new Error("Configurações do Cloudinary não encontradas")
    }

    // Validar arquivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.")
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error("Arquivo muito grande. Máximo 5MB.")
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    console.log("🌐 URL da API:", url)

    console.log("🔄 Enviando para Cloudinary...")

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    })

    console.log("📡 Status da resposta:", response.status, response.statusText)

    const data = await response.json()
    console.log("📤 Resposta do Cloudinary:", data)

    if (!response.ok) {
      console.error("❌ Erro detalhado:", data)
      throw new Error(data.error?.message || `Erro ${response.status}: ${response.statusText}`)
    }

    console.log("✅ Upload realizado com sucesso!")
    console.log("🔗 URL da imagem:", data.secure_url)
    return data.secure_url
  } catch (error) {
    console.error("💥 Erro no upload:", error)
    throw error
  }
}
