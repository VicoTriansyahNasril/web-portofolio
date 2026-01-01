import { ChangeEvent } from 'react'

interface BasicInfoProps {
    formData: any
    slugError: string
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export default function BasicInfo({ formData, slugError, onChange }: BasicInfoProps) {
    return (
        <section className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Core Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold mb-2">Title <span className="text-red-500">*</span></label>
                    <input name="title" value={formData.title} onChange={onChange} required className="form-input" />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">Slug <span className="text-red-500">*</span></label>
                    <input name="slug" value={formData.slug} onChange={onChange} required className={`form-input ${slugError ? 'border-red-500' : ''}`} />
                    {slugError && <p className="text-red-500 text-xs mt-1">{slugError}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-semibold mb-2">Role</label>
                    <input name="role" value={formData.role} onChange={onChange} className="form-input" placeholder="e.g. Lead Dev" />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">Start Date</label>
                    <input name="startDate" type="date" value={formData.startDate} onChange={onChange} className="form-input" />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">End Date</label>
                    <input name="endDate" type="date" value={formData.endDate} onChange={onChange} className="form-input" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold mb-2">Summary <span className="text-red-500">*</span></label>
                <textarea name="summary" value={formData.summary} onChange={onChange} required rows={3} maxLength={300} className="form-textarea" />
            </div>
            <div>
                <label className="block text-sm font-semibold mb-2">Tech Stack</label>
                <input name="techStack" value={formData.techStack} onChange={onChange} className="form-input" placeholder="React, Go, Postgres..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold mb-2">Demo URL</label>
                    <input name="demoUrl" type="url" value={formData.demoUrl} onChange={onChange} className="form-input" />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">Repo URL</label>
                    <input name="repoUrl" type="url" value={formData.repoUrl} onChange={onChange} className="form-input" />
                </div>
            </div>
        </section>
    )
}