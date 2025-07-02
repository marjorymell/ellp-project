"use client"

import Image from "next/image"
import type { Workshop } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, ExternalLink } from "lucide-react"

interface WorkshopCardProps {
  workshop: Workshop
}

export default function WorkshopCard({ workshop }: WorkshopCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
      <div className="relative h-48">
        <Image
          src={workshop.image || "/placeholder.svg?height=200&width=400"}
          alt={workshop.title}
          fill
          className="object-cover"
        />
      </div>

      <CardHeader>
        <CardTitle className="text-lg">{workshop.title}</CardTitle>
        <p className="text-sm text-gray-600">{workshop.description}</p>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Oficina: {new Date(workshop.workshopDate).toLocaleDateString("pt-BR")}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>Horário: {workshop.schedule}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Inscrições até: {new Date(workshop.registrationDate).toLocaleDateString("pt-BR")}</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          asChild
          className="w-full"
          style={{
            backgroundColor: "#F58E2F",
            color: "white",
            border: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#e07a1f"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#F58E2F"
          }}
        >
          <a href={workshop.registrationLink} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Inscrever-se
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
