"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { isUsingRealFirebase } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, LogIn } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isUsingRealFirebase) {
      alert("Firebase não configurado. Este é apenas um formulário de demonstração.")
      return
    }

    setLoading(true)
    setError("")

    try {
      await login(email, password)
      router.push("/")
    } catch (error: any) {
      let errorMessage = "Email ou senha incorretos"
      if (error.code === "auth/user-not-found") {
        errorMessage = "Usuário não encontrado. Verifique o email ou crie uma conta."
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Senha incorreta."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido."
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Muitas tentativas de login. Tente novamente mais tarde."
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full fade-in">
        <Card className="ellp-card shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#0075ca]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-[#0075ca]" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#062b5b]">Bem-vindo de volta</CardTitle>
            <CardDescription>Entre com suas credenciais para acessar o sistema ELLP</CardDescription>
          </CardHeader>
          <CardContent>
            {!isUsingRealFirebase && (
              <Alert className="mb-6 border-blue-200 bg-blue-50">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-blue-700">
                  <strong>Modo Demonstração:</strong> Este formulário é apenas para visualização. Configure Firebase
                  para funcionalidade completa.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Sua senha"
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                className="ellp-button-primary w-full h-11 text-base"
                disabled={loading || !isUsingRealFirebase}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Link href="/register" className="text-[#0075ca] hover:underline font-medium">
                  Registrar-se como voluntário
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
