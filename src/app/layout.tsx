import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ELLP Project - Ensino Lúdico de Lógica de Programação",
  description: "Plataforma para divulgação de oficinas do projeto ELLP",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}


