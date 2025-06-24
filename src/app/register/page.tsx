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
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    course: "",
    photo: "",
    isVisibleOnContact: false,
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

    if (!formData.name.trim() || !formData.email.trim() || !formData.course.trim()) {
      setError("Por favor, preencha todos os campos obrigatórios")
      setLoading(false)
      return
    }

    try {
      console.log("🔄 Iniciando registro de voluntário...")
      console.log("📧 Email:", formData.email)

      // Criar usuário no Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      console.log("✅ Usuário criado no Authentication:", userCredential.user.uid)

      // Criar documento no Firestore
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        course: formData.course.trim(),
        photo: formData.photo.trim() || "",
        role: "volunteer",
        isVisibleOnContact: formData.isVisibleOnContact,
        createdAt: new Date().toISOString(),
      }

      await setDoc(doc(db, "users", userCredential.user.uid), userData)
      console.log("✅ Documento criado no Firestore:", userData)

      alert("✅ Conta criada com sucesso! Você será redirecionado para fazer login.")
      router.push("/login")
    } catch (error: any) {
      console.error("❌ Erro ao criar conta:", error)

      // Mensagens de erro específicas
      let errorMessage = error.message
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso. Tente fazer login ou use outro email."
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A senha deve ter pelo menos 6 caracteres."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido."
      } else if (error.code === "auth/invalid-api-key") {
        errorMessage = "Erro de configuração do Firebase. Tente novamente mais tarde."
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registro de Voluntário</CardTitle>
          <CardDescription>Crie sua conta para participar como voluntário do projeto ELLP</CardDescription>
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
                placeholder="Seu nome completo"
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
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Curso *</Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => setFormData((prev) => ({ ...prev, course: e.target.value }))}
                required
                placeholder="Ex: Ciência da Computação"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">URL da Foto (opcional)</Label>
              <Input
                id="photo"
                type="url"
                value={formData.photo}
                onChange={(e) => setFormData((prev) => ({ ...prev, photo: e.target.value }))}
                placeholder="https://exemplo.com/sua-foto.jpg"
              />
              <p className="text-xs text-gray-500">Cole o link de uma foto sua (ex: do LinkedIn, GitHub, etc.)</p>
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isVisibleOnContact"
                checked={formData.isVisibleOnContact}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isVisibleOnContact: !!checked }))}
              />
              <Label htmlFor="isVisibleOnContact" className="text-sm">
                Quero aparecer na página de contato do site
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Fazer login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
