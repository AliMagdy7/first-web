"use client"
import * as React from "react"
import {
  Hospital,
  FolderKanban,
  GalleryVerticalEnd,
  BookOpenText,
  Eye,
  Settings,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Ali Magdy",
    email: "alimagdy1234321@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Name of inc",
      logo: GalleryVerticalEnd,
      plan: "What is the inc about"
    }
  ],
  navMain: [
    {
      title: "Viewer",
      url: "#",
      icon: Eye,
      isActive: true
    },
    {
      title: "Projects",
      url: "#",
      icon: FolderKanban
    },
    {
      title: "Clinics",
      url: "/clinics",
      icon: Hospital
    },
    {
      title: "Learning hub",
      url: "#",
      icon: BookOpenText
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings
    }
  ]
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}