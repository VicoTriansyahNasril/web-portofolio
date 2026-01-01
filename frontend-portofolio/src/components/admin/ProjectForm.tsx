import { Project } from '../../types'
import { useProjectForm } from '../../hooks/admin/useProjectForm'
import BasicInfo from './project/BasicInfo'
import MediaSection from './project/MediaSection'
import SettingsSection from './project/SettingsSection'

interface ProjectFormProps {
    initialData?: Partial<Project> | null
    onSubmit: (data: Partial<Project>) => Promise<void>
    onCancel: () => void
}

export default function ProjectForm({ initialData, onSubmit, onCancel }: ProjectFormProps) {
    const {
        formData, setFormData, gallery, setGallery, loading, slugError,
        handleChange, handleCheckbox, handleUploadGallery, submit
    } = useProjectForm({ initialData, onSubmit })

    return (
        <form onSubmit={submit} className="space-y-8 animate-in fade-in duration-500">
            <BasicInfo formData={formData} slugError={slugError} onChange={handleChange} />

            <MediaSection
                formData={formData}
                gallery={gallery}
                onCoverChange={(url) => setFormData(prev => ({ ...prev, coverUrl: url }))}
                onGalleryChange={setGallery}
                onGalleryUpload={handleUploadGallery}
                onInputChange={handleChange}
            />

            <SettingsSection formData={formData} onChange={handleCheckbox} />

            <div className="sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 border-t border-gray-200 dark:border-gray-700 flex gap-4 -mx-4 -mb-4 z-10">
                <button type="button" onClick={onCancel} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" disabled={loading || !!slugError} className="flex-1 btn-primary">
                    {loading ? 'Saving...' : initialData?.id ? 'Update Project' : 'Create Project'}
                </button>
            </div>

            <style>{`
                .form-input, .form-textarea {
                    width: 100%; padding: 0.75rem 1rem; border-radius: 0.5rem;
                    border: 1px solid #e5e7eb; background-color: #fff; color: #111827;
                    transition: all 0.2s;
                }
                .dark .form-input, .dark .form-textarea {
                    border-color: #4b5563; background-color: #374151; color: #fff;
                }
                .form-input:focus, .form-textarea:focus {
                    outline: none; ring: 2px; ring-color: #8b5cf6; border-color: transparent;
                }
                .btn-primary {
                    padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 500;
                    color: white; background-color: #7c3aed; transition: background-color 0.2s;
                }
                .btn-primary:hover:not(:disabled) { background-color: #6d28d9; }
                .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
                .btn-secondary {
                    padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 500;
                    color: #374151; border: 1px solid #d1d5db; transition: background-color 0.2s;
                }
                .dark .btn-secondary { color: #d1d5db; border-color: #4b5563; }
                .btn-secondary:hover { background-color: #f3f4f6; }
                .dark .btn-secondary:hover { background-color: #374151; }
            `}</style>
        </form>
    )
}