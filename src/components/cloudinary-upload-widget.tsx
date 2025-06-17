"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface CloudinaryUploadWidgetProps {
  onUpload: (url: string) => void
  children?: React.ReactNode
}

declare global {
  interface Window {
    cloudinary: any
  }
}

export default function CloudinaryUploadWidget({ onUpload, children }: CloudinaryUploadWidgetProps) {
  const cloudinaryRef = useRef<any>()
  const widgetRef = useRef<any>()

  useEffect(() => {
    if (!window.cloudinary) {
      const script = document.createElement("script")
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js"
      script.async = true
      script.onload = () => initializeWidget()
      document.body.appendChild(script)
    } else {
      initializeWidget()
    }

    function initializeWidget() {
      cloudinaryRef.current = window.cloudinary
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          sources: ["local", "url", "camera"],
          multiple: false,
          maxFiles: 1,
          resourceType: "image",
          maxImageFileSize: 5000000, // 5MB
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          theme: "minimal",
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            console.log("✅ Upload realizado com sucesso!")
            console.log("🔗 URL da imagem:", result.info.secure_url)
            onUpload(result.info.secure_url)
          }
          if (error) {
            console.error("❌ Erro no upload:", error)
          }
        },
      )
    }
  }, [onUpload])

  const openWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open()
    }
  }

  return (
    <Button type="button" onClick={openWidget} variant="outline">
      {children || (
        <>
          <Upload className="w-4 h-4 mr-2" />
          Selecionar Imagem
        </>
      )}
    </Button>
  )
}
