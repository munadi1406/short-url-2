"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  GalleryHorizontal,
  Settings,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "DCRYPT DATA CENTER",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Short Link",
      url: "#",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "Short Link",
          url: "/dashboard/short-url",
        },
        {
          title: "Statistik",
          url: "/dashboard/users",
        },
        
      ],
    },
    {
      title: "Post",
      url: "#",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "Create Post",
          url: "/dashboard/post/create",
        },
        {
          title: "Posts",
          url: "/dashboard/post",
        },
        
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create User",
          url: "/dashboard/users/create",
        },
        {
          title: "List Users",
          url: "/dashboard/users",
        },
        
      ],
    },
    {
      title: "Article",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Create Article",
          url: "/dashboard/article/create",
        },
        {
          title: "Articles",
          url: "/dashboard/article",
        },
       
      ],
    },
    {
      title: "Telegram",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Chanel",
          url: "/dashboard/telegram",
        },
      ],
    },
    {
      title: "Logs",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Users",
          url: "/dashboard/logs/users",
        },
        {
          title: "Visitors",
          url: "/dashboard/logs/visitors",
        },
        {
          title: "Others",
          url: "/dashboard/logs/others",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Genre",
      url: "/dashboard/genre",
      icon:GalleryHorizontal,
    },
    {
      name: "Maintenance",
      url: "/dashboard/maintenance",
      icon:GalleryHorizontal,
    },
    {
      name: "Tools",
      url: "/dashboard/tools",
      icon: Settings,
    },
    {
      name: "Scrapper",
      url: "/dashboard/scrapper",
      icon: Map,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
