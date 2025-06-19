"use client"

import { useState, useEffect, use } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import WorkshopForm from "@/components/workshop-form"
import type { Workshop } from "@/lib/types"

interface EditWorkshopPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditWorkshopPage(props: EditWorkshopPageProps) {
  const params = use(props.params)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      fetchWorkshop()
    }
  }, [user, authLoading, router, params.id])

  const fetchWorkshop = async () => {
    try {
      const workshopDoc = await getDoc(doc(db, "workshops", params.id))

      if (workshopDoc.exists()) {
        const workshopData = {
          id: workshopDoc.id,
          ...workshopDoc.data(),
        } as Workshop

        if (user?.role !== "admin" && workshopData.createdBy !== user?.uid) {
          router.push("/")
          return
        }

        setWorkshop(workshopData)
      } else {
        alert("Oficina não encontrada")
        router.push("/")
      }
    } catch (error) {
      console.error("Erro ao buscar oficina:", error)
      alert("Erro ao carregar oficina")
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: Omit<Workshop, "id" | "createdAt" | "createdBy">) => {
    if (!workshop) return

    await updateDoc(doc(db, "workshops", workshop.id), data)

    alert("Oficina atualizada com sucesso!")

    if (user?.role === "admin") {
      router.push("/admin")
    } else {
      router.push("/volunteer")
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !workshop) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Oficina</h1>
        <p className="text-gray-600">Atualize as informações da oficina</p>
      </div>
      <WorkshopForm
        workshop={workshop}
        onSubmit={handleSubmit}
        onCancel={() => router.push(user.role === "admin" ? "/admin" : "/volunteer")}
      />
    </div>
  )
}
