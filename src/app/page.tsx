"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Workshop } from "@/lib/types"
import WorkshopCard from "@/components/workshop-card"

export default function HomePage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const q = query(collection(db, "workshops"), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)
        const workshopsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Workshop[]
        setWorkshops(workshopsData)
      } catch (error) {
        console.error("Erro ao buscar oficinas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshops()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">ELLP - Ensino Lúdico de Lógica de Programação</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Descubra nossas oficinas de programação e participe de uma experiência de aprendizado única e divertida!
        </p>
      </div>

      {workshops.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nenhuma oficina disponível no momento</h2>
          <p className="text-gray-600">Fique atento! Novas oficinas serão divulgadas em breve.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((workshop) => (
            <WorkshopCard key={workshop.id} workshop={workshop} />
          ))}
        </div>
      )}
    </div>
  )
}
