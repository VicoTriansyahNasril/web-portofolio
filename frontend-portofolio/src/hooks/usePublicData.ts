import useSWR from 'swr';
import { api } from '../api/client';

const fetcher = async <T>(url: string): Promise<T> => {
    const response = await api.get<T>(url);
    return response.data;
};

export function usePublicData<T>(url: string | null) {
    const { data, error, isLoading, isValidating } = useSWR<T>(url, fetcher, {
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