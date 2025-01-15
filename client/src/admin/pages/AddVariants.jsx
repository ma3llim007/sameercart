import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    ButtonWithAlert,
    Input,
    Loading,
    PageHeader,
    ProductDetailsVariant,
    Table,
} from "../components";
import {
    FaEdit,
    FaEye,
    FaPlus,
    FaRegTrashAlt,
    FaRupeeSign,
    FaTimes,
    FaTrash,
} from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    addVariantScheme,
    editVariantImage,
} from "@/validation/admin/ProductScheme";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { formatDateTime } from "@/utils";
import Badge from "@/components/Badge";
import Model from "@/components/Model";
import { LoadingOverlay } from "@/components";

const AddVariants = () => {
    const { productId } = useParams();
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [isModelOpenView, setIsModelOpenView] = useState(false);
    const [imageData, setImageData] = useState(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
        reset,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(addVariantScheme),
        defaultValues: {
            attributes: [{ name: "", value: "" }],
        },
    });

    const {
        register: registerVariant,
        handleSubmit: handleSubmitVariant,
        control: controlVariant,
        formState: { errors: errosVariant },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(editVariantImage),
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "attributes",
    });

    // fetching the product Data based on ProductId
    const { data: productData, isLoading } = useQuery({
        queryKey: ["product", productId],
        enabled: !!productId,
        queryFn: () =>
            crudService.get(`product/get-product/${productId}`, true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // add variant
    const { mutate, isPending } = useMutation({
        mutationFn: data => {
            const payload = new FormData();
            payload.append("productId", productId);
            payload.append("basePrice", data?.basePrice);
            payload.append("discountPrice", data?.discountPrice);
            payload.append("stockQuantity", data?.stockQuantity);
            data.images.forEach(image => {
                payload.append(`images`, image);
            });
            // Convert object into JSON string for sending via FormData
            payload.append("attributes", JSON.stringify(data?.attributes));
            return crudService.post(
                "variant/add-variant",
                true,
                payload,
                "multipart/form-data"
            );
        },
        onSuccess: data => {
            reset();
            navigate(`/admin/products/variants/${productId}`);
            queryClient.invalidateQueries(["variantList", productId]);
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
    });

    // variant Listing
    const { data, isLoading: variantLoading } = useQuery({
        queryKey: ["variantList", productId],
        enabled: !!productId,
        queryFn: () =>
            crudService.get(`variant/variants-by-product/${productId}`, true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // Delete Variant
    const { mutate: deleteVariant, isPending: isPendingDeleteVariant } =
        useMutation({
            mutationFn: variantId =>
                crudService.delete(
                    `/variant/delete-variant/${variantId}`,
                    true
                ),
            onSuccess: data => {
                queryClient.invalidateQueries(["variantList", productId]);
                toastService.success(data?.message);
            },
            onError: error => {
                const errorMessage =
                    error?.response?.data?.message ||
                    error?.message ||
                    "An error occurred";
                toastService.error(errorMessage);
            },
        });

    // delete images
    const { mutate: deleteImageMutate, isPending: isPendingDeleteImageMutate } =
        useMutation({
            mutationFn: ({ variantId, publicId }) => {
                const encodedPublicId = encodeURIComponent(publicId);

                return crudService.delete(
                    `variant/delete-variant-image/${variantId}/${encodedPublicId}`,
                    true
                );
            },
            onSuccess: data => {
                queryClient.invalidateQueries(["variantList", productId]);
                toastService.success(data?.message);
            },
            onError: error => {
                const errorMessage =
                    error?.response?.data?.message ||
                    error?.message ||
                    "An error occurred";
                toastService.error(errorMessage);
            },
        });

    // modelHandler
    const modelHandler = ({ image, variantId }) => {
        const updateImage = { ...image, variantId };
        setImageData(updateImage);
        setIsModelOpen(true);
    };

    // modelHandler for view image
    const modelHandlerViewImage = ({ image }) => {
        setImageData(image);
        setIsModelOpenView(true);
    };

    // Edit the image
    const { mutate: editImageMutate, isPending: editIsPending } = useMutation({
        mutationFn: data => {
            const formData = new FormData();
            formData.append("variantId", imageData?.variantId);
            formData.append("imageId", imageData?._id);
            formData.append(
                "publicId",
                encodeURIComponent(imageData?.publicId)
            );
            formData.append("image", data?.image);
            return crudService.patch(
                `/variant/update-variant-image/${encodeURIComponent(imageData?.variantId)}/${encodeURIComponent(imageData?.publicId)}`,
                true,
                formData,
                "multipart/form-data"
            );
        },
        onSuccess: data => {
            navigate(`/admin/products/variants/${productId}`);
            queryClient.invalidateQueries(["variantList", productId]);
            setIsModelOpen(false);
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
    });

    // Table Columns
    const productVariantColums = [
        { accessorKey: "no", header: "No." },
        {
            accessorKey: "sku",
            header: "SKU",
        },
        {
            header: "Price",
            cell: ({ row }) => (
                <div className="w-full flex items-end gap-2">
                    <p className="text-lg font-bold inline-flex items-center">
                        <FaRupeeSign /> {row.original?.discountPrice.toFixed(2)}
                    </p>
                    <del className="inline-flex items-center">
                        <FaRupeeSign /> {row.original?.basePrice.toFixed(2)}
                    </del>
                </div>
            ),
        },
        {
            accessorKey: "stockQuantity",
            header: "Stock Quantity",
        },
        {
            header: "Images",
            cell: ({ row }) => (
                <div className="min-w-96 flex gap-4 flex-wrap items-center justify-center">
                    {row?.original?.images.map((image, index) => (
                        <div
                            key={image?.publicId || index}
                            className="relative group flex flex-col items-center"
                        >
                            <img
                                key={image?.publicId}
                                className="max-w-36 max-h-max-w-36 object-cover rounded-lg"
                                src={image?.imageUrl}
                                alt={image?.publicId || "Variant image"}
                            />
                            <div className="absolute bottom-2 right-2 hidden group-hover:flex items-center gap-2 bg-white p-1 rounded-lg shadow-lg text-base">
                                <Button
                                    title="View Image"
                                    onClick={() =>
                                        modelHandlerViewImage({ image })
                                    }
                                    className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600"
                                >
                                    <FaEye />
                                </Button>
                                <Button
                                    title="Edit Image"
                                    onClick={() =>
                                        modelHandler({
                                            image,
                                            variantId: row?.original?._id,
                                        })
                                    }
                                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    <RiEdit2Fill />
                                </Button>
                                <ButtonWithAlert
                                    title="Delete Variant Image"
                                    buttonTitle={<FaRegTrashAlt />}
                                    dialogTitle={
                                        "Are You Sure You Want To Delete This Image?"
                                    }
                                    dialogDesc="This Action Will Permanently Delete The Product Variant Image. Proceed?"
                                    dialogActionTitle="Delete Variant Image"
                                    dialogActionfn={() =>
                                        deleteImageMutate({
                                            variantId: row?.original?._id,
                                            publicId: image?.publicId,
                                        })
                                    }
                                    className={`p-2 rounded-full ${
                                        row?.original?.images.length === 1
                                            ? "bg-red-400 text-white cursor-not-allowed"
                                            : "bg-red-500 text-white hover:bg-red-600"
                                    }`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "attributes",
            header: "Attribues",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-2">
                    {row.original?.attributes.map(attr => (
                        <Badge
                            key={attr._id}
                            title={`${attr.name}: ${attr.value}`}
                        />
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "updatedAt",
            header: "Date Time",
            cell: ({ row }) => (
                <p className="text-wrap">
                    {formatDateTime(row.original?.updatedAt)}
                </p>
            ),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-y-2 gap-x-0.5 items-center justify-center flex-wrap">
                    <Button
                        className="Primary"
                        onClick={() =>
                            navigate(
                                `/admin/products/variants/${productId}/edit-variant/${row.original._id}`
                            )
                        }
                    >
                        Edit
                    </Button>
                    |
                    <ButtonWithAlert
                        buttonTitle="Delete"
                        dialogTitle="Are You Sure You Want to Delete This Product Variant?"
                        dialogDesc="This action will permanently delete the Product Variant. Proceed?"
                        dialogActionTitle="Delete Variant"
                        dialogActionfn={() => deleteVariant(row.original?._id)}
                    />
                </div>
            ),
        },
    ];

    const productVariant =
        data?.data.map((data, index) => ({
            no: index + 1,
            ...data,
        })) || [];

    if (isLoading || variantLoading) return <Loading />;
    if (isPending || isPendingDeleteVariant || isPendingDeleteImageMutate)
        return <LoadingOverlay />;
    return (
        <>
            <PageHeader
                title={"Manage Variant"}
                controller={"Products"}
                controllerUrl={`/admin/products/products-list`}
                subController={"Variants"}
                subControllerUrl={`/admin/products/variants/${productId}`}
                page={"Add Variant's"}
            />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-4 bg-gray-100 dark:bg-slate-800">
                    <ProductDetailsVariant data={productData?.data} />
                    <hr className="mt-6" />
                    <form
                        className="space-y-5 border-2 rounded-xl mt-4 border-green-700"
                        onSubmit={handleSubmit(data => mutate(data))}
                        encType="multipart/form-data"
                        method="POST"
                    >
                        <h1 className="text-xl font-bold py-4 px-2 bg-green-700 rounded-t-lg">
                            Add Variants
                        </h1>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <h4 className="text-white font-bold text-sm">
                                    {errors.root.message}
                                </h4>
                            </div>
                        )}
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2 my-2">
                                <Input
                                    label="Variant Base Price"
                                    {...register("basePrice")}
                                    placeholder="Enter The Variant Base Price"
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors?.basePrice?.message}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2 my-2">
                                <Input
                                    label="Variant Discount Price"
                                    {...register("discountPrice")}
                                    placeholder="Enter The Variant Discount Price"
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors?.discountPrice?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2 my-2">
                                <Input
                                    label="Stock Quantity"
                                    placeholder="Enter The Stock Quantity"
                                    {...register("stockQuantity")}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors.stockQuantity?.message}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2 my-2">
                                <Controller
                                    control={control}
                                    name="images"
                                    render={({ field }) => (
                                        <Input
                                            label="Variant Images"
                                            title="Select The Variant Image"
                                            type="file"
                                            disabled={isPending}
                                            accept=".jpg, .jpeg, .png, .gif, .svg, .webp"
                                            multiple
                                            onChange={e => {
                                                const filesArray = e.target
                                                    .files
                                                    ? Array.from(e.target.files)
                                                    : [];
                                                field.onChange(filesArray);
                                            }}
                                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                            error={errors?.images?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="w-full px-3">
                            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                                <h2 className="text-2xl font-bold px-2">
                                    Attribues
                                </h2>
                                <Button
                                    disabled={isPending}
                                    className="Success btnLg flex items-center gap-2"
                                    onClick={() =>
                                        append({ name: "", value: "" })
                                    }
                                >
                                    <FaPlus /> Add Variant
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="flex flex-wrap items-center justify-center gap-4 p-4 shadow-md rounded-lg border"
                                    >
                                        <div className="flex justify-center items-center min-h-[90px]">
                                            <Button
                                                className="Danger flex items-center gap-2 p-5 mt-6 rounded-md"
                                                onClick={() => remove(index)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Enter The Key Name"
                                                disabled={isPending}
                                                label="Key Name"
                                                {...register(
                                                    `attributes.${index}.name`
                                                )}
                                                className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                                error={
                                                    errors.attributes?.[index]
                                                        ?.name?.message
                                                }
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                label="Value"
                                                placeholder="Enter The Value"
                                                disabled={isPending}
                                                {...register(
                                                    `attributes.${index}.value`
                                                )}
                                                className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                                error={
                                                    errors.attributes?.[index]
                                                        ?.value?.message
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full border-t !mt-8 px-2">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="Primary my-2 btnXl"
                            >
                                {isPending ? (
                                    <Loading height="7" weight="7" />
                                ) : (
                                    <>
                                        <FaPlus /> Add
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
                <div className="my-4 w-full container mx-auto border-t-4 border-orange-700 rounded-lg p-4 bg-gray-100 dark:bg-slate-800">
                    <h1 className="text-3xl font-bold px-4">
                        Variants Listing
                    </h1>
                    <Table
                        columns={productVariantColums}
                        data={productVariant}
                        paginationOptions={{ pageSize: 10 }}
                        sortable
                        loading={variantLoading}
                    />
                </div>
            </section>
            <Model
                title={"Update Image"}
                isOpen={isModelOpen}
                onClose={() => setIsModelOpen(false)}
                disabled={editIsPending}
            >
                <form
                    onSubmit={handleSubmitVariant(data =>
                        editImageMutate(data)
                    )}
                    encType="multipart/form-data"
                >
                    {errosVariant?.root && (
                        <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                            <h4 className="text-white font-bold text-sm">
                                {errosVariant?.root?.message}
                            </h4>
                        </div>
                    )}
                    <div className="flex flex-wrap my-1">
                        <div className="w-10/12 px-2 my-1">
                            <div className="w-full">
                                <label className="inline-block mb-2 pl-1 text-base font-bold">
                                    Variant Preview Image
                                </label>
                                <img
                                    src={imageData?.imageUrl}
                                    className="max-w-60 max-h-60 object-cover rounded-lg"
                                    alt="Preview Image"
                                />
                            </div>
                        </div>
                        <div className="w-full px-2 my-2">
                            <Controller
                                control={controlVariant}
                                name="image"
                                render={({ field }) => (
                                    <Input
                                        label="Variant Image"
                                        title="Select The Variant Image"
                                        type="file"
                                        disabled={editIsPending}
                                        accept=".jpg, .jpeg, .png, .gif, .svg, .webp"
                                        onChange={e =>
                                            field.onChange(e.target.files[0])
                                        }
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        error={errosVariant?.image?.message}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="w-full flex justify-between border-t !mt-6">
                        <Button
                            disabled={editIsPending}
                            className="Success my-2 btnXl"
                        >
                            {editIsPending ? (
                                <Loading height="7" weight="7" />
                            ) : (
                                <>
                                    <FaEdit /> Update
                                </>
                            )}
                        </Button>
                        <Button
                            disabled={editIsPending}
                            onClick={() => setIsModelOpen(false)}
                            className="Secondary my-2 btnXl"
                        >
                            <FaTimes />
                            Close
                        </Button>
                    </div>
                </form>
            </Model>
            <Model
                title={"View Image"}
                isOpen={isModelOpenView}
                onClose={() => setIsModelOpenView(false)}
            >
                <div className="flex my-1 justify-center">
                    <div className="w-10/12 px-2 my-1">
                        <img
                            src={imageData?.imageUrl}
                            className="max-w-full max-h-full object-cover rounded-lg"
                            alt="Preview Image"
                        />
                    </div>
                </div>
            </Model>
        </>
    );
};

export default AddVariants;
