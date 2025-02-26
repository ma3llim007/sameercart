import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { capitalizeWords } from "@/utils";
import PageHeader from "../components/PageHeader";
import { Button } from "@/components/ui/button";
import { FaBackward, FaReply } from "react-icons/fa";

const ViewContactEnquiry = () => {
    const { contactId } = useParams();
    const navigate = useNavigate();

    // fetching the contact Data based on Contact Id
    const { data: contactData, isLoading } = useQuery({
        queryKey: ["contact", contactId],
        queryFn: () => crudService.get(`contact/contact/${contactId}`, true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    const handleMailTo = () => {
        if (contactData?.data?.email) {
            window.open(`mailto:${contactData.data.email}`, "_blank");
        }
    };

    if (isLoading) return <Loading />;
    return (
        <>
            <PageHeader title={"Manage Enquiry's"} controller={"All Enquiry"} controllerUrl={"/admin/enquiry/contact-list/"} page={"View Enquiry"} />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-2 bg-gray-100 dark:bg-slate-800 space-y-5">
                    <h1 className="text-xl font-bold my-4 px-2">Contact Enquiry Details</h1>
                    <div className="w-full border bg-gray-700/20 dark:bg-gray-950/50 shadow-md rounded-sm select-none">
                        <table className="table-auto w-full text-lg border-collapse select-none">
                            <tbody className="divide-y">
                                <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                                    <th className="text-left p-3 font-semibold">First Name</th>
                                    <td className="p-3 text-left">{capitalizeWords(contactData?.data?.firstName) || "-"}</td>
                                </tr>
                                <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                                    <th className="text-left p-3 font-semibold">Last Name</th>
                                    <td className="p-3 text-left">{capitalizeWords(contactData?.data?.lastName) || "-"}</td>
                                </tr>
                                <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                                    <th className="text-left p-3 font-semibold">E-Mail</th>
                                    <td className="p-3 text-left">{contactData?.data?.email || "-"}</td>
                                </tr>
                                <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                                    <th className="text-left p-3 font-semibold">Phone Number</th>
                                    <td className="p-3 text-left">{contactData?.data?.phoneNumber || "-"}</td>
                                </tr>
                                <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                                    <th className="text-left p-3 font-semibold">Subject</th>
                                    <td className="p-3 text-left">{capitalizeWords(contactData?.data?.subject) || "-"}</td>
                                </tr>
                                <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                                    <th className="text-left p-3 font-semibold">Message</th>
                                    <td className="p-3 text-left">{capitalizeWords(contactData?.data?.message) || "-"}</td>
                                </tr>
                                <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                                    <th className="text-left p-3 font-semibold">Action</th>
                                    <td className="p-3 text-left">
                                        <Button onClick={handleMailTo} className="Success">
                                            Replay With Mail <FaReply />
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <Button className="Secondary" onClick={() => navigate("/admin/enquiry/contact-list/")}>
                        <FaBackward /> Back To User Listing
                    </Button>
                </div>
            </section>
        </>
    );
};

export default ViewContactEnquiry;
