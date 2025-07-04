"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/auth-context";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import type { User } from "../../../lib/types";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  UserIcon,
  Mail,
  GraduationCap,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";

export default function VolunteerRequestsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [processedUsers, setProcessedUsers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/");
      return;
    }

    if (user && user.role === "admin") {
      fetchUsers();
    }
  }, [user, loading, router]);

  const fetchUsers = async () => {
    try {
      // Buscar usuários pendentes
      const pendingQuery = query(
        collection(db, "users"),
        where("status", "==", "pending")
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      const pendingData = pendingSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      // Buscar usuários rejeitados (para histórico)
      const rejectedQuery = query(
        collection(db, "users"),
        where("status", "==", "rejected")
      );
      const rejectedSnapshot = await getDocs(rejectedQuery);
      const rejectedData = rejectedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      // Ordenar por data de criação (mais recentes primeiro)
      pendingData.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      rejectedData.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPendingUsers(pendingData);
      setProcessedUsers(rejectedData);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const approveUser = async (userToApprove: User) => {
    setProcessingId(userToApprove.id);

    try {
      // Perguntar ao admin se o usuário deve aparecer na página de contato
      const shouldBeVisible = confirm(
        `Aprovar ${userToApprove.name} como voluntário?\n\n` +
          `Clique "OK" para aprovar E incluir na página de contato\n` +
          `Clique "Cancelar" para aprovar MAS NÃO incluir na página de contato`
      );

      // Se o usuário cancelar, perguntar se ainda quer aprovar
      let finalApproval = shouldBeVisible;
      if (!shouldBeVisible) {
        finalApproval = confirm(
          `Aprovar ${userToApprove.name} como voluntário?\n\n` +
            `(Não aparecerá na página de contato)`
        );
      }

      if (!finalApproval) {
        setProcessingId(null);
        return;
      }

      // Atualizar status do usuário para "active"
      await updateDoc(doc(db, "users", userToApprove.id), {
        status: "active",
        isVisibleOnContact: shouldBeVisible, // Definir baseado na escolha do admin
        approvedAt: new Date().toISOString(),
        approvedBy: user?.uid,
      });

      const visibilityMessage = shouldBeVisible
        ? "e aparecerá na página de contato"
        : "mas NÃO aparecerá na página de contato";

      alert(
        `✅ Voluntário ${userToApprove.name} aprovado com sucesso!\n\n` +
          `Ele já pode fazer login no sistema ${visibilityMessage}.`
      );

      fetchUsers();
    } catch (error: any) {
      console.error("Erro ao aprovar usuário:", error);
      alert("Erro ao aprovar usuário: " + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const rejectUser = async (userToReject: User) => {
    if (!rejectionReason.trim()) {
      alert("Por favor, informe o motivo da rejeição");
      return;
    }

    setProcessingId(userToReject.id);

    try {
      await updateDoc(doc(db, "users", userToReject.id), {
        status: "rejected",
        rejectedAt: new Date().toISOString(),
        rejectedBy: user?.uid,
        rejectionReason: rejectionReason.trim(),
      });

      alert(`❌ Usuário ${userToReject.name} rejeitado`);
      setRejectionReason("");
      setShowRejectionForm(null);
      fetchUsers();
    } catch (error) {
      console.error("Erro ao rejeitar usuário:", error);
      alert("Erro ao rejeitar usuário");
    } finally {
      setProcessingId(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (
      confirm(
        "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        await deleteDoc(doc(db, "users", userId));
        fetchUsers();
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Erro ao excluir usuário");
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
          Aprovação de Voluntários
        </h1>
        <p className="text-gray-600">
          Gerencie as contas de voluntários que precisam de aprovação
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingUsers.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {/* Buscar usuários ativos seria necessário uma query adicional */}
              -
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {processedUsers.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usuários Pendentes */}
      {pendingUsers.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-600" />
              Contas Pendentes de Aprovação ({pendingUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pendingUsers.map((pendingUser) => (
                <div
                  key={pendingUser.id}
                  className="border rounded-lg p-6 bg-yellow-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={
                            pendingUser.photo ||
                            "/placeholder.svg?height=64&width=64"
                          }
                          alt={pendingUser.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold flex items-center">
                          <UserIcon className="w-4 h-4 mr-2" />
                          {pendingUser.name}
                        </h3>
                        <p className="text-gray-600 flex items-center mt-1">
                          <Mail className="w-4 h-4 mr-2" />
                          {pendingUser.email}
                        </p>
                        <p className="text-gray-600 flex items-center mt-1">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          {pendingUser.course}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Registrado em:{" "}
                          {new Date(pendingUser.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Eye className="w-4 h-4 mr-1" />
                          Visibilidade na página de contato será definida na
                          aprovação
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      Pendente
                    </Badge>
                  </div>

                  {showRejectionForm === pendingUser.id ? (
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="rejectionReason">
                          Motivo da rejeição *
                        </Label>
                        <Textarea
                          id="rejectionReason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Explique o motivo da rejeição..."
                          rows={3}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="destructive"
                          onClick={() => rejectUser(pendingUser)}
                          disabled={processingId === pendingUser.id}
                        >
                          {processingId === pendingUser.id
                            ? "Rejeitando..."
                            : "Confirmar Rejeição"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowRejectionForm(null);
                            setRejectionReason("");
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-2 mt-4">
                      <Button
                        onClick={() => approveUser(pendingUser)}
                        disabled={processingId === pendingUser.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {processingId === pendingUser.id
                          ? "Aprovando..."
                          : "Aprovar"}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setShowRejectionForm(pendingUser.id)}
                        disabled={processingId === pendingUser.id}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usuários Rejeitados */}
      {processedUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Contas Rejeitadas ({processedUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedUsers.map((rejectedUser) => (
                <div key={rejectedUser.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-12 h-12">
                        <Image
                          src={
                            rejectedUser.photo ||
                            "/placeholder.svg?height=48&width=48"
                          }
                          alt={rejectedUser.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{rejectedUser.name}</h4>
                        <p className="text-sm text-gray-600">
                          {rejectedUser.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          Rejeitado em:{" "}
                          {rejectedUser.rejectedAt
                            ? new Date(
                                rejectedUser.rejectedAt
                              ).toLocaleDateString("pt-BR")
                            : "Data não disponível"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-800"
                      >
                        Rejeitada
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteUser(rejectedUser.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                  {rejectedUser.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                      <strong>Motivo da rejeição:</strong>{" "}
                      {rejectedUser.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {pendingUsers.length === 0 && processedUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma solicitação encontrada
            </h3>
            <p className="text-gray-600">
              Quando alguém se registrar como voluntário, aparecerá aqui.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
