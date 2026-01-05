import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Profile, SocialLink } from '../types'

interface UseProfileFormProps {
    initialData: Profile | null
    onSubmit: (data: Partial<Profile>) => Promise<void>
}

const validationSchema = Yup.object({
    full_name: Yup.string().required('Name is required'),
    headline: Yup.string().required('Headline is required'),
})

export function useProfileForm({ initialData, onSubmit }: UseProfileFormProps) {
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            full_name: initialData?.full_name || '',
            headline: initialData?.headline || '',
            bio: initialData?.bio || '',
            location: initialData?.location || '',
            photo_url: initialData?.photo_url || '',
            resume_url: initialData?.resume_url || '',
            skill_group_order: initialData?.skill_group_order || '[]',
            socials: initialData?.socials || [] as SocialLink[]
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            try {
                await onSubmit(values)
            } finally {
                setLoading(false)
            }
        }
    })

    const handleSocialChange = (updatedLinks: SocialLink[]) => {
        formik.setFieldValue('socials', updatedLinks)
    }

    return {
        formik,
        loading,
        handleSocialChange
    }
}