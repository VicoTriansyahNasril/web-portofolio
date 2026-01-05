import useSWR from 'swr';
import { api } from '@/lib/axios';

const fetcher = (url: string) => api.get(url, {
    params: { _t: new Date().getTime() }
}).then((res) => res.data);

export function usePublicData<T>(url: string | null) {
    const { data, error, isLoading, isValidating, mutate } = useSWR<T>(url, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 0,
        keepPreviousData: true
    });

    return {
        data,
        isLoading,
        isValidating,
        isError: error,
        mutate
    };
}