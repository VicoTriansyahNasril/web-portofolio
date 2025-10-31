import { useState, useEffect, FormEvent } from 'react'
import { Achievement } from '../../types'

interface AchievementFormModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (data: Partial<Omit<Achievement, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>
    initialData?: Achievement | null
}

export default function AchievementFormModal({
    open,
    onClose,
    onSubmit,
    initialData,
}: AchievementFormModalProps) {
    const [title, setTitle] = useState('')
    const [issuer, setIssuer] = useState('')
    const [date, setDate] = useState('')
    const [description, setDescription] = useState('')
    const [credentialUrl, setCredentialUrl] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            if (initialData) {
                setTitle(initialData.title || '')
                setIssuer(initialData.issuer || '')
                setDate(initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '')
                setDescription(initialData.description || '')
                setCredentialUrl(initialData.credential_url || '')
            } else {
                setTitle('')
                setIssuer('')
                setDate('')
                setDescription('')
                setCredentialUrl('')
            }
        }
    }, [initialData, open])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!title.trim() || !issuer.trim() || !date) {
            return
        }

        setLoading(true)
        try {
            const formattedDate = new Date(date).toISOString()

            await onSubmit({
                title: title.trim(),
                issuer: issuer.trim(),
                date: formattedDate,
                description: description.trim(),
                credential_url: credentialUrl.trim(),
                link_text: 'View Credential',
            })
            onClose()
        } catch (error) {
            console.error('Error submitting achievement:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {initialData ? 'Edit Achievement' : 'Add Achievement'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        type="button"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder="e.g., AWS Certified Developer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Issuer <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={issuer}
                            onChange={(e) => setIssuer(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder="e.g., Amazon Web Services"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                            placeholder="Describe your achievement..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Credential URL
                        </label>
                        <input
                            type="url"
                            value={credentialUrl}
                            onChange={(e) => setCredentialUrl(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}