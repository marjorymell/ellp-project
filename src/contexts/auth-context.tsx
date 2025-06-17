"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { AuthUser } from "@/lib/types"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          console.log("🔍 Buscando usuário com UID:", firebaseUser.uid)

          // Tentar primeiro com "users" (minúsculo)
          let userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

          // Se não encontrar, tentar com "Users" (maiúsculo)
          if (!userDoc.exists()) {
            console.log("⚠️ Não encontrado em 'users', tentando 'Users'...")
            userDoc = await getDoc(doc(db, "Users", firebaseUser.uid))
          }

          console.log("📄 Documento existe?", userDoc.exists())
          console.log("📍 Collection testada:", userDoc.exists() ? "encontrado" : "não encontrado")

          if (userDoc.exists()) {
            const userData = userDoc.data()
            console.log("✅ Dados do usuário:", userData)

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              role: userData.role,
            })
          } else {
            console.error("❌ Documento não encontrado em nenhuma collection")
            console.log("🔍 UID procurado:", firebaseUser.uid)
            console.log("📋 Verifique se existe um documento com este UID exato no Firestore")
            setUser(null)
          }
        } catch (error) {
          console.error("💥 Erro ao buscar dados do usuário:", error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log("🔐 Login realizado com UID:", result.user.uid)
    } catch (error) {
      console.error("❌ Erro no login:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error("❌ Erro no logout:", error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
