"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { User, Workshop } from "../../lib/types";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  FileText,
  Clock,
  UserCheck,
  Settings,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [pendingUsersCount, setPendingUsersCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/");
      return;
    }

    if (user && user.role === "admin") {
      fetchData();
    }
  }, [user, loading, router]);

  const fetchData = async () => {
    try {
      // Buscar usuários ativos
      const activeUsersQuery = query(
        collection(db, "users"),
        where("status", "==", "active")
      );
      const usersSnapshot = await getDocs(activeUsersQuery);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      // Buscar usuários pendentes (apenas para contar)
      const pendingUsersQuery = query(
        collection(db, "users"),
        where("status", "==", "pending")
      );
      const pendingSnapshot = await getDocs(pendingUsersQuery);
      setPendingUsersCount(pendingSnapshot.docs.length);

      // Buscar oficinas
      const workshopsSnapshot = await getDocs(collection(db, "workshops"));
      const workshopsData = workshopsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Workshop[];

      setUsers(usersData);
      setWorkshops(workshopsData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        setUsers(users.filter((u) => u.id !== userId));
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Erro ao excluir usuário");
      }
    }
  };

  const deleteWorkshop = async (workshopId: string) => {
    if (confirm("Tem certeza que deseja excluir esta oficina?")) {
      try {
        await deleteDoc(doc(db, "workshops", workshopId));
        setWorkshops(workshops.filter((w) => w.id !== workshopId));
      } catch (error) {
        console.error("Erro ao excluir oficina:", error);
        alert("Erro ao excluir oficina");
      }
    }
  };

  if (loading || loadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Painel Administrativo
        </h1>
        <p className="text-gray-600">
          Gerencie usuários, oficinas e solicitações do sistema ELLP
        </p>
      </div>

      {/* Botões de Ação Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link href="/admin/volunteer-requests">
          <Button
            className={`w-full h-16 text-left justify-start ${
              pendingUsersCount > 0
                ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <UserCheck className="w-6 h-6" />
              <div>
                <div className="font-semibold">Solicitações</div>
                <div className="text-sm opacity-90">
                  {pendingUsersCount > 0
                    ? `${pendingUsersCount} pendente${
                        pendingUsersCount > 1 ? "s" : ""
                      }`
                    : "Gerenciar"}
                </div>
              </div>
            </div>
          </Button>
        </Link>

        <Link href="/admin/users/new">
          <Button className="w-full h-16 text-left justify-start bg-green-600 hover:bg-green-700 text-white">
            <div className="flex items-center space-x-3">
              <Plus className="w-6 h-6" />
              <div>
                <div className="font-semibold">Novo Usuário</div>
                <div className="text-sm opacity-90">Criar conta</div>
              </div>
            </div>
          </Button>
        </Link>

        <Link href="/workshops/new">
          <Button className="w-full h-16 text-left justify-start bg-purple-600 hover:bg-purple-700 text-white">
            <div className="flex items-center space-x-3">
              <Plus className="w-6 h-6" />
              <div>
                <div className="font-semibold">Nova Oficina</div>
                <div className="text-sm opacity-90">Criar poster</div>
              </div>
            </div>
          </Button>
        </Link>

        <Button className="w-full h-16 text-left justify-start bg-gray-600 hover:bg-gray-700 text-white">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6" />
            <div>
              <div className="font-semibold">Configurações</div>
              <div className="text-sm opacity-90">Sistema</div>
            </div>
          </div>
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuários Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.filter((u) => u.role === "admin").length} admins,{" "}
              {users.filter((u) => u.role === "volunteer").length} voluntários
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Oficinas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workshops.length}</div>
            <p className="text-xs text-muted-foreground">
              Oficinas cadastradas
            </p>
          </CardContent>
        </Card>

        <Card
          className={
            pendingUsersCount > 0 ? "border-yellow-200 bg-yellow-50" : ""
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contas Pendentes
            </CardTitle>
            <Clock
              className={`h-4 w-4 ${
                pendingUsersCount > 0
                  ? "text-yellow-600"
                  : "text-muted-foreground"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                pendingUsersCount > 0 ? "text-yellow-600" : ""
              }`}
            >
              {pendingUsersCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando aprovação
            </p>
            {pendingUsersCount > 0 && (
              <Link href="/admin/volunteer-requests">
                <Button
                  size="sm"
                  className="w-full mt-2 bg-yellow-600 hover:bg-yellow-700"
                >
                  <UserCheck className="w-4 h-4 mr-1" />
                  Gerenciar
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/volunteer-requests">
              <Button
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Solicitações
              </Button>
            </Link>
            <Link href="/admin/users/new">
              <Button
                size="sm"
                variant="outline"
                className="w-full bg-transparent"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </Link>
            <Link href="/workshops/new">
              <Button
                size="sm"
                variant="outline"
                className="w-full bg-transparent"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Oficina
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alerta para contas pendentes */}
      {pendingUsersCount > 0 && (
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <Clock className="w-5 h-5 mr-2" />
              {pendingUsersCount} Conta{pendingUsersCount > 1 ? "s" : ""} de
              Voluntário
              {pendingUsersCount > 1 ? "s" : ""} Pendente
              {pendingUsersCount > 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 mb-4">
              Há {pendingUsersCount} pessoa{pendingUsersCount > 1 ? "s" : ""}{" "}
              aguardando aprovação para se tornar
              {pendingUsersCount > 1 ? "em" : ""} voluntário
              {pendingUsersCount > 1 ? "s" : ""}.
            </p>
            <Link href="/admin/volunteer-requests">
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                <UserCheck className="w-4 h-4 mr-2" />
                Revisar Solicitações
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Gerenciamento de Usuários */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Usuários Ativos do Sistema</CardTitle>
          <Link href="/admin/users/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-10 h-10">
                    <Image
                      src={user.photo || "/placeholder.svg?height=40&width=40"}
                      alt={user.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      {user.role === "admin" ? "Administrador" : "Voluntário"} •{" "}
                      {user.course}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/admin/users/${user.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
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

      {/* Gerenciamento de Oficinas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Oficinas Cadastradas</CardTitle>
          <Link href="/workshops/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Oficina
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workshops.map((workshop) => (
              <div
                key={workshop.id}
                className="border rounded-lg overflow-hidden"
              >
                <div className="relative h-32">
                  <Image
                    src={
                      workshop.image || "/placeholder.svg?height=128&width=256"
                    }
                    alt={workshop.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">{workshop.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(workshop.workshopDate).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                  <div className="flex space-x-2">
                    <Link href={`/workshops/${workshop.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
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
  );
}
