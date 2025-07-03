export interface Workshop {
  id: string;
  title: string;
  description: string;
  image: string;
  workshopDate: string;
  registrationDate: string;
  registrationLink: string;
  schedule: string;
  createdAt: string;
  createdBy: string;
}

export interface User {
  rejectionReason: any;
  rejectedAt: any;
  id: string;
  name: string;
  email: string;
  course: string;
  photo: string;
  role: "admin" | "volunteer";
  isVisibleOnContact: boolean;
  createdAt: string;
  status: "active" | "pending" | "rejected";
}

export interface AuthUser {
  uid: string;
  email: string;
  role: "admin" | "volunteer";
  status: "active" | "pending" | "rejected";
}

export interface VolunteerRequest {
  id: string;
  name: string;
  email: string;
  course: string;
  photo: string;
  isVisibleOnContact: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}
