import { Badge } from "@/components";
import { formatDateTime } from "@/utils";
import { upperCase, upperFirst } from "lodash";

const ProductDetailsVariant = ({ data }) => {
    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold underline underline-offset-4 p-4">
                Product Details
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="w-full md:w-1/3 px-2">
                    <img
                        className="max-w-full max-h-full object-cover rounded shadow-lg"
                        src={data.productFeatureImage}
                        alt={data.productName}
                    />
                </div>
                <div className="flex-grow border p-3 bg-gray-950/30 dark:bg-gray-950/40 shadow-md rounded">
                    <table className="table-auto w-full text-lg">
                        <tbody>
                            <tr>
                                <th className="text-left p-2 border-b font-bold">
                                    Name:
                                </th>
                                <td className="p-2 border-b text-left">
                                    {upperFirst(data.productName)}
                                </td>
                            </tr>
                            <tr>
                                <th className="text-left p-2 border-b font-bold">
                                    Slug:
                                </th>
                                <td className="p-2 border-b text-left">
                                    {data.productSlug}
                                </td>
                            </tr>
                            <tr>
                                <th className="text-left p-2 border-b font-bold">
                                    Price:
                                </th>
                                <td className="p-2 border-b text-left">
                                    {data.productPrice || "-"}
                                </td>
                            </tr>
                            <tr>
                                <th className="text-left p-2 border-b font-bold">
                                    Category:
                                </th>
                                <td className="p-2 border-b text-left">
                                    {upperFirst(
                                        data.productCategory?.categoryName
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th className="text-left p-2 border-b font-bold">
                                    Sub-Category:
                                </th>
                                <td className="p-2 border-b text-left">
                                    {upperFirst(
                                        data.productSubCategory?.subCategoryName
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th className="text-left p-2 border-b font-bold">
                                    Brand:
                                </th>
                                <td className="p-2 border-b text-left">
                                    {upperFirst(data.productBrand)}
                                </td>
                            </tr>
                            <tr>
                                <th className="text-left p-2 border-b font-bold">
                                    Attribute:
                                </th>
                                <td className="p-2 border-b text-left">
                                    {data.attributes.map(attribute => (
                                        <>
                                            <Badge
                                                key={attribute._id}
                                                className="Primary my-1"
                                                title={`${upperCase(attribute.name)}: ${upperFirst(attribute.options.join(", "))}`}
                                            />
                                            
                                            <br />
                                        </>
                                    ))}
                                </td>
                            </tr>
                            <tr>
                                <th className="text-left p-2 font-bold">
                                    Date:
                                </th>
                                <td className="p-2 text-left">
                                    {formatDateTime(data.updatedAt)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsVariant;
