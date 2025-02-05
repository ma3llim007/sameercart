import image from "../../assets/delivery/returns_and_exchanges.webp";
import { FaBox, FaShippingFast, FaMoneyBillWave } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";

const ReturnsAndExchanges = () => {
    return (
        <section className="my-20 px-4 w-full">
            <div className="w-full text-center">
                <h2 className="text-3xl mb-4 font-bold underline decoration-2">Delivery Policies</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-light-textDarkGray dark:text-dark-textLightGray h-full">
                <div className="p-4 md:p-8 flex flex-col leading-8">
                    <h3 className="text-2xl font-semibold mb-4">Return Process Overview</h3>
                    <p className="text-xl mb-4">Our return process is simple and straightforward. Follow these steps to return your items:</p>
                    <ol className="list-decimal list-inside text-xl space-y-4">
                        <li className="flex items-center">
                            <FaBox className="text-2xl mr-4" />
                            Request a return through your account.
                        </li>
                        <li className="flex items-center">
                            <FiPackage className="text-2xl mr-4" />
                            Pack the item securely in the original packaging.
                        </li>
                        <li className="flex items-center">
                            <FaShippingFast className="text-2xl mr-4" />
                            Ship the package to the address provided.
                        </li>
                        <li className="flex items-center">
                            <FaMoneyBillWave className="text-2xl mr-4" />
                            Once we receive your item, a refund will be issued.
                        </li>
                    </ol>
                    <p className="mt-4 text-xl">If you have any questions, please contact our support team.</p>
                </div>
                <div className="w-full h-auto flex justify-center">
                    <img className="w-full md:w-[350px] h-auto object-cover rounded-md" src={image} alt="returns and exchanges" />
                </div>
            </div>
        </section>
    );
};

export default ReturnsAndExchanges;
