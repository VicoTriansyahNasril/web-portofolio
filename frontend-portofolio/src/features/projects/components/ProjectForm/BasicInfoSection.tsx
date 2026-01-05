import { ChangeEvent } from 'react'

interface BasicInfoProps {
    formData: any
    slugError: string
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"

export default function BasicInfoSection({ formData, slugError, onChange }: BasicInfoProps) {
    return (
        <section className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Core Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title <span className="text-red-500">*</span></label>
                    <input name="title" value={formData.title} onChange={onChange} required className={inputClass} placeholder="Project Name" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Slug <span className="text-red-500">*</span></label>
                    <input name="slug" value={formData.slug} onChange={onChange} required className={`${inputClass} ${slugError ? 'border-red-500' : ''}`} placeholder="project-slug" />
                    {slugError && <p className="mt-1 text-sm text-red-500">{slugError}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Role</label>
                    <input name="role" value={formData.role} onChange={onChange} className={inputClass} placeholder="e.g. Lead Dev" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                    <input name="start_date" type="date" value={formData.start_date} onChange={onChange} className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                    <input name="end_date" type="date" value={formData.end_date} onChange={onChange} className={inputClass} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Summary <span className="text-red-500">*</span></label>
                <textarea name="summary" value={formData.summary} onChange={onChange} required rows={3} maxLength={300} className={`${inputClass} resize-none`} placeholder="Brief overview..." />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tech Stack</label>
                <input name="tech_stack" value={formData.tech_stack} onChange={onChange} className={inputClass} placeholder="React, Go, Postgres..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Demo URL</label>
                    <input name="demo_url" type="url" value={formData.demo_url} onChange={onChange} className={inputClass} placeholder="https://..." />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Repo URL</label>
                    <input name="repo_url" type="url" value={formData.repo_url} onChange={onChange} className={inputClass} placeholder="https://github.com/..." />
                </div>
            </div>
        </section>
    )
}