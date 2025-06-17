"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import CloudinaryUploadWidget from "./cloudinary-upload-widget"

interface ImageUploadWidgetProps {
  onImageUploaded: (url: string) => void
  currentImage?: string
  label?: string
}

export default function ImageUploadWidget({ onImageUploaded, currentImage, label = "Imagem" }: ImageUploadWidgetProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  const handleUpload = (url: string) => {
    setPreview(url)
    onImageUploaded(url)
  }

  const removeImage = () => {
    setPreview(null)
    onImageUploaded("")
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
          <div className="mt-4">
            <CloudinaryUploadWidget onUpload={handleUpload} />
          </div>
          <p className="mt-2 text-sm text-gray-500">PNG, JPG, WebP até 5MB</p>
        </div>
      )}
    </div>
  )
}
