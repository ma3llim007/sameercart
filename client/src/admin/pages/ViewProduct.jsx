import { Suspense, useEffect } from "react";
import { Input, Loading, PageHeader, Select, TextArea } from "../components";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productTypeOptions } from "@/utils";
import Loader from "@/client/components/Loader/Loader";
import RichTextEditor from "../../components/Form/RichTextEditor";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
import { addProductScheme } from "@/validation/admin/ProductScheme";

const ViewProduct = () => {
    const { productId } = useParams();
    const {
        setValue,
        register,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(addProductScheme),
    });

    // fetching the product Data based on ProductId
    const {
        data: productData,
        isLoading,
        isSuccess,
    } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => crudService.get(`product/get-product/${productId}`, true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });
    // Updating the defaultValue of From
    useEffect(() => {
        if (isSuccess && productData?.data) {
            const {
                productName,
                productSlug,
                productDescription,
                productSpecification,
                productCategory,
                productSubCategory,
                productType,
                basePrice,
                productDiscountPrice,
                productStock,
                productBrand,
                productShortDescription,
            } = productData?.data || {};

            setValue("productName", productName);
            setValue("productSlug", productSlug);
            setValue("basePrice", basePrice);
            setValue("productCategoryId", productCategory?.categoryId);
            setValue("productSubCategoryId", productSubCategory?.subCategoryId);
            setValue("productType", productType);
            setValue("productDiscountPrice", productDiscountPrice);
            setValue("productDescription", productDescription);
            setValue("productSpecification", productSpecification);
            setValue("productStock", productStock);
            setValue("productBrand", productBrand);
            setValue("productShortDescription", productShortDescription);
        }
    }, [isSuccess, productData, setValue]);
    const productType = productData?.data?.productType;

    const categoryOptions = [
        {
            _id: productData?.data?.productCategory?.categoryId,
            categoryName: productData?.data?.productCategory?.categoryName,
        },
    ];

    const subCategoryOptions = [
        {
            _id: productData?.data?.productSubCategory?.subCategoryId,
            categoryName: productData?.data?.productSubCategory?.subCategoryName,
        },
    ];

    if (isLoading) return <Loading />;
    return (
        <>
            <PageHeader title={"Manage Products"} controller={"Products"} controllerUrl={"/admin/products/products-list"} page={"View Product"} />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-2 bg-gray-100 dark:bg-slate-800">
                    <form className="space-y-5" encType="multipart/form-data">
                        <h1 className="text-xl font-bold my-4 px-2">View Products</h1>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full lg:w-1/2 px-2 flex-grow">
                                <Input
                                    label="Product Name"
                                    placeholder="Enter The Product Name"
                                    {...register("productName")}
                                    readOnly
                                    disabled
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors.productName?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full lg:w-1/2 px-2 flex-grow">
                                <Input
                                    label="Product Slug"
                                    placeholder="View The Product Slug"
                                    {...register("productSlug")}
                                    onPaste={e => e.preventDefault()}
                                    onCopy={e => e.preventDefault()}
                                    readOnly
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors.productSlug?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full lg:w-1/2 px-2">
                                <Controller
                                    name="productCategoryId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            label="Product Category"
                                            placeholder="Select The Category"
                                            title="View The Category"
                                            options={categoryOptions}
                                            readOnly
                                            disabled
                                            {...register("productCategoryId")}
                                            onChange={e => {
                                                field.onChange(e.target.value);
                                            }}
                                            error={errors.productCategoryId?.message}
                                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        />
                                    )}
                                />
                            </div>
                            <div className="w-full lg:w-1/2 px-2">
                                <Select
                                    label="Product Sub-Category"
                                    placeholder="Select The Sub-Category"
                                    title="View The Sub-Category"
                                    options={subCategoryOptions}
                                    readOnly
                                    disabled
                                    {...register("productSubCategoryId")}
                                    error={errors.productSubCategoryId?.message}
                                    defaultValue={productData?.data.productSubCategory.subCategoryId}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full lg:w-1/2 px-2">
                                <div className="w-full">
                                    <label className="inline-block mb-2 pl-1 text-base font-bold">Product Previous Image</label>
                                    <img src={productData?.data.productFeatureImage} className="max-w-96 max-h-80 object-cover rounded" alt="Previous Category" />
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 px-2">
                                <Select
                                    label="Product Type"
                                    placeholder="Select The Product Type"
                                    options={productTypeOptions}
                                    readOnly
                                    disabled
                                    {...register("productType")}
                                    defaultValue={productData?.data.productType}
                                    name="productType"
                                    error={errors.productType?.message}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                />
                            </div>
                        </div>
                        {productType === "simple" && (
                            <div className="flex flex-wrap my-2 gap-4 lg:gap-0">
                                <div className="w-full lg:w-1/2 px-2">
                                    <Input
                                        label="Base Product Price"
                                        placeholder="Enter The Base Product Price"
                                        {...register("basePrice")}
                                        readOnly
                                        disabled
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        error={errors.basePrice?.message}
                                    />
                                </div>
                                <div className="w-full lg:w-1/2 px-2">
                                    <Input
                                        label="Product Discount Price"
                                        placeholder="Enter The Product Discount Price"
                                        {...register("productDiscountPrice")}
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        readOnly
                                        disabled
                                        error={errors.productDiscountPrice?.message}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="flex flex-wrap my-2 gap-4 lg:gap-0">
                            {productType === "simple" && (
                                <div className="w-full lg:w-1/2 px-2">
                                    <Input
                                        label="Product Stock"
                                        readOnly
                                        disabled
                                        placeholder="Enter The Product Stock"
                                        {...register("productStock")}
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        error={errors.productStock?.message}
                                    />
                                </div>
                            )}
                            <div className="w-full lg:w-1/2 px-2">
                                <Input
                                    label="Product Brand"
                                    placeholder="Enter The Product Brand"
                                    readOnly
                                    disabled
                                    {...register("productBrand")}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors.productBrand?.message}
                                />
                            </div>
                        </div>
                        <div className="w-full px-2">
                            <TextArea
                                name="productShortDescription"
                                label="Product Short Description"
                                placeholder="Enter The Product Short Description"
                                error={errors.productShortDescription?.message}
                                className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                rows={2}
                                {...register("productShortDescription")}
                                disabled
                                readOnly
                            />
                        </div>
                        <div className="w-full px-2">
                            <Suspense fallback={<Loader />}>
                                <RichTextEditor
                                    name="productDescription"
                                    label="Product Description"
                                    control={control}
                                    placeholder="Enter The Product Description"
                                    {...register("productDescription")}
                                    error={errors.productDescription?.message}
                                    readOnly
                                    disabled
                                    className="text-xl rounded-sm focus:ring-2 focus:ring-blue-800"
                                />
                            </Suspense>
                        </div>
                        <div className="w-full px-2">
                            <Suspense fallback={<Loader />}>
                                <RichTextEditor
                                    name="productSpecification"
                                    label="Product Specification"
                                    control={control}
                                    readOnly
                                    placeholder="Enter The Product Specification"
                                    {...register("productSpecification")}
                                    error={errors.productSpecification?.message}
                                    disabled
                                    className="text-xl rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                                />
                            </Suspense>
                        </div>
                        <div className="w-full border-t !mt-8 flex items-center gap-1">
                            <Link to={`/admin/products/edit-product/${productId}`}>
                                <Button readOnly className="Primary my-2 btnXl">
                                    <FaEdit /> Go To Edit Page
                                </Button>
                            </Link>
                            |
                            <Link to={`/admin/products/products-list`}>
                                <Button readOnly className="Cyan my-2 btnXl">
                                    <TiArrowBack /> Back To Listing
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default ViewProduct;
