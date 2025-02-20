import { Button } from "@/components/ui/button";
import { capitalizeWords } from "@/utils";
import { Link } from "react-router-dom";

const UserDetails = ({ userData }) => {
    return (
        <>
            <h3 className="text-2xl font-bold mb-4">User Details</h3>
            <div className="w-full border bg-gray-950/30 dark:bg-gray-950/50 shadow-md rounded-sm select-none">
                <table className="table-auto w-full text-lg border-collapse select-none">
                    <tbody className="divide-y">
                        <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                            <th scope="col" className="text-left p-3 font-semibold">
                                First Name
                            </th>
                            <td className="p-3 text-left">{capitalizeWords(userData?.firstName)}</td>
                        </tr>
                        <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                            <th scope="col" className="text-left p-3 font-semibold">
                                Last Name
                            </th>
                            <td className="p-3 text-left">{capitalizeWords(userData?.lastName)}</td>
                        </tr>
                        <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                            <th scope="col" className="text-left p-3 font-semibold">
                                Username
                            </th>
                            <td className="p-3 text-left">{capitalizeWords(userData?.username)}</td>
                        </tr>
                        <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                            <th scope="col" className="text-left p-3 font-semibold">
                                E-Mail
                            </th>
                            <td className="p-3 text-left">{capitalizeWords(userData?.email)}</td>
                        </tr>
                        <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                            <th scope="col" className="text-left p-3 font-semibold">
                                Phone Number
                            </th>
                            <td className="p-3 text-left">{userData?.phoneNumber}</td>
                        </tr>
                        <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                            <th scope="col" className="text-left p-3 font-semibold">
                                Action
                            </th>
                            <td className="p-3 text-left">
                                <Link to={`admin/users/view-user/${userData?._id}`}>
                                    <Button className="Primary">View User Details</Button>
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default UserDetails;
