"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import WorkshopForm from "@/components/workshop-form"
import type { Workshop } from "@/lib/types"

export default function NewWorkshopPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (data: Omit<Workshop, "id" | "createdAt" | "createdBy">) => {
    if (!user) return

    try {
      await addDoc(collection(db, "workshops"), {
        ...data,
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
      })

      alert("Oficina criada com sucesso!")
      router.push("/")
    } catch (error) {
      console.error("Erro ao criar oficina:", error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <WorkshopForm onSubmit={handleSubmit} onCancel={() => router.push("/")} />
      </div>
    </div>
  )
}
