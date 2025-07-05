"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Workshop } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Calendar, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Footer from "@/components/footer"

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
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="ellp-spinner w-12 h-12"></div>
      </div>
    )
  }

  if (!user || user.role !== "volunteer") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="ellp-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="fade-in text-center">
            <User className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Área do Voluntário</h1>
            <p className="text-xl text-white/90">Gerencie suas oficinas cadastradas</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="ellp-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#062b5b] text-2xl">Minhas Oficinas ({workshops.length})</CardTitle>
            <Button className="ellp-button-primary" asChild>
              <Link href="/workshops/new">
                <Plus className="w-4 h-4 mr-2" />
                Nova Oficina
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {workshops.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <h3 className="text-xl font-semibold text-[#062b5b] mb-4">Nenhuma oficina cadastrada</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Comece criando sua primeira oficina e compartilhe conhecimento com outros estudantes.
                </p>
                <Button className="ellp-button-primary" asChild>
                  <Link href="/workshops/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Oficina
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workshops.map((workshop, index) => (
                  <div key={workshop.id} className="slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <Card className="ellp-card border rounded-lg overflow-hidden h-full flex flex-col">
                      <div className="relative h-32">
                        <Image
                          src={workshop.image || "/placeholder.svg?height=128&width=256"}
                          alt={workshop.title}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <h3 className="font-semibold mb-2 text-[#062b5b] line-clamp-2 flex-grow">{workshop.title}</h3>
                        <div className="space-y-1 mb-4">
                          <p className="text-sm text-gray-600 flex items-center">
                            <Calendar className="w-3 h-3 mr-1 text-[#f58e2f]" />
                            {new Date(workshop.workshopDate).toLocaleDateString("pt-BR")}
                          </p>
                          <p className="text-sm text-gray-600">{workshop.schedule}</p>
                        </div>
                        <div className="flex space-x-2 mt-auto">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                            <Link href={`/workshops/${workshop.id}/edit`}>
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent"
                            onClick={() => deleteWorkshop(workshop.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer/>
    </div>
  )
}
