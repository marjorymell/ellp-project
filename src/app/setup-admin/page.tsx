"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

export default function SetupAdminPage() {
  const [formData, setFormData] = useState({
    name: "Administrador ELLP",
    email: "",
    password: "",
    confirmPassword: "",
    course: "Administração do Sistema",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setLoading(false)
      return
    }

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Por favor, preencha todos os campos obrigatórios")
      setLoading(false)
      return
    }

    try {
      console.log("🔄 Criando administrador...")
      console.log("📧 Email:", formData.email)

      // Criar usuário no Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      console.log("✅ Usuário criado no Authentication:", userCredential.user.uid)

      // Criar documento no Firestore
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        course: formData.course.trim(),
        photo: "",
        role: "admin",
        isVisibleOnContact: true,
        createdAt: new Date().toISOString(),
      }

      await setDoc(doc(db, "users", userCredential.user.uid), userData)
      console.log("✅ Administrador criado no Firestore:", userData)

      alert("✅ Administrador criado com sucesso! Você será redirecionado para fazer login.")
      router.push("/login")
    } catch (error: any) {
      console.error("❌ Erro ao criar administrador:", error)

      // Mensagens de erro específicas
      let errorMessage = error.message
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso. Tente fazer login ou use outro email."
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A senha deve ter pelo menos 6 caracteres."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido."
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle>Configurar Administrador</CardTitle>
          <CardDescription>Crie a primeira conta de administrador para gerenciar o sistema ELLP</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Nome do administrador"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                placeholder="admin@ellp.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Área/Curso</Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => setFormData((prev) => ({ ...prev, course: e.target.value }))}
                placeholder="Ex: Ciência da Computação"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
                placeholder="Digite a senha novamente"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando administrador..." : "Criar Administrador"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Fazer login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
