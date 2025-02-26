import crudService from "@/api/crudService";
import Loader from "@/client/components/Loader/Loader";
import toastService from "@/services/toastService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Table from "../components/Table";
import { Button } from "@/components/ui/button";
import ButtonWithAlert from "../components/ButtonWithAlert";
import queryClient from "@/api/queryClientConfig";
import { LoadingOverlay } from "@/components";

const ContactEnquiry = () => {
    const navigate = useNavigate();

    // fetching the contact enquiry
    const { data, isPending } = useQuery({
        queryKey: ["contactList"],
        queryFn: () => crudService.get("contact/contact-list", true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // delete Enquiry
    const { mutate: deleteEnquiry, isPending: deleteEnquiryIsPending } = useMutation({
        mutationFn: id => crudService.delete(`contact/delete-contact/${id}`, true),
        onSuccess: data => {
            queryClient.invalidateQueries("contactList");
            toastService.success(data?.message);
        },
        onError: error => {
            const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
            toastService.error(errorMessage);
        },
    });

    // Contact columns
    const contactColumns = [
        { accessorKey: "no", header: "No." },
        { accessorKey: "firstName", header: "First Name" },
        { accessorKey: "lastName", header: "Last Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "phoneNumber", header: "Phone Number" },
        { accessorKey: "subject", header: "Subject" },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-1 items-center flex-wrap">
                    <Button className="Primary" onClick={() => navigate(`/admin/enquiry/view-enquiry/${row.original._id}`)}>
                        View
                    </Button>
                    |
                    <ButtonWithAlert
                        buttonTitle="Delete"
                        dialogTitle="Are You Sure You Want to Delete This Enquiry?"
                        dialogDesc="This action will permanently delete the Enquiry. Proceed?"
                        dialogActionTitle="Delete Enquiry"
                        dialogActionfn={() => deleteEnquiry(row.original?._id)}
                    />
                </div>
            ),
        },
    ];

    const contactData = Array.isArray(data?.data) ? data.data.map((contact, index) => ({ no: index + 1, ...contact })) : [];
    
    if (deleteEnquiryIsPending) return <LoadingOverlay />;
    if (isPending) return <Loader />;
    return (
        <>
            <PageHeader title={"Manage Enquiry's"} controller={"All Enquiry"} controllerUrl={"/admin/enquiry/contact-list/"} />
            <Table columns={contactColumns} data={contactData} emptyMessage="Contact Is Empty" loading={isPending} paginationOptions={{ pageSize: 10 }} sortable />
        </>
    );
};

export default ContactEnquiry;
