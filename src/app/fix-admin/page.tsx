"use client"

import { useState } from "react"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function FixAdminPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const createAdminDocument = async () => {
    setLoading(true)
    setError("")

    try {
      const userUID = "WJGaXm16ZbR9xDoSlSmOoW3Qw983"
      const adminData = {
        name: "Administrador ELLP",
        email: "marjorymel48@gmail.com",
        course: "Análise e Desenvolvimento de Sistemas",
        photo: "",
        role: "admin",
        isVisibleOnContact: true,
        createdAt: new Date().toISOString(),
      }

      await setDoc(doc(db, "users", userUID), adminData)
      setSuccess(true)
    } catch (error) {
      console.error("Erro ao criar documento:", error)
      setError("Erro ao criar documento do administrador")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <Card>
        <CardHeader>
          <CardTitle>Corrigir Administrador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert>
              <AlertDescription>
                ✅ Documento do administrador criado com sucesso! Agora você pode fazer login.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>UID:</strong> WJGaXm16ZbR9xDoSlSmOoW3Qw983
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> marjorymel48@gmail.com
            </p>
          </div>

          <Button onClick={createAdminDocument} disabled={loading || success} className="w-full">
            {loading ? "Criando..." : success ? "✅ Criado" : "Criar Documento do Admin"}
          </Button>

          {success && (
            <div className="text-center">
              <p className="text-sm text-green-600 mb-2">Agora você pode:</p>
              <Button asChild variant="outline">
                <a href="/login">Fazer Login</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
