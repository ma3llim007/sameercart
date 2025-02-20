import { capitalizeWords } from "@/utils";

const ShippingAddress = ({ address }) => {
    console.log(address);

    return (
        <>
            <h3 className="text-2xl font-bold mb-4">Shipping Address</h3>
            <div className="w-full border bg-gray-950/30 dark:bg-gray-950/50 shadow-md rounded-sm select-none">
                <table className="table-auto w-full text-lg border-collapse select-none">
                    <tbody className="divide-y">
                        <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                            <th scope="col" className="text-left p-3 font-semibold">
                                Street
                            </th>
                            <td className="p-3 text-left">{capitalizeWords(address?.street)}</td>
                        </tr>
                        <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                            <th scope="col" className="text-left p-3 font-semibold">
                                City
                            </th>
                            <td className="p-3 text-left">{capitalizeWords(address?.city)}</td>
                        </tr>
                        <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                            <th scope="col" className="text-left p-3 font-semibold">
                                State
                            </th>
                            <td className="p-3 text-left">{capitalizeWords(address?.state)}</td>
                        </tr>
                        <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                            <th scope="col" className="text-left p-3 font-semibold">
                                Country
                            </th>
                            <td className="p-3 text-left">{capitalizeWords(address?.country)}</td>
                        </tr>
                        <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                            <th scope="col" className="text-left p-3 font-semibold">
                                Zip Code
                            </th>
                            <td className="p-3 text-left">{address?.zip_code}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ShippingAddress;
