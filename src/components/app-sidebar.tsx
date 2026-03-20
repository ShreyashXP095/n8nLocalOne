"use client"

import {
    CreditCardIcon,
    FolderOpenIcon,
    HistoryIcon,
    KeyIcon,
    LogOutIcon,
    SettingsIcon,
    StarIcon,
    
} from "lucide-react"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter} from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"

import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

const menuItems = [
    {
        title: "Main",
        items: [
            {
                title: "Workflows",
                icon: FolderOpenIcon,
                url: "/workflows"
            },
            {
                title: "Executions",
                icon: HistoryIcon,
                url: "/executions"
            },
            {
                title: "Credentials",
                icon: KeyIcon,
                url: "/credentials"
            },
            
            
        ],
      
    },
];

export const AppSidebar = () =>{

    const router = useRouter();
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
                        <Link href="/" prefetch>
                            <Image src="/logos/logo.svg" alt="Logo" width={30} height={30} />
                            <span className="font-semibold text-sm">NodeFlow</span>
                        </Link>
                    </SidebarMenuButton>

                </SidebarMenuItem>
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((group) =>(
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) =>(
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                        tooltip={item.title}
                                        className="gap-x-4 h-10 px-4"
                                        isActive = {
                                            item.url === "/"
                                            ? pathname === "/"
                                            : pathname.startsWith(item.url)
                                        }
                                        asChild>
                                            <Link href={item.url} prefetch>
                                                <item.icon className="size-4"/>
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                        </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        tooltip="Upgrade to Pro"
                        className="gap-x-4 h-10 px-4"
                        onClick={()=>{}}
                        >
                            <StarIcon className="size-4"/>
                            <span>Upgrade to Pro</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        tooltip="Billing Portal"
                        className="gap-x-4 h-10 px-4"
                        onClick={()=>{}}
                        >
                            <CreditCardIcon className="size-4"/>
                            <span>Billing Portal</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        tooltip="Sign Out"
                        className="gap-x-4 h-10 px-4"
                        onClick={()=>{ authClient.signOut({
                            fetchOptions: {
                                onSuccess: () => {
                                    router.push("/login");
                                    toast.success("Signed out successfully");
                                },
                                onError: (err) => {
                                    toast.error("Error in signing out");
                                    console.error(err.error);
                                }
                            }
                        })}}
                        >
                            <LogOutIcon className="size-4"/>
                            <span>Sign Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}


