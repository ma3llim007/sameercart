import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import {
    FaHome,
    FaList,
    FaUsers,
    FaCube,
    FaCubes,
    FaProductHunt,
} from "react-icons/fa";
import avatar from "../assets/avatar5.png";
import { AiFillDashboard } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { TbBrandSpacehey } from "react-icons/tb";

const navBar = [
    { name: "Main Site", Icon: FaHome, urlLink: "/" },
    {
        name: "Dashboard",
        Icon: AiFillDashboard,
        urlLink: "/admin/dashboard",
        segment: "dashboard",
    },
    {
        name: "Manage User",
        Icon: FaUsers,
        innerLists: [
            {
                name: "Add User",
                urlLink: "/admin/users/add-user",
            },
            {
                name: "User List",
                urlLink: "/admin/users/user-list",
            },
        ],
        segment: "users",
    },
    {
        name: "Manage Category",
        Icon: FaCube,
        innerLists: [
            {
                name: "Add Category",
                urlLink: "/admin/category/add-category",
            },
            {
                name: "Category List",
                urlLink: "/admin/category/category-list",
            },
        ],
        segment: "category",
    },
    {
        name: "Manage Sub-Category",
        Icon: FaCubes,
        innerLists: [
            {
                name: "Add Sub-Category",
                urlLink: "/admin/sub-category/add-subcategory",
            },
            {
                name: "Sub-Category List",
                urlLink: "/admin/sub-category/subcategory-list",
            },
        ],
        segment: "sub-category",
    },
    {
        name: "Manage Brands",
        Icon: TbBrandSpacehey,
        innerLists: [
            {
                name: "Add Brands",
                urlLink: "/admin/brands/add-brands",
            },
            {
                name: "Brands List",
                urlLink: "/admin/brands/brands-list",
            },
        ],
        segment: "brands",
    },
    {
        name: "Manage Products",
        Icon: FaProductHunt,
        innerLists: [
            {
                name: "Add Products",
                urlLink: "/admin/products/add-products",
            },
            {
                name: "Products List",
                urlLink: "/admin/products/products-list",
            },
        ],
        segment: "products",
    },
];
export function AdminSideBar({ username, ...props }) {
    const { pathname } = useLocation();
    const segment = pathname.split("/")[2] || "";

    return (
        <Sidebar {...props} className="select-none">
            <SidebarContent>
                <SidebarGroup>
                    <div className="flex items-center space-x-2 py-2 px-2">
                        <img
                            src={avatar}
                            loading="lazy"
                            alt="Admin"
                            className="w-14 h-14 object-cover rounded-full"
                        />
                        <div className="flex flex-col space-y-1 p-2 rounded-lg">
                            <h3 className="text-base font-semibold">
                                {username || "Unknown User"}
                            </h3>
                            <p className="flex items-center gap-1 text-xs">
                                <span
                                    className="w-2 h-2 bg-green-600 rounded-full"
                                    aria-hidden="true"
                                ></span>
                                <span>Online -</span>{" "}
                                <span className="font-medium">Admin</span>
                            </p>
                        </div>
                    </div>
                    <SidebarGroupLabel>MAIN NAVIGATION</SidebarGroupLabel>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navBar.map(items => {
                                if (items?.innerLists) {
                                    return (
                                        <Collapsible
                                            defaultOpen={
                                                segment === items?.segment
                                            }
                                            key={items?.name}
                                            className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                                        >
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton>
                                                    <ChevronRight className="transition-transform" />
                                                    {items.Icon && (
                                                        <items.Icon />
                                                    )}
                                                    {items?.name}
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {items?.innerLists.map(
                                                        item => (
                                                            <SidebarMenuButton
                                                                key={item?.name}
                                                                className="data-[active=true]:bg-transparent"
                                                                asChild
                                                            >
                                                                <Link
                                                                    to={
                                                                        item?.urlLink
                                                                    }
                                                                >
                                                                    <FaList />
                                                                    {item?.name}
                                                                </Link>
                                                            </SidebarMenuButton>
                                                        )
                                                    )}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    );
                                } else {
                                    return (
                                        <SidebarMenuItem key={items?.name}>
                                            <SidebarMenuButton asChild>
                                                <Link
                                                    to={items?.urlLink}
                                                    target={
                                                        items?.name ===
                                                        "Main Site"
                                                            ? "_blank"
                                                            : "_self"
                                                    }
                                                >
                                                    {items.Icon && (
                                                        <items.Icon />
                                                    )}
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
