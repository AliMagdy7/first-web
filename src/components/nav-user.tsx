"use client"

import { LogOut } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/UserContext"
import { useState, useEffect } from "react"

export function NavUser() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const router = useRouter()
  const { user } = useUser()
  const [mounted, setMounted] = useState(false)
  const [hover, setHover] = useState(false)
  const [profileHover, setProfileHover] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted || !user) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-between">
        <div
          className="relative flex items-center"
          onMouseEnter={() => setProfileHover(true)}
          onMouseLeave={() => setProfileHover(false)}
        >
          <SidebarMenuButton
            size="lg"
            className="flex-1 cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={user.avatar}
                alt={user.name}
              />

              <AvatarFallback className="rounded-lg">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {!isCollapsed && (
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-medium">
                  {user.name}
                </span>

                <span className="truncate text-xs">
                  {user.email}
                </span>
              </div>
            )}
          </SidebarMenuButton>

          {isCollapsed && profileHover && (
            <div className="absolute left-full ml-2 flex items-center z-50 -translate-y-1">
              <span className="mr-[-4px] w-2 h-2 rotate-45 bg-black dark:bg-gray-300"></span>

              <span className="px-2 py-1 bg-black text-white dark:bg-gray-300 dark:text-black text-xs rounded-md whitespace-nowrap shadow-md transition-colors duration-200">
                Profile
              </span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div
            className="relative flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => console.log("Log out clicked")}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <LogOut className="size-4 text-gray-800 dark:text-gray-200 transition-colors duration-200" />

            {hover && (
              <div className="absolute left-full ml-2 flex items-center z-50 -translate-y-1">
                <span className="mr-[-4px] w-2 h-2 rotate-45 bg-black dark:bg-gray-300"></span>

                <span className="px-2 py-1 bg-black text-white dark:bg-gray-300 dark:text-black text-xs rounded-md whitespace-nowrap shadow-md transition-colors duration-200">
                  Log out
                </span>
              </div>
            )}
          </div>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}