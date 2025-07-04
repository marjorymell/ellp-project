"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, User, Settings, Plus, UserPlus } from "lucide-react"

export default function Navbar() {
  const { user, logout, loading } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  if (loading) {
    return (
      <nav className="shadow-sm bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
            </div>
            <div className="flex items-center">
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="shadow-sm bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image src="/ellp_logo.png" alt="ELLP Project" width={120} height={40} className="h-10 w-auto" priority />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/" className="ellp-nav-link">
              Início
            </Link>
            <Link href="/contato" className="ellp-nav-link">
              Contato
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Button className="ellp-header-button ellp-header-button-primary" asChild>
                  <Link href="/workshops/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Oficina
                  </Link>
                </Button>

                {user.role === "admin" && (
                  <Button className="ellp-header-button ellp-header-button-secondary" asChild>
                    <Link href="/admin">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}

                {user.role === "volunteer" && (
                  <Button className="ellp-header-button ellp-header-button-secondary" asChild>
                    <Link href="/volunteer">
                      <User className="w-4 h-4 mr-2" />
                      Minhas Oficinas
                    </Link>
                  </Button>
                )}

                <Button onClick={handleLogout} className="ellp-header-button ellp-header-button-outline">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button className="ellp-header-button ellp-header-button-primary" asChild>
                  <Link href="/register">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrar
                  </Link>
                </Button>
                <Button className="ellp-header-button ellp-header-button-secondary" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
