import { Project } from '../../types'
import { useProjectForm } from '../../hooks/useProjectForm'
import BasicInfoSection from './BasicInfoSection'
import MediaSection from './MediaSection'
import SettingsSection from './SettingsSection'

interface ProjectFormProps {
    initialData?: Partial<Project> | null
    onSubmit: (data: any) => Promise<void>
    onCancel: () => void
}

export default function ProjectForm({ initialData, onSubmit, onCancel }: ProjectFormProps) {
    const {
        formData, setFormData, gallery, setGallery, loading, slugError,
        handleChange, handleCheckbox, handleUploadGallery, submit
    } = useProjectForm({ initialData, onSubmit })

    return (
        <form onSubmit={submit} className="space-y-8 animate-in fade-in duration-500">
            <BasicInfoSection formData={formData} slugError={slugError} onChange={handleChange} />

            <MediaSection
                formData={formData}
                gallery={gallery}
                onCoverChange={(url) => setFormData((prev: any) => ({ ...prev, cover_url: url }))}
                onGalleryChange={setGallery}
                onGalleryUpload={handleUploadGallery}
                onInputChange={handleChange}
            />
            
            <SettingsSection
                formData={formData}
                onStatusChange={handleChange}
                onFeaturedChange={handleCheckbox}
            />

            <div className="sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 border-t border-gray-200 dark:border-gray-700 flex gap-4 -mx-4 -mb-4 z-10">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || !!slugError}
                    className="flex-1 px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/20"
                >
                    {loading ? 'Saving...' : initialData?.id ? 'Update Project' : 'Create Project'}
                </button>
            </div>
        </form>
    )
}