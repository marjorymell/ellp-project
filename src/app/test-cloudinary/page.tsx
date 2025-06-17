"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestCloudinaryPage() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<string>("")

  const testCloudinaryConnection = async () => {
    setTesting(true)
    setResult("")

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

      console.log("🧪 Testando conexão com Cloudinary...")
      console.log("Cloud Name:", cloudName)
      console.log("Upload Preset:", uploadPreset)

      // Testar se conseguimos acessar a API básica do Cloudinary
      const testUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

      // Criar um arquivo de teste muito pequeno
      const testFile = new Blob(["test"], { type: "text/plain" })
      const formData = new FormData()
      formData.append("file", testFile)
      formData.append("upload_preset", uploadPreset!)

      const response = await fetch(testUrl, {
        method: "POST",
        body: formData,
      })

      const responseText = await response.text()
      console.log("📡 Status:", response.status)
      console.log("📄 Resposta:", responseText)

      setResult(`Status: ${response.status}\nResposta: ${responseText}`)
    } catch (error) {
      console.error("❌ Erro no teste:", error)
      setResult(`Erro: ${error}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Conexão - Cloudinary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p>
              <strong>Cloud Name:</strong> {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
            </p>
            <p>
              <strong>Upload Preset:</strong> {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            </p>
          </div>

          <Button onClick={testCloudinaryConnection} disabled={testing}>
            {testing ? "Testando..." : "Testar Conexão"}
          </Button>

          {result && (
            <div className="p-4 bg-gray-100 rounded">
              <pre className="text-sm whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
