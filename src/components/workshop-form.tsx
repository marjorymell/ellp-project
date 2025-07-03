"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUploadCloudinary from "./image-upload-cloudinary"
import type { Workshop } from "@/lib/types"

interface WorkshopFormProps {
  workshop?: Workshop
  onSubmit: (data: Omit<Workshop, "id" | "createdAt" | "createdBy">) => Promise<void>
  onCancel: () => void
}

export default function WorkshopForm({ workshop, onSubmit, onCancel }: WorkshopFormProps) {
  const [formData, setFormData] = useState({
    title: workshop?.title || "",
    description: workshop?.description || "",
    image: workshop?.image || "",
    workshopDate: workshop?.workshopDate || "",
    registrationDate: workshop?.registrationDate || "",
    registrationLink: workshop?.registrationLink || "",
    schedule: workshop?.schedule || "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Erro ao salvar oficina:", error)
      alert("Erro ao salvar oficina")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUploaded = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }))
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{workshop ? "Editar Oficina" : "Nova Oficina"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Oficina *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          <ImageUploadCloudinary
            onImageUploaded={handleImageUploaded}
            currentImage={formData.image}
            label="Imagem da Oficina *"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workshopDate">Data da Oficina *</Label>
              <Input
                id="workshopDate"
                type="date"
                value={formData.workshopDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, workshopDate: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule">Horário *</Label>
              <Input
                id="schedule"
                placeholder="Ex: 14:00 - 16:00"
                value={formData.schedule}
                onChange={(e) => setFormData((prev) => ({ ...prev, schedule: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationDate">Data Limite para Inscrições *</Label>
            <Input
              id="registrationDate"
              type="date"
              value={formData.registrationDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, registrationDate: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationLink">Link de Inscrição *</Label>
            <Input
              id="registrationLink"
              type="url"
              placeholder="https://..."
              value={formData.registrationLink}
              onChange={(e) => setFormData((prev) => ({ ...prev, registrationLink: e.target.value }))}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" 
            className="text-white" 
            style={{
              backgroundColor: "#F58E2F",
              borderColor: "#F58E2F"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ffa34f";
              e.currentTarget.style.borderColor = "#ffa34f";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#F58E2F";
              e.currentTarget.style.borderColor = "#F58E2F";
            }}
            
            disabled={loading || !formData.image}>
              {loading ? "Salvando..." : "Salvar Oficina"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
