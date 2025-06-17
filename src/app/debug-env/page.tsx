"use client"

export default function DebugEnvPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Debug - Variáveis de Ambiente</h1>

      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Cloudinary</h3>
          <p>
            <strong>Cloud Name:</strong> {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "❌ Não encontrado"}
          </p>
          <p>
            <strong>Upload Preset:</strong> {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "❌ Não encontrado"}
          </p>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Firebase</h3>
          <p>
            <strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "❌ Não encontrado"}
          </p>
          <p>
            <strong>API Key:</strong>{" "}
            {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Configurado" : "❌ Não encontrado"}
          </p>
        </div>
      </div>
    </div>
  )
}
