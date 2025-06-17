"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"
import { uploadToCloudinary } from "@/lib/cloudinary"

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  currentImage?: string
  label?: string
}

export default function ImageUploadCloudinary({ onImageUploaded, currentImage, label = "Imagem" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    const maxSize = 5 * 1024 * 1024 

    if (!allowedTypes.includes(file.type)) {
      alert("Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.")
      return
    }

    if (file.size > maxSize) {
      alert("Arquivo muito grande. Máximo 5MB.")
      return
    }

    try {
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      setUploading(true)
      const imageUrl = await uploadToCloudinary(file)
      onImageUploaded(imageUrl)

      URL.revokeObjectURL(previewUrl)
      setPreview(imageUrl)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro no upload")
      setPreview(currentImage || null)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setPreview(null)
    onImageUploaded("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      {preview ? (
        <div className="relative">
          <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Enviando..." : "Selecionar Imagem"}
            </Button>
          </div>
          <p className="mt-2 text-sm text-gray-500">PNG, JPG, WebP até 5MB</p>
        </div>
      )}

      <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  )
}
