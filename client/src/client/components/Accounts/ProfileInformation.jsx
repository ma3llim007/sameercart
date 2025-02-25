import { Loading } from "@/admin/components";
import crudService from "@/api/crudService";
import { Input } from "@/components";
import { Button } from "@/components/ui/button";
import toastService from "@/services/toastService";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit, FaSave } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Country, State, City } from "country-state-city";
import { upperCase } from "lodash";
import { profileInformation, addressInformation as addressInformationValidation } from "@/validation/UserScheme";

const ProfileInformation = ({ data }) => {
    const [editProfileInformation, setEditProfileInformation] = useState(false);
    const [addressInformation, setAddressInformation] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(data.address?.country || "");
    const [selectedState, setSelectedState] = useState(data.address?.state || "");
    const [selectedCity, setSelectedCity] = useState(data.address?.city || "");
    const queryClient = useQueryClient();

    // Profile Form
    const {
        register: profileRegister,
        handleSubmit: profileHandleSubmit,
        formState: { errors: profileErrors },
        reset: profileReset,
        setError: profileSetError,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(profileInformation),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            phoneNumber: "",
        },
    });

    // Address Form
    const {
        register: addressRegister,
        handleSubmit: addressHandleSubmit,
        formState: { errors: addressErrors },
        reset: addressReset,
        setError: addressSetError,
        setValue: profileSetValue,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(addressInformationValidation),
        defaultValues: {
            street: data?.address?.street || "",
            city: data?.address?.city || "",
            state: data?.address?.state || "",
            country: data?.address?.country || "",
            zipCode: data?.address?.zip_code || "",
        },
    });

    // Sync profile and address data when `data` changes
    useEffect(() => {
        profileReset(data);
        addressReset({
            street: data?.address?.street,
            zipCode: data?.address?.zip_code,
        });
        setSelectedCountry(data.address?.country || "");
        setSelectedState(data.address?.state || "");
        setSelectedCity(data.address?.city || "");
    }, [data, profileReset, addressReset]);

    // Update Profile Information
    const { mutate: profileMutate, isPending: profileIsPending } = useMutation({
        mutationFn: data => {
            return crudService.post("/users/dashboard/edit-user-detail", false, data);
        },
        onSuccess: data => {
            queryClient.invalidateQueries(["userData", data._id]);
            toastService.success(data?.message);
            setEditProfileInformation(false);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            profileSetError("root", { message });
        },
    });

    // Cancel Profile Editing
    const discardProfileChanges = () => {
        profileReset();
        setEditProfileInformation(false);
    };

    // Cancel Address Editing
    const discardAddressChanges = () => {
        addressReset();
        if (data?.address?.country) {
            setSelectedCountry(data?.address?.country);
        }
        if (data?.address?.state) {
            setSelectedState(data?.address?.state);
        }
        if (data?.address?.city) {
            setSelectedCity(data?.address?.city);
        }
        setAddressInformation(false);
    };

    // Fetch Country, State, and City Lists (Memoized for Performance)
    const countries = useMemo(() => Country.getAllCountries().map(c => ({ label: c.name, value: c.isoCode })), []);
    const states = useMemo(() => (selectedCountry ? State.getStatesOfCountry(selectedCountry.toUpperCase()).map(s => ({ label: s.name, value: s.isoCode })) : []), [selectedCountry]);
    const cities = useMemo(() => (selectedState ? City.getCitiesOfState(selectedCountry, selectedState).map(c => ({ label: c.name, value: c.name })) : []), [selectedCountry, selectedState]);

    // Update Address Information
    const { mutate: addressMutate, isPending: addressPending } = useMutation({
        mutationFn: data => {
            const formData = new FormData();
            formData.append("street", data.street);
            formData.append("city", String(data.city));
            formData.append("state", String(selectedState));
            formData.append("country", String(selectedCountry));
            formData.append("zipCode", data.zipCode);

            return crudService.post("/users/dashboard/edit-address", false, formData);
        },
        onSuccess: data => {
            queryClient.invalidateQueries(["userData", data._id]);
            toastService.success(data?.message);
            setAddressInformation(false);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            addressSetError("root", { message });
        },
    });

    return (
        <>
            <form className="space-y-4" onSubmit={profileHandleSubmit(formData => profileMutate(formData))}>
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-2xl font-bold">Profile Information</h1>
                    {!editProfileInformation && (
                        <Button type="button" className="Primary btnLg" onClick={() => setEditProfileInformation(true)}>
                            <FaEdit /> Edit
                        </Button>
                    )}
                </div>
                {profileErrors.root && (
                    <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                        <h4 className="text-white font-bold text-sm">{profileErrors.root.message}</h4>
                    </div>
                )}
                <div className="flex flex-wrap gap-4 lg:gap-0">
                    <div className="w-full lg:w-1/2 px-2">
                        <Input
                            label="First Name"
                            {...profileRegister("firstName")}
                            disabled={!editProfileInformation || profileIsPending}
                            readOnly={!editProfileInformation}
                            placeholder="Enter Your First Name"
                            className={`w-full text-lg rounded px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                                editProfileInformation ? "cursor-auto" : "cursor-not-allowed"
                            }`}
                            error={profileErrors.firstName?.message}
                        />
                    </div>
                    <div className="w-full lg:w-1/2 px-2">
                        <Input
                            label="Last Name"
                            {...profileRegister("lastName")}
                            placeholder="Enter Your Last Name"
                            disabled={!editProfileInformation || profileIsPending}
                            readOnly={!editProfileInformation}
                            className={`w-full text-lg rounded px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                                editProfileInformation ? "cursor-auto" : "cursor-not-allowed"
                            }`}
                            error={profileErrors.lastName?.message}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 lg:gap-0">
                    <div className="w-full lg:w-1/2 px-2">
                        <Input
                            label="Username"
                            disabled={!editProfileInformation || profileIsPending}
                            readOnly={!editProfileInformation}
                            {...profileRegister("username")}
                            placeholder="Enter Your Username"
                            className={`w-full text-lg rounded px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                                editProfileInformation ? "cursor-auto" : "cursor-not-allowed"
                            }`}
                            error={profileErrors.username?.message}
                        />
                    </div>
                    <div className="w-full lg:w-1/2 px-2">
                        <Input
                            label="E-Mail"
                            disabled={!editProfileInformation || profileIsPending}
                            readOnly={!editProfileInformation}
                            placeholder="Enter Your E-Mail"
                            {...profileRegister("email")}
                            className={`w-full text-lg rounded px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                                editProfileInformation ? "cursor-auto" : "cursor-not-allowed"
                            }`}
                            error={profileErrors.email?.message}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 lg:gap-0">
                    <div className="w-full lg:w-1/2 px-2">
                        <Input
                            label="Phone Number"
                            disabled={!editProfileInformation || profileIsPending}
                            readOnly={!editProfileInformation}
                            {...profileRegister("phoneNumber")}
                            placeholder="Enter Your Phone Number"
                            className={`w-full text-lg rounded px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                                editProfileInformation ? "cursor-auto" : "cursor-not-allowed"
                            }`}
                            error={profileErrors.phoneNumber?.message}
                        />
                    </div>
                </div>
                {editProfileInformation && (
                    <div className="w-full px-2 flex gap-4">
                        <Button
                            disabled={profileIsPending}
                            className="Primary my-2 btnXl flex items-center justify-center gap-2 transition-all duration-200 hover:bg-opacity-80"
                            aria-label={profileIsPending ? "Saving..." : "Save Changes"}
                            type="submit"
                        >
                            {profileIsPending ? (
                                <Loading height="7" weight="7" />
                            ) : (
                                <>
                                    <FaSave size="20" /> Save Changes
                                </>
                            )}
                        </Button>
                        <Button
                            disabled={profileIsPending}
                            className="Secondary my-2 btnXl flex items-center justify-center gap-2 transition-all duration-200 hover:bg-opacity-80"
                            aria-label="Cancel Editing"
                            type="button"
                            onClick={discardProfileChanges}
                        >
                            {profileIsPending ? (
                                <Loading height="7" weight="7" />
                            ) : (
                                <>
                                    <IoCloseCircleOutline size="24" /> Discard
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </form>
            <hr className="my-5" />
            <form className="space-y-5 mb-5" onSubmit={addressHandleSubmit(addressData => addressMutate(addressData))}>
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-2xl font-bold">Address Information</h1>
                    {!addressInformation && (
                        <Button type="button" className="Primary btnLg" onClick={() => setAddressInformation(true)}>
                            <FaEdit /> Edit
                        </Button>
                    )}
                </div>
                {addressErrors.root && (
                    <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                        <h4 className="text-white font-bold text-sm">{addressErrors.root.message}</h4>
                    </div>
                )}
                <div className="flex flex-wrap gap-4 lg:gap-0">
                    <div className="w-full flex-grow px-2">
                        <Input
                            label="Street"
                            disabled={!addressInformation || addressPending}
                            readOnly={!addressInformation}
                            placeholder="Enter Your Street"
                            className={`w-full text-lg rounded px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                                addressInformation ? "cursor-auto" : "cursor-not-allowed"
                            }`}
                            {...addressRegister("street")}
                            error={addressErrors.street?.message}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 lg:gap-0">
                    {/* Country */}
                    <div className="w-full lg:w-1/2 px-2">
                        <label htmlFor={"country"} className="inline-block mb-2 pl-1 text-base font-bold">
                            Country <span className="text-red-500 font-black">*</span>
                        </label>
                        <select
                            id={"country"}
                            name="country"
                            title="Select Your Country"
                            disabled={!addressInformation || addressPending}
                            readOnly={!addressInformation}
                            {...addressRegister("country")}
                            value={selectedCountry?.toUpperCase()}
                            onChange={e => {
                                setSelectedCountry(e.target.value);
                                setSelectedState("");
                                setSelectedCity("");
                            }}
                            className={`w-full text-lg rounded px-3 py-3 bg-white text-black dark:bg-slate-800 dark:text-white outline-none focus:bg-gray-50 dark:focus:bg-slate-700 duration-200 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${addressInformation ? "cursor-auto" : "cursor-not-allowed"}`}
                        >
                            <option value="" className="bg-white text-gray-700 dark:bg-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
                                Select Your Country
                            </option>
                            {countries.length > 0 ? (
                                countries.map(c => (
                                    <option key={c.value} value={c.value}>
                                        {upperCase(c.label)}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No Options Available</option>
                            )}
                        </select>
                        {addressErrors.country?.message && <p className="text-red-700 font-bold my-2 text-base px-2">{addressErrors.country?.message}</p>}
                    </div>
                    {/* State Selection (Depends on Country) */}
                    <div className="w-full lg:w-1/2 px-2">
                        <label htmlFor={"state"} className="inline-block mb-2 pl-1 text-base font-bold">
                            State <span className="text-red-500 font-black">*</span>
                        </label>
                        <select
                            id={"state"}
                            name={"state"}
                            title="Select Your State"
                            disabled={!addressInformation || addressPending}
                            readOnly={!addressInformation}
                            {...addressRegister("state")}
                            value={selectedState?.toUpperCase()}
                            onChange={e => {
                                setSelectedState(e.target.value);
                                setSelectedCity("");
                            }}
                            className={`w-full text-lg rounded px-3 py-3 bg-white text-black dark:bg-slate-800 dark:text-white outline-none focus:bg-gray-50 dark:focus:bg-slate-700 duration-200 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${addressInformation ? "cursor-auto" : "cursor-not-allowed"}`}
                        >
                            <option value="" className="bg-white text-gray-700 dark:bg-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
                                Select Your State
                            </option>
                            {states.length > 0 ? (
                                states.map(c => (
                                    <option key={c.value} value={c.value}>
                                        {upperCase(c.label)}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No Options Available</option>
                            )}
                        </select>
                        {addressErrors.state?.message && <p className="text-red-700 font-bold my-2 text-base px-2">{addressErrors.state?.message}</p>}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 lg:gap-0">
                    {/* City */}
                    <div className="w-full lg:w-1/2 px-2">
                        <label htmlFor={"city"} className="inline-block mb-2 pl-1 text-base font-bold">
                            City <span className="text-red-500 font-black">*</span>
                        </label>
                        <select
                            id={"city"}
                            name={"city"}
                            title="Select Your City"
                            disabled={!addressInformation || addressPending}
                            readOnly={!addressInformation}
                            value={selectedCity}
                            {...addressRegister("city")}
                            onChange={e => {
                                setSelectedCity(e.target.value);
                                profileSetValue("city", e.target.value);
                            }}
                            className={`w-full text-lg rounded px-3 py-3 bg-white text-black dark:bg-slate-800 dark:text-white outline-none focus:bg-gray-50 dark:focus:bg-slate-700 duration-200 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${addressInformation ? "cursor-auto" : "cursor-not-allowed"}`}
                        >
                            <option value="" className="bg-white text-gray-700 dark:bg-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
                                Select Your City
                            </option>
                            {cities.length > 0 || selectedCity ? (
                                <>
                                    {selectedCity && !cities.some(c => c.value === selectedCity) && (
                                        <option key={selectedCity} value={selectedCity}>
                                            {upperCase(selectedCity)}
                                        </option>
                                    )}
                                    {cities.map(c => (
                                        <option key={c.value} value={c.value}>
                                            {upperCase(c.value)}
                                        </option>
                                    ))}
                                </>
                            ) : (
                                <option disabled>No Options Available</option>
                            )}
                        </select>
                        {addressErrors.city?.message && <p className="text-red-700 font-bold my-2 text-base px-2">{addressErrors.city?.message}</p>}
                    </div>
                    <div className="w-full lg:w-1/2 px-2">
                        <Input
                            label="Zip Code"
                            maxLength={6}
                            disabled={!addressInformation || addressPending}
                            readOnly={!addressInformation}
                            placeholder="Enter Your Zip Code"
                            className={`w-full text-lg rounded px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                                addressInformation ? "cursor-auto" : "cursor-not-allowed"
                            }`}
                            {...addressRegister("zipCode")}
                            error={addressErrors.zipCode?.message}
                        />
                    </div>
                </div>
                {addressInformation && (
                    <div className="w-full px-2 flex gap-4">
                        <Button
                            disabled={addressPending}
                            className="Primary my-2 btnXl flex items-center justify-center gap-2 transition-all duration-200 hover:bg-opacity-80"
                            aria-label={addressPending ? "Saving..." : "Save Changes"}
                            type="submit"
                        >
                            <FaSave size="20" /> Save Changes
                        </Button>
                        <Button
                            disabled={addressPending}
                            className="Secondary my-2 btnXl flex items-center justify-center gap-2 transition-all duration-200 hover:bg-opacity-80"
                            aria-label="Cancel Editing"
                            type="button"
                            onClick={discardAddressChanges}
                        >
                            <IoCloseCircleOutline size="24" /> Discard
                        </Button>
                    </div>
                )}
            </form>
        </>
    );
};

export default ProfileInformation;
