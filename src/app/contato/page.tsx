"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { User } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Image from "next/image"

export default function ContactPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "users"), where("isVisibleOnContact", "==", true))
        const querySnapshot = await getDocs(q)
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[]
        setUsers(usersData)
      } catch (error) {
        console.error("Erro ao buscar usuários:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Nossa Equipe</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Conheça os voluntários e administradores que tornam o projeto ELLP possível
        </p>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nenhum membro da equipe disponível</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id} className="text-center">
              <CardHeader>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={user.photo || "/placeholder.svg?height=96&width=96"}
                    alt={user.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <CardTitle>{user.name}</CardTitle>
                <p className="text-sm text-gray-600">{user.course}</p>
                <p className="text-xs text-blue-600 font-medium">
                  {user.role === "admin" ? "Administrador" : "Voluntário"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${user.email}`} className="hover:text-blue-600">
                    {user.email}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
