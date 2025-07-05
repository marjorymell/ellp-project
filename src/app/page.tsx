"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db, isUsingRealFirebase } from "../lib/firebase"
import type { Workshop } from "../lib/types"
import WorkshopCard from "../components/workshop-card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { AlertTriangle, Calendar, Sparkles, Target, Users, Lightbulb } from "lucide-react"
import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import Footer from "../components/footer"

export default function HomePage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        if (!isUsingRealFirebase || !db) {
          console.log("Firebase não configurado, exibindo página sem dados")
          setWorkshops([])
          setLoading(false)
          return
        }

        console.log("Buscando oficinas...")
        const q = query(collection(db, "workshops"), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)
        const workshopsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Workshop[]

        console.log(`${workshopsData.length} oficinas encontradas`)
        setWorkshops(workshopsData)
      } catch (error: any) {
        console.error("Erro ao buscar oficinas:", error)
        if (error.code === "permission-denied" || error.message.includes("Firebase")) {
          console.log("Problema de configuração do Firebase, continuando sem dados")
          setWorkshops([])
        } else {
          setError(error.message || "Erro ao carregar oficinas")
        }
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchWorkshops()
    }, 100)

    return () => clearTimeout(timer)
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
      <section className="ellp-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <h1 className="text-5xl font-bold text-white mb-6">ELLP - Ensino Lúdico de Lógica de Programação</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Descubra nossas oficinas de programação e participe de uma experiência de aprendizado única e divertida!
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                className="ellp-button-hero text-lg px-8 py-3 shine-effect cursor-pointer"
                onClick={() => {
                  document.getElementById("workshops")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Ver Oficinas
              </Button>
              <Button
                variant="outline"
                className="text-lg px-8 py-3 bg-white/10 border-white text-white hover:bg-white hover:text-[#0075ca] transition-all duration-300 hover:scale-105 cursor-pointer"
                asChild
              >
                <Link href="/register">Seja Voluntário</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div id='sobre' className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Sobre o Projeto */}
        <section className="mb-16 slide-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#062b5b] mb-4">Sobre o Projeto ELLP</h2>
            <div className="w-24 h-1 bg-[#f58e2f] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="ellp-card text-center p-6">
              <CardHeader>
                <Target className="w-12 h-12 mx-auto mb-4 text-[#f58e2f] ellp-icon" />
                <CardTitle className="text-xl text-[#062b5b]">Nossa Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tornar o aprendizado de lógica de programação mais acessível e divertido através de metodologias
                  lúdicas e interativas.
                </p>
              </CardContent>
            </Card>

            <Card className="ellp-card text-center p-6">
              <CardHeader>
                <Lightbulb className="w-12 h-12 mx-auto mb-4 text-[#f58e2f] ellp-icon" />
                <CardTitle className="text-xl text-[#062b5b]">Metodologia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Utilizamos jogos, desafios práticos e atividades interativas para ensinar conceitos fundamentais de
                  programação.
                </p>
              </CardContent>
            </Card>

            <Card className="ellp-card text-center p-6">
              <CardHeader>
                <Users className="w-12 h-12 mx-auto mb-4 text-[#f58e2f] ellp-icon" />
                <CardTitle className="text-xl text-[#062b5b]">Comunidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Uma rede de voluntários dedicados a compartilhar conhecimento e criar um ambiente de aprendizado
                  colaborativo.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <br />
              <Link href="/debug-config" className="underline cursor-pointer">
                Verificar configuração
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Workshops Section */}
        <section id="workshops" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#062b5b] mb-4">Oficinas Disponíveis</h2>
            <div className="w-24 h-1 bg-[#f58e2f] mx-auto rounded-full"></div>
          </div>

          {workshops.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Calendar className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-semibold text-[#062b5b] mb-4">Nenhuma oficina disponível no momento</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Fique atento! Novas oficinas serão divulgadas em breve.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button className="ellp-button-primary cursor-pointer" asChild>
                    <Link href="/register">Registrar-se como Voluntário</Link>
                  </Button>
                  {!isUsingRealFirebase && (
                    <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                      <Link href="/setup-admin">Configurar Administrador</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workshops.map((workshop, index) => (
                <div key={workshop.id} className="slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <WorkshopCard workshop={workshop} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Demo Mode Info */}
        {!isUsingRealFirebase && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Modo Demonstração</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                O Firebase não está configurado. Esta é uma versão de demonstração do sistema.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-blue-600">Para ativar todas as funcionalidades:</p>
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
      <Footer />
    </div>
  )
}
