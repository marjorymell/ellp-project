"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadSimpleProps {
  onImageUploaded: (url: string) => void
  currentImage?: string
  label?: string
}

export default function ImageUploadSimple({ onImageUploaded, currentImage, label = "Imagem" }: ImageUploadSimpleProps) {
  const [imageUrl, setImageUrl] = useState(currentImage || "")
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  const handleUrlChange = (url: string) => {
    setImageUrl(url)
    if (url) {
      setPreview(url)
      onImageUploaded(url)
    } else {
      setPreview(null)
      onImageUploaded("")
    }
  }

  const removeImage = () => {
    setImageUrl("")
    setPreview(null)
    onImageUploaded("")
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="text-sm">
          URL da Imagem *
        </Label>
        <Input
          id="imageUrl"
          type="url"
          placeholder="https://exemplo.com/imagem.jpg"
          value={imageUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          required
        />
        <p className="text-xs text-gray-500">
          Cole o link de uma imagem da internet (ex: Google Images, Unsplash, etc.)
        </p>
      </div>

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
          <p className="mt-2 text-sm text-gray-500">Cole uma URL de imagem acima para ver o preview</p>
        </div>
      )}
    </div>
  )
}
