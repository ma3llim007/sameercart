import { useForm } from "react-hook-form";
import { Input, PageHeader } from "../components";
import { useMutation } from "@tanstack/react-query";

const AddBlogs = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onChange",
    });
    const { mutate, isPending } = useMutation();
    return (
        <>
            <PageHeader title={"Manage Blogs"} controller={"Blogs"} controllerUrl={"/admin/blogs/add-blog/"} page={"Add Blogs's"} />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-2 bg-gray-100 dark:bg-slate-800">
                    <form className="space-y-5" onSubmit={handleSubmit(data => mutate(data))} encType="multipart/form-data">
                        <h1 className="text-xl font-bold my-4 px-2">Add Blog</h1>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <h4 className="text-white font-bold text-sm">{errors.root.message}</h4>
                            </div>
                        )}
                        <div className="flex flex-wrap my-2 gap-4 md:gap-0">
                            <div className="w-full px-2">
                                <Input
                                    label="Category Name"
                                    placeholder="Enter The Category Name"
                                    {...register("categoryName")}
                                    disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.categoryName?.message}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default AddBlogs;
