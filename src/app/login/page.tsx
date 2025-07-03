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
import { Info } from "lucide-react"
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
      console.error("❌ Erro no login:", error)

      // Mensagens de erro específicas
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
   <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold" style={{ color: "#062B5B" }}>
            Login
          </CardTitle>
          <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {!isUsingRealFirebase && (
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-blue-700">
                <strong>Modo Demonstração:</strong> Este formulário é apenas para visualização. Configure Firebase para
                funcionalidade completa.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>

            <Button type="submit" className="w-full text-white transition-colors duration-200"
              style={{
                backgroundColor: "#F58E2F",
                borderColor: "#F58E2F",
                color: "white",
              }} 
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ffa34f"
                e.currentTarget.style.borderColor = "#ffa34f"
                e.currentTarget.style.color = "white"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F58E2F"
                e.currentTarget.style.borderColor = "#F58E2F"
                e.currentTarget.style.color = "white"
              }}
              disabled={loading || !isUsingRealFirebase}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Registrar-se como voluntário
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
