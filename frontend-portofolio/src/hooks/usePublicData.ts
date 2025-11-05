import useSWR from 'swr';

export function usePublicData<T>(url: string | null) {
    const { data, error, isLoading, isValidating } = useSWR<T>(url, {
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 1000 * 60 * 5,
    });

    return {
        data,
        isLoading,
        isValidating,
        isError: error,
    };
}