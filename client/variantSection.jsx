<div className="w-full px-2">
    <div className="py-5 rounded-lg">
        <h2 className="text-2xl font-bold">Variants Section</h2>
        <hr className="mb-4" />
        {variants.map((variant, index) => (
            <div
                key={variant.sku || index}
                className="w-full my-4 rounded-xl border-2 border-indigo-900"
            >
                <div className="w-full flex justify-between items-center p-2 bg-indigo-900 rounded-t-lg">
                    <h5 className="font-bold text-lg text-white">
                        Variant _#{index + 1}
                    </h5>
                    <Button
                        type="button"
                        className="Danger"
                        onClick={() => removeVariant(index)}
                    >
                        <FaTrash /> Remove
                    </Button>
                </div>
                <div className="flex flex-wrap gap-4 py-4 px-2">
                    <div className="flex-1 min-w-[500px]">
                        <Input
                            label="SKU"
                            placeholder="SKU"
                            {...register(`productVariants.${index}.sku`)}
                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                            error={
                                errors.productVariants?.[index]?.sku?.message
                            }
                        />
                    </div>
                    <div className="flex-1 min-w-[500px]">
                        <Input
                            label="Price Adjustement"
                            {...register(
                                `productVariants.${index}.priceAdjustement`
                            )}
                            placeholder="Enter The Price Adjustement"
                            defaultValue="0"
                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                            error={
                                errors.productVariants?.[index]
                                    ?.priceAdjustement?.message
                            }
                        />
                    </div>
                    <div className="flex-1 min-w-[500px]">
                        <Input
                            label="Stock Quantity"
                            placeholder="Enter The Stock Quantity"
                            defaultValue="0"
                            {...register(
                                `productVariants.${index}.stockQuantity`
                            )}
                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                            error={
                                errors.productVariants?.[index]?.stockQuantity
                                    ?.message
                            }
                        />
                    </div>
                    <div className="flex-1 min-w-[500px]">
                        <Controller
                            control={control}
                            name={`productVariants.${index}.image`}
                            render={({ field }) => (
                                <Input
                                    label="Select The Product Image"
                                    title="Select The Product Image"
                                    type="file"
                                    disabled={isPending}
                                    accept=".jpg, .jpeg, .png, .gif, .svg, .webp"
                                    multiple
                                    onChange={e => {
                                        const filesArray = Array.from(
                                            e.target.files
                                        );
                                        field.onChange(filesArray);
                                    }}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={
                                        errors.productVariants?.[index]?.image
                                            ?.message
                                    }
                                />
                            )}
                        />
                    </div>
                    <div className="flex-1 min-w-[500px]">
                        <Select
                            label="Select The Color"
                            placeholder="Select The Color"
                            title="Select The Color"
                            options={colorOptions}
                            error={
                                errors.productVariants?.[index]?.color?.message
                            }
                            isRequired="true"
                            disabled={isPending}
                            {...register(`productVariants.${index}.color`)}
                        />
                    </div>
                    <div className="flex-1 min-w-[500px]">
                        <Select
                            label="Select The Size"
                            placeholder="Select The Size"
                            title="Select The Size"
                            options={sizeOptions}
                            error={
                                errors.productVariants?.[index]?.size?.message
                            }
                            isRequired="true"
                            disabled={isPending}
                            {...register(`productVariants.${index}.size`)}
                        />
                    </div>
                </div>
            </div>
        ))}
        <Button type="button" className="Success" onClick={addVariant}>
            <FaPlus /> Add Variant
        </Button>
    </div>
</div>;
