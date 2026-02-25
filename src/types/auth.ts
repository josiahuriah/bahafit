export type UserRole = 'user' | 'admin'

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


export interface Registration {
  _id?: string
  eventId: string
  eventTitle: string
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
