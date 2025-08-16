"use client"
import { createContext, useContext, useState, ReactNode } from "react"

export type User = {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  affiliation: string
  country: string
  subscribed?: boolean // ← أضفنا الخاصية دي
}

type UserContextType = {
  user: User
  setUser: (user: User) => void
  updateUserField: (field: keyof User, value: string | boolean) => void // ← قبلنا boolean
  setUserAvatar: (avatar: string) => void
}

const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = ({
  initialUser,
  children,
}: {
  initialUser: User
  children: ReactNode
}) => {
  const [user, setUser] = useState<User>(initialUser)

  const setUserAvatar = (avatar: string) => {
    setUser((prev) => ({ ...prev, avatar }))
  }

  const updateUserField = (field: keyof User, value: string | boolean) => {
    setUser((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <UserContext.Provider value={{ user, setUser, updateUserField, setUserAvatar }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser must be used within a UserProvider")
  return context
}