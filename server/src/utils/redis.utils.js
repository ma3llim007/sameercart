export const generateCacheKey = (req) => {
    const baseUrl = req.path.replace(/^\/+|\/+$/g, "").replace(/\//g, ":");
    const params = req.query;
    const sortedParams = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&");
    return sortedParams ? `${baseUrl}:${sortedParams}` : baseUrl;
};
