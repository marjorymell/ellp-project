"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { User } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Users, Star } from "lucide-react"
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
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="ellp-spinner w-12 h-12"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="ellp-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <Users className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">Nossa Equipe</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Conheça os voluntários e administradores que tornam o projeto ELLP possível
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {users.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Users className="w-16 h-16 mx-auto mb-6 text-gray-400" />
              <h2 className="text-2xl font-semibold text-[#062b5b] mb-4">Nenhum membro da equipe disponível</h2>
              <p className="text-gray-600">Os membros da equipe aparecerão aqui em breve.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {users.map((user, index) => (
              <div key={user.id} className="slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className="ellp-card text-center p-6 h-full">
                  <CardHeader>
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <Image
                        src={user.photo || "/placeholder.svg?height=96&width=96"}
                        alt={user.name}
                        fill
                        className="rounded-full object-cover border-4 border-[#f58e2f]/20"
                      />
                      {user.role === "admin" && (
                        <div className="absolute -top-1 -right-1 bg-[#f58e2f] rounded-full p-1">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-[#062b5b] text-xl">{user.name}</CardTitle>
                    <p className="text-gray-600 font-medium">{user.course}</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin" ? "bg-[#f58e2f]/10 text-[#f58e2f]" : "bg-[#0075ca]/10 text-[#0075ca]"
                      }`}
                    >
                      {user.role === "admin" ? "Administrador" : "Voluntário"}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center text-gray-600 hover:text-[#0075ca] transition-colors">
                      <Mail className="w-4 h-4 mr-2" />
                      <a href={`mailto:${user.email}`} className="hover:underline text-sm">
                        {user.email}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
