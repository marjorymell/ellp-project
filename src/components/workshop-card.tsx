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
    <Card className="ellp-card overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={workshop.image || "/placeholder.svg?height=200&width=400"}
          alt={workshop.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <CardHeader className="flex-grow">
        <CardTitle className="text-xl text-[#062b5b] line-clamp-2">{workshop.title}</CardTitle>
        <p className="text-gray-600 text-sm line-clamp-3">{workshop.description}</p>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-[#f58e2f]" />
          <span>Oficina: {new Date(workshop.workshopDate).toLocaleDateString("pt-BR")}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-[#f58e2f]" />
          <span>Horário: {workshop.schedule}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-[#0075ca]" />
          <span>Inscrições até: {new Date(workshop.registrationDate).toLocaleDateString("pt-BR")}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="ellp-button-primary w-full">
          <a href={workshop.registrationLink} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Inscrever-se
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
