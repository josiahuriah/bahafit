export type UserRole = 'user' | 'business_owner' | 'event_organizer' | 'admin'

export interface User {
  _id?: string
  id?: string
  name: string
  email: string
  password?: string
  emailVerified?: Date | null
  image?: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  phone?: string
  bio?: string
  location?: {
    city?: string
    island?: string
    country?: string
  }
}

export interface BusinessProfile {
  userId: string
  businessName: string
  businessType: 'gym' | 'club' | 'wellness_center' | 'apparel' | 'equipment'
  verified: boolean
  listings: string[] // IDs of listings owned
  createdAt: Date
}

export interface OrganizerProfile {
  userId: string
  organizationName?: string
  verified: boolean
  events: string[] // IDs of events organized
  createdAt: Date
}

export interface Registration {
  _id?: string
  eventId: string
  userId: string
  userName: string
  userEmail: string
  ticketType?: string
  price: number
  currency: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'checked_in'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  paymentId?: string
  registeredAt: Date
  checkedInAt?: Date
  metadata?: Record<string, any>
}
