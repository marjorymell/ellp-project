"use client"

import { useState } from "react"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CreateAdminPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const createFirstAdmin = async () => {
    setLoading(true)
    setError("")

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

    try {
      await setDoc(doc(db, "users", userUID), adminData)
      console.log("✅ Administrador criado com sucesso!")
      console.log("Dados salvos:", adminData)
      console.log("UID:", userUID)
      setSuccess(true)
    } catch (error) {
      console.error("❌ Erro ao criar administrador:", error)
      setError("Erro ao criar administrador: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <Card>
        <CardHeader>
          <CardTitle>Criar Primeiro Administrador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert>
              <AlertDescription>✅ Administrador criado com sucesso! Agora você pode fazer login.</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 text-sm">
            <p>
              <strong>UID:</strong> WJGaXm16ZbR9xDoSlSmOoW3Qw983
            </p>
            <p>
              <strong>Email:</strong> marjorymel48@gmail.com
            </p>
            <p>
              <strong>Nome:</strong> Administrador ELLP
            </p>
            <p>
              <strong>Curso:</strong> Análise e Desenvolvimento de Sistemas
            </p>
          </div>

          <Button onClick={createFirstAdmin} disabled={loading || success} className="w-full">
            {loading ? "Criando..." : success ? "✅ Criado" : "Criar Administrador"}
          </Button>

          {success && (
            <div className="text-center space-y-2">
              <p className="text-sm text-green-600">Pronto! Agora você pode:</p>
              <Button asChild variant="outline" className="w-full">
                <a href="/login">Fazer Login</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
