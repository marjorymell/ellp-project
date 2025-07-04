"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  type User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, isUsingRealFirebase } from "../lib/firebase";
import type { AuthUser } from "../lib/types";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isUsingRealFirebase || !auth) {
      console.log("Firebase não configurado, modo demonstração");
      setLoading(false);
      return;
    }

    let mounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        try {
          if (!mounted) return;

          if (firebaseUser && db) {
            console.log("Usuário autenticado:", firebaseUser.uid);
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

            if (!mounted) return;

            if (userDoc.exists()) {
              const userData = userDoc.data();
              console.log("Dados do usuário:", userData);

              // Verificar se a conta está ativa
              if (userData.status === "pending") {
                console.log("Conta pendente de aprovação");
                await signOut(auth);
                setUser(null);
                alert(
                  "Sua conta ainda está pendente de aprovação por um administrador."
                );
                return;
              }

              if (userData.status === "rejected") {
                console.log("Conta rejeitada");
                await signOut(auth);
                setUser(null);
                alert(
                  "Sua solicitação foi rejeitada. Entre em contato com um administrador."
                );
                return;
              }

              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                role: userData.role,
                status: userData.status || "active",
              });
            } else {
              console.error("Usuário não encontrado no Firestore");
              await signOut(auth);
              setUser(null);
            }
          } else {
            console.log("Usuário não autenticado");
            setUser(null);
          }
        } catch (error) {
          console.error("Erro ao verificar usuário:", error);
          if (mounted) {
            setUser(null);
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!isUsingRealFirebase || !auth) {
      throw new Error(
        "Firebase não configurado. Configure as variáveis de ambiente."
      );
    }

    try {
      console.log("Tentando fazer login:", email);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (!isUsingRealFirebase || !auth) {
      setUser(null);
      return;
    }

    try {
      await signOut(auth);
      setUser(null);
      console.log("Logout realizado com sucesso");
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
