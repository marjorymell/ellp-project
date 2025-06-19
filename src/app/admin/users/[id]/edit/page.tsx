"use client"

import type React from "react"
import { useState, useEffect, use } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { User } from "@/lib/types"

interface EditUserPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditUserPage(props: EditUserPageProps) {
  const params = use(props.params)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    photo: "",
    role: "volunteer" as "admin" | "volunteer",
    isVisibleOnContact: false,
  })

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/")
      return
    }

    if (user && user.role === "admin") {
      fetchUserData()
    }
  }, [user, authLoading, router])

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", params.id))

      if (userDoc.exists()) {
        const userData = userDoc.data() as User
        setFormData({
          name: userData.name,
          email: userData.email,
          course: userData.course,
          photo: userData.photo || "",
          role: userData.role,
          isVisibleOnContact: userData.isVisibleOnContact,
        })
      } else {
        setError("Usuário não encontrado")
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error)
      setError("Erro ao carregar dados do usuário")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.role !== "admin") return

    setSubmitting(true)
    setError("")

    try {
      await updateDoc(doc(db, "users", params.id), {
        name: formData.name,
        course: formData.course,
        photo: formData.photo,
        role: formData.role,
        isVisibleOnContact: formData.isVisibleOnContact,
      })

      alert("Usuário atualizado com sucesso!")
      router.push("/admin")
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error)
      setError(error.message || "Erro ao atualizar usuário")
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Editar Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} disabled className="bg-gray-100" />
              <p className="text-xs text-gray-500">O email não pode ser alterado</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Curso *</Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => setFormData((prev) => ({ ...prev, course: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">URL da Foto</Label>
              <Input
                id="photo"
                type="url"
                value={formData.photo}
                onChange={(e) => setFormData((prev) => ({ ...prev, photo: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Usuário *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "volunteer") => setFormData((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volunteer">Voluntário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isVisibleOnContact"
                checked={formData.isVisibleOnContact}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isVisibleOnContact: !!checked }))}
              />
              <Label htmlFor="isVisibleOnContact">Exibir na página de contato</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
