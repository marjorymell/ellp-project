"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/auth-context"
import { useRouter } from "next/navigation"
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore"
import { db } from "../../lib/firebase"
import type { User, Workshop } from "../../lib/types"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Plus, Edit, Trash2, Users, FileText, Clock, UserCheck, Settings, AlertCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Função para gerar as iniciais do nome
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2) // Máximo 2 iniciais
}

// Função para gerar uma cor baseada no nome
const getAvatarColor = (name: string) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-teal-500",
  ]

  // Usar o código do primeiro caractere para escolher uma cor
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [pendingUsersCount, setPendingUsersCount] = useState(0)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/")
      return
    }

    if (user && user.role === "admin") {
      fetchData()
    }
  }, [user, loading, router])

  const fetchData = async () => {
    try {
      const activeUsersQuery = query(collection(db, "users"), where("status", "==", "active"))
      const usersSnapshot = await getDocs(activeUsersQuery)
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[]

      const pendingUsersQuery = query(collection(db, "users"), where("status", "==", "pending"))
      const pendingSnapshot = await getDocs(pendingUsersQuery)
      setPendingUsersCount(pendingSnapshot.docs.length)

      const workshopsSnapshot = await getDocs(collection(db, "workshops"))
      const workshopsData = workshopsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Workshop[]

      setUsers(usersData)
      setWorkshops(workshopsData)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const deleteUser = async (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await deleteDoc(doc(db, "users", userId))
        setUsers(users.filter((u) => u.id !== userId))
      } catch (error) {
        console.error("Erro ao excluir usuário:", error)
        alert("Erro ao excluir usuário")
      }
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

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold text-[#062b5b] mb-2">Painel Administrativo</h1>
          <p className="text-gray-600 text-lg">Gerencie usuários, oficinas e solicitações do sistema ELLP</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 slide-up">
          <Link href="/admin/volunteer-requests" className="block">
            <div
              className={`admin-action-card p-6 h-full ${
                pendingUsersCount > 0
                  ? "bg-gradient-to-br from-yellow-500 to-orange-500"
                  : "bg-gradient-to-br from-[#0075ca] to-[#0070cf]"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <UserCheck className="w-8 h-8 text-white" />
                {pendingUsersCount > 0 && (
                  <span className="bg-white text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                    {pendingUsersCount}
                  </span>
                )}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Solicitações</h3>
              <p className="text-white/90 text-sm">
                {pendingUsersCount > 0
                  ? `${pendingUsersCount} pendente${pendingUsersCount > 1 ? "s" : ""}`
                  : "Gerenciar aprovações"}
              </p>
            </div>
          </Link>

          <Link href="/admin/users/new" className="block">
            <div className="admin-action-card p-6 h-full bg-gradient-to-br from-green-500 to-emerald-600">
              <div className="flex items-center justify-between mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Novo Usuário</h3>
              <p className="text-white/90 text-sm">Criar conta diretamente</p>
            </div>
          </Link>

          <Link href="/workshops/new" className="block">
            <div className="admin-action-card p-6 h-full bg-gradient-to-br from-purple-500 to-indigo-600">
              <div className="flex items-center justify-between mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Nova Oficina</h3>
              <p className="text-white/90 text-sm">Criar poster de oficina</p>
            </div>
          </Link>

          <div className="admin-action-card p-6 h-full bg-gradient-to-br from-gray-500 to-gray-600 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Configurações</h3>
            <p className="text-white/90 text-sm">Configurar sistema</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="admin-stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Usuários Ativos</CardTitle>
              <Users className="h-5 w-5 text-[#0075ca]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#062b5b]">{users.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {users.filter((u) => u.role === "admin").length} admins,{" "}
                {users.filter((u) => u.role === "volunteer").length} voluntários
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">Ativo</span>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Oficinas</CardTitle>
              <FileText className="h-5 w-5 text-[#f58e2f]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#062b5b]">{workshops.length}</div>
              <p className="text-xs text-gray-500 mt-1">Oficinas cadastradas</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">Crescendo</span>
              </div>
            </CardContent>
          </Card>

          <Card className={`admin-stat-card ${pendingUsersCount > 0 ? "border-yellow-300 bg-yellow-50" : ""}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Contas Pendentes</CardTitle>
              <Clock className={`h-5 w-5 ${pendingUsersCount > 0 ? "text-yellow-600" : "text-gray-400"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${pendingUsersCount > 0 ? "text-yellow-600" : "text-[#062b5b]"}`}>
                {pendingUsersCount}
              </div>
              <p className="text-xs text-gray-500 mt-1">Aguardando aprovação</p>
              {pendingUsersCount > 0 && (
                <div className="flex items-center mt-2">
                  <AlertCircle className="w-3 h-3 text-yellow-500 mr-1" />
                  <span className="text-xs text-yellow-600">Requer atenção</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="admin-stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Sistema</CardTitle>
              <Settings className="h-5 w-5 text-[#0070cf]" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-600 mb-1">Online</div>
              <p className="text-xs text-gray-500">Funcionando normalmente</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-green-600">Operacional</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Users Alert */}
        {pendingUsersCount > 0 && (
          <Card className="mb-8 border-yellow-300 bg-yellow-50 slide-up">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                {pendingUsersCount} Solicitação{pendingUsersCount > 1 ? "ões" : ""} Pendente
                {pendingUsersCount > 1 ? "s" : ""}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 mb-4">
                Há {pendingUsersCount} pessoa{pendingUsersCount > 1 ? "s" : ""} aguardando aprovação para se tornar
                {pendingUsersCount > 1 ? "em" : ""} voluntário{pendingUsersCount > 1 ? "s" : ""}.
              </p>
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white" asChild>
                <Link href="/admin/volunteer-requests">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Revisar Solicitações
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Users Management */}
        <Card className="mb-8 ellp-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#062b5b]">Usuários Ativos do Sistema</CardTitle>
            <Button className="ellp-button-primary" asChild>
              <Link href="/admin/users/new">
                <Plus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12">
                      {user.photo ? (
                        <Image
                          src={user.photo || "/placeholder.svg"}
                          alt={user.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-full ${getAvatarColor(user.name)} flex items-center justify-center`}
                        >
                          <span className="text-white text-sm font-bold">{getInitials(user.name)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-[#062b5b]">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role === "admin" ? "Administrador" : "Voluntário"}
                        </span>
                        <span className="text-xs text-gray-500">{user.course}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/users/${user.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workshops Management */}
        <Card className="ellp-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#062b5b]">Oficinas Cadastradas</CardTitle>
            <Button className="ellp-button-primary" asChild>
              <Link href="/workshops/new">
                <Plus className="w-4 h-4 mr-2" />
                Nova Oficina
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((workshop) => (
                <div key={workshop.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="relative h-32">
                    <Image
                      src={workshop.image || "/placeholder.svg?height=128&width=256"}
                      alt={workshop.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2 text-[#062b5b]">{workshop.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {new Date(workshop.workshopDate).toLocaleDateString("pt-BR")}
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/workshops/${workshop.id}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                        onClick={() => deleteWorkshop(workshop.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
