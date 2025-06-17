export interface Workshop {
  id: string
  title: string
  description: string
  image: string
  workshopDate: string
  registrationDate: string
  registrationLink: string
  schedule: string
  createdAt: string
  createdBy: string
}

export interface User {
  id: string
  name: string
  email: string
  course: string
  photo: string
  role: "admin" | "volunteer"
  isVisibleOnContact: boolean
  createdAt: string
}

export interface AuthUser {
  uid: string
  email: string
  role: "admin" | "volunteer"
}
