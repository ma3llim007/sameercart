import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
import { FaHome, FaList, FaUsers, FaCube, FaCubes, FaProductHunt, FaShippingFast, FaBorderAll } from "react-icons/fa";
import avatar from "../assets/avatar5.png";
import { AiFillDashboard } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { BsFillCartCheckFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { TbShoppingCartCancel } from "react-icons/tb";
import { CiDeliveryTruck } from "react-icons/ci";

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
                name: "Users List",
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
                Icon: FaPlus,
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
                Icon: FaPlus,
            },
            {
                name: "Sub-Category List",
                urlLink: "/admin/sub-category/subcategory-list",
            },
        ],
        segment: "sub-category",
    },
    {
        name: "Manage Products",
        Icon: FaProductHunt,
        innerLists: [
            {
                name: "Add Products",
                urlLink: "/admin/products/add-products",
                Icon: FaPlus,
            },
            {
                name: "Products List",
                urlLink: "/admin/products/products-list",
            },
        ],
        segment: "products",
    },
    {
        name: "Manage Order",
        Icon: BsFillCartCheckFill,
        innerLists: [
            {
                name: "New Order",
                urlLink: "/admin/orders/new-order",
                Icon: FaPlus,
            },
            {
                name: "Shipping Order",
                urlLink: "/admin/orders/shipping-order",
                Icon: FaShippingFast,
            },
            {
                name: "Canceled Order",
                urlLink: "/admin/orders/canceled-order",
                Icon: TbShoppingCartCancel,
            },
            {
                name: "Delivery Order",
                urlLink: "/admin/orders/delivery-order",
                Icon: CiDeliveryTruck,
            },
            {
                name: "All Order",
                urlLink: "/admin/orders/all-order",
                Icon: FaBorderAll,
            },
        ],
        segment: "orders",
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
                            {navBar.map(items => {
                                if (items?.innerLists) {
                                    return (
                                        <Collapsible defaultOpen={segment === items?.segment} key={items?.name} className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton>
                                                    <ChevronRight className="transition-transform" />
                                                    {items.Icon && <items.Icon />}
                                                    {items?.name}
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {items?.innerLists.map(item => (
                                                        <SidebarMenuButton key={item?.name} className="data-[active=true]:bg-transparent" asChild>
                                                            <Link to={item?.urlLink}>
                                                                {item.Icon ? <item.Icon /> : <FaList />}
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
                                                    {items.Icon && <items.Icon />}
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
