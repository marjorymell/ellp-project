"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"
import { uploadImage, validateImageFile } from "@/lib/upload"

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  currentImage?: string
  label?: string
}

export default function ImageUpload({ onImageUploaded, currentImage, label = "Imagem" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      validateImageFile(file)

      // Mostrar preview
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Upload
      setUploading(true)
      const imageUrl = await uploadImage(file)
      onImageUploaded(imageUrl)

      // Limpar preview temporário
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
