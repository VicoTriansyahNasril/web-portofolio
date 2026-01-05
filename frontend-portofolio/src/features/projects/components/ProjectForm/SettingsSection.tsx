import { ChangeEvent } from 'react'

interface SettingsSectionProps {
    formData: any
    onStatusChange: (e: ChangeEvent<HTMLInputElement>) => void 
    onFeaturedChange: (e: ChangeEvent<HTMLInputElement>) => void 
}

export default function SettingsSection({ formData, onStatusChange, onFeaturedChange }: SettingsSectionProps) {
    return (
        <section className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Settings
            </h3>
            <div className="flex flex-wrap gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">

                <label className="flex items-center cursor-pointer select-none">
                    <input
                        name="is_featured"
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={onFeaturedChange}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Featured Project</span>
                </label>

                <div className="flex items-center gap-4 border-l border-gray-300 dark:border-gray-600 pl-6">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status:</span>

                    <label className="flex items-center cursor-pointer select-none">
                        <input
                            type="radio"
                            name="status"
                            value="draft"
                            checked={formData.status === 'draft'}
                            onChange={onStatusChange}
                            className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Draft</span>
                    </label>

                    <label className="flex items-center cursor-pointer select-none">
                        <input
                            type="radio"
                            name="status"
                            value="published"
                            checked={formData.status === 'published'}
                            onChange={onStatusChange}
                            className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Published</span>
                    </label>
                </div>
            </div>
        </section>
    )
}