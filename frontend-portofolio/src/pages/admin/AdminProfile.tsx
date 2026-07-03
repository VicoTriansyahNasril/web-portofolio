import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import ProfileForm from '@/features/profile/components/ProfileForm';
import { profileAPI } from '@/features/profile/api/profileAPI';
import { Profile } from '@/features/profile/types';
import { alert } from '@/utils/confirm';

export default function AdminProfile() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const profileData = await profileAPI.getPublic();
                setProfile(profileData);
            } catch (error) {
                console.error("Failed to load profile:", error);
                void alert({ title: 'Error', text: 'Could not load profile data.', icon: 'error' });
            } finally {
                setLoading(false);
            }
        };
        void loadData();
    }, []);

    const handleSubmit = async (data: Partial<Profile>) => {
        try {
            await profileAPI.updateAdmin(data);

            setProfile(prev => prev ? { ...prev, ...data } as Profile : null);

            void alert({ title: 'Success', text: 'Profile updated successfully.' });
        } catch (error) {
            console.error(error);
            void alert({ title: 'Error', text: 'Failed to update profile.', icon: 'error' });
        }
    };

    if (loading) {
        return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ProfileForm initialData={profile} onSubmit={handleSubmit} />
        </motion.div>
    );
}