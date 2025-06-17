"use client"

import { useRouter } from "next/navigation"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import WorkshopForm from "@/components/workshop-form"
import type { Workshop } from "@/lib/types"

export default function NewWorkshopPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = async (data: Omit<Workshop, "id" | "createdAt" | "createdBy">) => {
    if (!user) return

    await addDoc(collection(db, "workshops"), {
      ...data,
      createdAt: new Date().toISOString(),
      createdBy: user.uid,
    })

    router.push("/admin")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <WorkshopForm onSubmit={handleSubmit} onCancel={() => router.push("/admin")} />
    </div>
  )
}
