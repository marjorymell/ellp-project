"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Workshop } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function VolunteerPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && (!user || user.role !== "volunteer")) {
      router.push("/")
      return
    }

    if (user && user.role === "volunteer") {
      fetchMyWorkshops()
    }
  }, [user, loading, router])

  const fetchMyWorkshops = async () => {
    if (!user) return

    try {
      const q = query(collection(db, "workshops"), where("createdBy", "==", user.uid))
      const querySnapshot = await getDocs(q)
      const workshopsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Workshop[]

      setWorkshops(workshopsData)
    } catch (error) {
      console.error("Erro ao buscar oficinas:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const deleteWorkshop = async (workshopId: string) => {
    if (confirm("Tem certeza que deseja excluir esta oficina?")) {
      try {
        await deleteDoc(doc(db, "workshops", workshopId))
        setWorkshops(workshops.filter((w) => w.id !== workshopId))
      } catch (error) {
        console.error("Erro ao excluir oficina:", error)
        alert("Erro ao excluir oficina")
      }
    }
  }

  if (loading || loadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || user.role !== "volunteer") {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Área do Voluntário</h1>
        <p className="text-gray-600">Gerencie suas oficinas cadastradas</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Minhas Oficinas ({workshops.length})</CardTitle>
          <Link href="/workshops/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Oficina
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {workshops.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma oficina cadastrada</h3>
              <p className="text-gray-600 mb-4">Comece criando sua primeira oficina</p>
              <Link href="/workshops/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Oficina
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workshops.map((workshop) => (
                <div key={workshop.id} className="border rounded-lg overflow-hidden">
                  <div className="relative h-32">
                    <Image
                      src={workshop.image || "/placeholder.svg?height=128&width=256"}
                      alt={workshop.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2">{workshop.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(workshop.workshopDate).toLocaleDateString("pt-BR")} • {workshop.schedule}
                    </p>
                    <div className="flex space-x-2">
                      <Link href={`/workshops/${workshop.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => deleteWorkshop(workshop.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
