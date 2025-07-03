"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, isUsingRealFirebase } from "../lib/firebase";
import type { Workshop } from "../lib/types";
import WorkshopCard from "../components/workshop-card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertTriangle, Users, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function HomePage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        // Verificar se o Firebase está configurado
        if (!isUsingRealFirebase || !db) {
          console.log("Firebase não configurado, exibindo página sem dados");
          setWorkshops([]);
          setLoading(false);
          return;
        }

        console.log("Buscando oficinas...");
        const q = query(
          collection(db, "workshops"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const workshopsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Workshop[];

        console.log(`${workshopsData.length} oficinas encontradas`);
        setWorkshops(workshopsData);
      } catch (error: any) {
        console.error("Erro ao buscar oficinas:", error);
        // Não mostrar erro se for apenas problema de configuração
        if (
          error.code === "permission-denied" ||
          error.message.includes("Firebase")
        ) {
          console.log(
            "Problema de configuração do Firebase, continuando sem dados"
          );
          setWorkshops([]);
        } else {
          setError(error.message || "Erro ao carregar oficinas");
        }
      } finally {
        setLoading(false);
      }
    };

    // Adicionar um pequeno delay para garantir que tudo está inicializado
    const timer = setTimeout(() => {
      fetchWorkshops();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ backgroundColor: "#E3F2FF" }}
      >
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E3F2FF" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ELLP - Ensino Lúdico de Lógica de Programação
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Descubra nossas oficinas de programação e participe de uma
            experiência de aprendizado única e divertida!
          </p>

          {/* Call to Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white hover:shadow-[0_4px_20px_-2px_rgba(245,142,47,0.6)] transition-shadow">
              <CardHeader className="text-center">
                <BookOpen
                  className="w-8 h-8 mx-auto mb-2"
                  style={{ color: "#F58E2F" }}
                />
                <CardTitle className="text-lg" style={{ color: "#062B5B" }}>
                  Participe das Oficinas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Explore nossas oficinas de programação e aprenda de forma
                  divertida e interativa.
                </p>
                <Button
                  size="sm"
                  className="w-full text-white transition-colors duration-200"
                  style={{ backgroundColor: "#0075CA" }}
                  onClick={() => {
                    document.getElementById("workshops")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#005A9E";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#0075CA";
                  }}
                >
                  Ver Oficinas!
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-[0_4px_20px_-2px_rgba(245,142,47,0.6)] transition-shadow">
              <CardHeader className="text-center">
                <Users
                  className="w-8 h-8 mx-auto mb-2"
                  style={{ color: "#F58E2F" }}
                />
                <CardTitle className="text-lg" style={{ color: "#062B5B" }}>
                  Seja um Voluntário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Junte-se à nossa equipe e ajude a ensinar programação para
                  outros estudantes.
                </p>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="w-full text-white transition-colors duration-200"
                    style={{ backgroundColor: "#0075CA" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#005a9e";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#0075CA";
                    }}
                  >
                    Registrar-se
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-[0_4px_20px_-2px_rgba(245,142,47,0.6)] transition-shadow">
              <CardHeader className="text-center">
                <Calendar
                  className="w-8 h-8 mx-auto mb-2"
                  style={{ color: "#F58E2F" }}
                />
                <CardTitle className="text-lg" style={{ color: "#062B5B" }}>
                  Crie Oficinas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Voluntários podem criar e divulgar suas próprias oficinas na
                  plataforma.
                </p>
                <Link href="/login">
                  <Button
                    size="sm"
                    className="w-full text-white transition-colors duration-200"
                    style={{ backgroundColor: "#0075CA" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#005a9e";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#0075CA";
                    }}
                  >
                    Fazer Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mostrar erro apenas se for um erro real, não de configuração */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <br />
              <Link href="/debug-config" className="underline">
                Verificar configuração
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Workshops Section */}
        <div id="workshops" className="mb-8">
          <h2
            className="text-2xl font-bold text-gray-900 mb-6"
            style={{ color: "#062B5B" }}
          >
            Oficinas Disponíveis
          </h2>

          {workshops.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Nenhuma oficina disponível no momento
              </h3>
              <p className="text-gray-600 mb-6">
                Fique atento! Novas oficinas serão divulgadas em breve.
              </p>

              <div className="space-y-4">
                <p className="text-sm text-gray-500">Para começar:</p>
                <div className="flex justify-center space-x-4">
                  <Link href="/register">
                    <Button>Registrar-se como Voluntário</Button>
                  </Link>
                  {!isUsingRealFirebase && (
                    <Link href="/setup-admin">
                      <Button variant="outline">
                        Configurar Administrador
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
          )}
        </div>

        {/* Informação sobre configuração do Firebase */}
        {!isUsingRealFirebase && (
          <Card className="mt-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Modo Demonstração</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                O Firebase não está configurado. Esta é uma versão de
                demonstração do sistema.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-blue-600">
                  Para ativar todas as funcionalidades:
                </p>
                <ul className="text-sm text-blue-600 list-disc list-inside space-y-1">
                  <li>Configure as variáveis de ambiente do Firebase</li>
                  <li>Configure as variáveis de ambiente do Cloudinary</li>
                  <li>Execute o script de configuração</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
