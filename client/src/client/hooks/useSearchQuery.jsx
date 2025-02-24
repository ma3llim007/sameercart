import crudService from "@/api/crudService";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";

const useSearchQuery = (query, delay = 500) => {
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    // Debounce the query to reduce API calls
    const debouncedSearch = useMemo(() => debounce(setDebouncedQuery, delay), [delay]);

    // Apply debounced search when query changes
    useEffect(() => {
        debouncedSearch(query);
        return () => debouncedSearch.cancel();
    }, [query, debouncedSearch]);

    // React Query for fetching search results
    const { data, isFetching } = useQuery({
        queryKey: ["search", debouncedQuery],
        queryFn: () => crudService.get(`/products/search?term=${query}`, false),
        enabled: !!debouncedQuery,
        staleTime: 30000,
        retry: 2,
        refetchOnWindowFocus: false,
    });

    return { data, isFetching };
};

export default useSearchQuery;
