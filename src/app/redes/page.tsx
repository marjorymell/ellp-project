"use client"

import { Globe, Instagram, Github, Linkedin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Footer from "@/components/footer"

export default function EllpNasRedes() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="ellp-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <h1 className="text-5xl font-bold text-white mb-6">ELLP nas Redes</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Acompanhe o grupo que inspirou nosso projeto e todas nossas atividades relacionadas!
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#062b5b] mb-4">Redes ELLP</h2>
          <div className="w-24 h-1 bg-[#f58e2f] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* card site oficial */}
          <Card className="ellp-card text-center p-6 hover:border-[#f58e2f]">
            <CardHeader>
              <Globe className="w-12 h-12 mx-auto mb-4 text-[#F58E2F] ellp-icon"/>
              <CardTitle className="text-xl text-[#062b5b]">Site oficial do Grupo ELLP</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Acesse o site oficial do grupo e veja todas as informações sobre o projeto!
              </p>
              <Button className="ellp-button-website" asChild>
                <Link 
                  href="https://grupoellp.com.br/" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Acessar site
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* card instagram */}
          <Card className="ellp-card text-center p-6 hover:border-[#f58e2f]">
            <CardHeader>
              <Instagram className="w-12 h-12 mx-auto mb-4 text-[#F58E2F] ellp-icon"/>
              <CardTitle className="text-xl text-[#062b5b]">@grupoellp no Instagram</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Acompanhe as oficinas, eventos e o dia a dia do projeto original através do Instagram
              </p>
              <Button className="ellp-button-instagram" asChild>
                <Link 
                  href="https://www.instagram.com/grupoellp/" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Seguir no Instagram
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* card linkedin*/}
          <Card className="ellp-card text-center p-6 hover:border-[#f58e2f]">
            <CardHeader>
              <Linkedin className="w-12 h-12 mx-auto mb-4 text-[#F58E2F] ellp-icon"/>
              <CardTitle className="text-xl text-[#062b5b]">Grupo ELLP no Linkedin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Acesse a página do Linkedin do grupo e acompanhe suas publicações profissionais!
              </p>
            <Button className="ellp-button-linkedin" asChild>
                <Link 
                  href="https://www.linkedin.com/company/grupoellp/" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver no Linkedin
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* card github */}
          <Card className="ellp-card text-center p-6 hover:border-[#f58e2f]">
            <CardHeader>
              <Github className="w-12 h-12 mx-auto mb-4 text-[#F58E2F] ellp-icon"/>
              <CardTitle className="text-xl text-[#062b5b]">ellp-project no GitHub</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Acesse nosso código-fonte, contribua com o projeto e acompanhe nosso desenvolvimento
              </p>
              <Button className="ellp-button-github" asChild>
                <Link 
                  href="https://github.com/marjorymell/ellp-project" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver no GitHub
                </Link>
              </Button>
            </CardContent>
          </Card>

        </div>
      </section>
      <Footer/>
    </div>
  )
}