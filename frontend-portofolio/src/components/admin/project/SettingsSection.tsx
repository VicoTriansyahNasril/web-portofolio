import { ChangeEvent } from 'react'

interface SettingsSectionProps {
    formData: any
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function SettingsSection({ formData, onChange }: SettingsSectionProps) {
    return (
        <section className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Settings
            </h3>
            <div className="flex flex-wrap gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <label className="flex items-center cursor-pointer">
                    <input name="isFeatured" type="checkbox" checked={formData.isFeatured} onChange={onChange} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                    <span className="ml-3 text-sm font-medium">Featured Project</span>
                </label>
                <div className="flex items-center gap-4 border-l border-gray-300 dark:border-gray-600 pl-6">
                    <span className="text-sm font-semibold">Status:</span>
                    {['draft', 'published'].map((s) => (
                        <label key={s} className="flex items-center cursor-pointer">
                            <input type="radio" name="status" value={s} checked={formData.status === s} onChange={onChange} className="w-4 h-4 text-primary-600 focus:ring-primary-500" />
                            <span className="ml-2 text-sm capitalize">{s}</span>
                        </label>
                    ))}
                </div>
            </div>
        </section>
    )
}