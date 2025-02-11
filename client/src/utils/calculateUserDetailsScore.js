export const calculateUserDetailsScore = user => {
    if (!user) return 0;

    const fields = [
        user.firstName,
        user.lastName,
        user.username,
        user.email,
        user.phoneNumber,
        user.address?.street,
        user.address?.city,
        user.address?.state,
        user.address?.country,
        user.address?.zip_code,
    ];

    const totalFields = fields.length;
    const filledFields = fields.filter(Boolean).length;

    return Math.round((filledFields / totalFields) * 100);
};
