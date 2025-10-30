import { api } from './client';
import type { Profile } from '../types';

export const fetchPublicProfile = async (): Promise<Profile | null> => {
    const { data } = await api.get<Profile>('/api/profile');
    return data || null;
};

export const updateAdminProfile = async (payload: Partial<Profile>): Promise<Profile> => {
    const { data } = await api.put<Profile>('/api/admin/profile', payload);
    return data;
};