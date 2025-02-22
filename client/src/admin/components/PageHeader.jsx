import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const PageHeader = ({ title, controller, controllerUrl, subController, subControllerUrl, page }) => {
    return (
        <section className="w-full flex items-center justify-between py-2 px-4 select-none">
            <h1 className="text-3xl font-bold">{title}</h1>
            <Breadcrumb className="hidden lg:block">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link className="flex gap-2 items-center" to={"/admin/dashboard"}>
                            <FaHome />
                            Home
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Link to={controllerUrl}>{controller}</Link>
                    </BreadcrumbItem>
                    {subController && subControllerUrl ? (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Link to={subControllerUrl}>{subController}</Link>
                            </BreadcrumbItem>
                        </>
                    ) : (
                        ""
                    )}
                    {page && (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem className="select-none">{page}</BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
        </section>
    );
};

export default PageHeader;
