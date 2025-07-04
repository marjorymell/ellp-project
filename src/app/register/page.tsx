"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    course: "",
    photo: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.course.trim()
    ) {
      setError("Por favor, preencha todos os campos obrigatórios");
      setLoading(false);
      return;
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, insira um email válido");
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Criando conta de voluntário...");
      console.log("📧 Email:", formData.email);

      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log(
        "✅ Usuário criado no Authentication:",
        userCredential.user.uid
      );

      // Criar documento do usuário com status "pending"
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        course: formData.course.trim(),
        photo: formData.photo.trim() || "",
        role: "volunteer",
        isVisibleOnContact: false, // Sempre false inicialmente, só true após aprovação
        status: "pending", // Conta criada mas pendente de aprovação
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userData);
      console.log("✅ Documento criado no Firestore:", userData);

      setSuccess(true);
    } catch (error: any) {
      console.error("❌ Erro ao criar conta:", error);

      // Mensagens de erro específicas
      let errorMessage = error.message;
      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "Este email já está em uso. Tente fazer login ou use outro email.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A senha deve ter pelo menos 6 caracteres.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido.";
      } else if (error.code === "auth/invalid-api-key") {
        errorMessage =
          "Erro de configuração do Firebase. Tente novamente mais tarde.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">
              Conta Criada!
            </CardTitle>
            <CardDescription>
              Sua conta foi criada e está aguardando aprovação
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Próximos Passos:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• Sua conta foi criada com sucesso</li>
                <li>• Um administrador precisa aprovar sua conta</li>
                <li>• Você poderá fazer login após a aprovação</li>
                <li>• Tempo estimado: 1-3 dias úteis</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Email cadastrado:</strong> {formData.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Nome:</strong> {formData.name}
              </p>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-700">
                <strong>Importante:</strong> Sua conta está com status
                &quot;pendente&quot;. Você só conseguirá fazer login após um
                administrador aprovar sua conta.
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              <Button onClick={() => router.push("/")} className="w-full">
                Voltar ao Início
              </Button>
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:underline"
              >
                Tentar fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle
            className="text-2xl font-bold"
            style={{ color: "#062B5B" }}
          >
            Registro de Voluntário
          </CardTitle>
          <CardDescription>
            Crie sua conta para participar como voluntário do projeto ELLP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-700">
              <strong>Processo de Aprovação:</strong> Sua conta será criada, mas
              precisará ser aprovada por um administrador antes de poder fazer
              login.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Curso *</Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, course: e.target.value }))
                }
                required
                placeholder="Ex: Ciência da Computação"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">URL da Foto (opcional)</Label>
              <Input
                id="photo"
                type="url"
                value={formData.photo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, photo: e.target.value }))
                }
                placeholder="https://exemplo.com/sua-foto.jpg"
              />
              <p className="text-xs text-gray-500">
                Cole o link de uma foto sua (ex: do LinkedIn, GitHub, etc.)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                required
                placeholder="Digite a senha novamente"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-white transition-colors duration-200"
              style={{
                backgroundColor: "#F58E2F",
                borderColor: "#F58E2F",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ffa34f";
                e.currentTarget.style.borderColor = "#ffa34f";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F58E2F";
                e.currentTarget.style.borderColor = "#F58E2F";
                e.currentTarget.style.color = "white";
              }}
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Fazer login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
