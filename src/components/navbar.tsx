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
      <nav className="shadow-sm" style={{ backgroundColor: "#0075CA" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-21">
            <div className="flex items-center">
              <div className="animate-pulse bg-blue-300 h-8 w-32 rounded"></div>
            </div>
            <div className="flex items-center">
              <div className="animate-pulse bg-blue-300 h-8 w-20 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="shadow-sm" style={{ backgroundColor: "#0075CA" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between h-21">
          <div className="flex items-center">
            <Link href="/" className="flex-items-center">
            <Image src="/ellp_logo.png" alt="ELLP Project" width={120} height={40} className="h-18 w-auto" priority />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/"
              className="transition-colors duration-200 border-2 border-[#F58E2F] px-3 py-1 rounded-lg"
              style={{ color: "#F58E2F" , fontSize: "17px" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffcc99",
                e.currentTarget.style.borderColor = "#ffcc99"
                e.currentTarget.style.backgroundColor = "rgba(112, 195, 255, 0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#F58E2F",
                e.currentTarget.style.borderColor = "#F58E2F"
                e.currentTarget.style.backgroundColor = "transparent"
              }}>
              <b>Início</b>
            </Link>
            <Link href="/contato"
              className="transition-colors duration-200 border-2 border-[#F58E2F] px-3 py-1 rounded-lg"
              style={{ color: "#F58E2F", fontSize: "17px" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffcc99"
                e.currentTarget.style.borderColor = "#ffcc99"
                e.currentTarget.style.backgroundColor = "rgba(112, 195, 255, 0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#F58E2F"
                e.currentTarget.style.borderColor =  "#F58E2F"
                e.currentTarget.style.backgroundColor = "transparent"
              }}>
              <b>Contato</b>
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/workshops/new">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white transition-colors duration-200"
                    style={{
                        backgroundColor: "#F58E2F",
                        borderColor: "#F58E2F"}}

                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffa34f"
                      e.currentTarget.style.borderColor = "#ffa34f"
                      e.currentTarget.style.color = "white"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#F58E2F"
                      e.currentTarget.style.borderColor = "#F58E2F"
                      e.currentTarget.style.color = "white"
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Oficina
                  </Button>
                </Link>

                {user.role === "admin" && (
                  <Link href="/admin">
                    <Button
                      variant="outline"
                    size="sm"
                    className="text-white transition-colors duration-200"
                    style={{
                        backgroundColor: "#F58E2F",
                         borderColor: "#F58E2F"}}
                    
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffa34f"
                      e.currentTarget.style.borderColor = "#ffa34f"
                      e.currentTarget.style.color = "white"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#F58E2F"
                      e.currentTarget.style.borderColor = "#F58E2F"
                      e.currentTarget.style.color = "white"
                    }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Administração
                    </Button>
                  </Link>
                )}

                {user.role === "volunteer" && (
                  <Link href="/volunteer">
                    <Button
                    variant="outline"
                    size="sm"
                    className="text-white transition-colors duration-200"
                    style={{
                        backgroundColor: "#F58E2F",
                         borderColor: "#F58E2F"}}
                    
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffa34f"
                      e.currentTarget.style.borderColor = "#ffa34f"
                      e.currentTarget.style.color = "white"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#F58E2F"
                      e.currentTarget.style.borderColor = "#F58E2F"
                      e.currentTarget.style.color = "white"
                    }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Minhas Oficinas
                    </Button>
                  </Link>
                )}

                <Button
                onClick={handleLogout}
                  variant="outline"
                    size="sm"
                    className="text-white transition-colors duration-200"
                    style={{
                        backgroundColor: "#d1002d",
                         borderColor: "#d1002d"}}

                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ff5145"
                      e.currentTarget.style.borderColor = "#ff5145"
                      e.currentTarget.style.color = "white"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#d1002d"
                      e.currentTarget.style.borderColor = "#d1002d"
                      e.currentTarget.style.color = "white"
                    }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/register">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white transition-colors duration-200"
                    style={{
                        backgroundColor: "#F58E2F",
                         borderColor: "#F58E2F"}}
                    
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffa34f"
                      e.currentTarget.style.borderColor = "#ffa34f"
                      e.currentTarget.style.color = "white"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#F58E2F"
                      e.currentTarget.style.borderColor = "#F58E2F"
                      e.currentTarget.style.color = "white"
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrar
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white transition-colors duration-200"
                    style={{
                        backgroundColor: "#F58E2F",
                         borderColor: "#F58E2F"}}
                    
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffa34f"
                      e.currentTarget.style.borderColor = "#ffa34f"
                      e.currentTarget.style.color = "white"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#F58E2F"
                      e.currentTarget.style.borderColor = "#F58E2F"
                      e.currentTarget.style.color = "white"
                    }}
                  >
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
