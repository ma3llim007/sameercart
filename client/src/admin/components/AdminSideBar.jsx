import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
} from "@/components/ui/sidebar";
import { FaHome, FaList, FaUsers, FaUserCog } from "react-icons/fa";
import avatar from "../assets/avatar5.png";
import { AiFillDashboard } from "react-icons/ai";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const navBar = [
    { name: "Main Site", Icon: FaHome, urlLink: "/" },
    { name: "Dashboard", Icon: AiFillDashboard, urlLink: "/admin/dashboard" },
    {
        name: "Manage Admin",
        Icon: FaUserCog,
        innerLists: [
            {
                name: "Add Admin",
                urlLink: "/admin/admins/add-admin",
            },
            {
                name: "Admin List",
                urlLink: "/admin/admins/admin-list",
            },
        ],
    },
    {
        name: "Manage User",
        Icon: FaUsers,
        innerLists: [
            {
                name: "User List",
                urlLink: "/admin/users/user-list",
            },
        ],
    },
];
export function AdminSideBar({ username, ...props }) {
    return (
        <Sidebar {...props}>
            <SidebarContent>
                <SidebarGroup>
                    <div className="flex items-center space-x-2 py-2 px-2">
                        <img src={avatar} loading="lazy" alt="Admin" className="w-14 h-14 object-cover rounded-full" />
                        <div className="flex flex-col space-y-1 p-2 rounded-lg">
                            <h3 className="text-base font-semibold">{username || "Unknown User"}</h3>
                            <p className="flex items-center gap-1 text-xs">
                                <span className="w-2 h-2 bg-green-600 rounded-full" aria-hidden="true"></span>
                                <span>Online -</span> <span className="font-medium">Admin</span>
                            </p>
                        </div>
                    </div>
                    <SidebarGroupLabel>MAIN NAVIGATION</SidebarGroupLabel>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navBar.map((items) => {
                                if (items?.innerLists) {
                                    return (
                                        <Collapsible key={items?.name} className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton>
                                                    <ChevronRight className="transition-transform" />
                                                    <items.Icon />
                                                    {items?.name}
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {items?.innerLists.map((item) => (
                                                        <SidebarMenuButton key={item?.name} className="data-[active=true]:bg-transparent" asChild>
                                                            <Link to={item?.urlLink}>
                                                                <FaList />
                                                                {item?.name}
                                                            </Link>
                                                        </SidebarMenuButton>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    );
                                } else {
                                    return (
                                        <SidebarMenuItem key={items?.name}>
                                            <SidebarMenuButton asChild>
                                                <Link to={items?.urlLink} target={items?.name === "Main Site" ? "_blank" : "_self"}>
                                                    <items.Icon />
                                                    {items?.name}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                }
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
