import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { Project } from '../../types'
import { slugify, isValidSlug } from '../../utils/slugify'

interface ProjectFormProps {
    initialData?: Partial<Project> | null
    onSubmit: (data: Partial<Project>) => Promise<void>
    onCancel: () => void
}

export default function ProjectForm({ initialData, onSubmit, onCancel }: ProjectFormProps) {
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [body, setBody] = useState('')
    const [summary, setSummary] = useState('')
    const [techStack, setTechStack] = useState('')
    const [demoUrl, setDemoUrl] = useState('')
    const [repoUrl, setRepoUrl] = useState('')
    const [isFeatured, setIsFeatured] = useState(false)
    const [status, setStatus] = useState<'draft' | 'published'>('draft')
    const [loading, setLoading] = useState(false)
    const [slugError, setSlugError] = useState('')

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '')
            setSlug(initialData.slug || '')
            setBody(initialData.body || '')
            setSummary(initialData.summary || '')
            setTechStack(initialData.tech_stack || '')
            setDemoUrl(initialData.demo_url || '')
            setRepoUrl(initialData.repo_url || '')
            setIsFeatured(initialData.is_featured || false)
            setStatus(initialData.status || 'draft')
        }
    }, [initialData])

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setTitle(newTitle)
        if (!initialData?.id) { // Only auto-slugify on create
            const newSlug = slugify(newTitle)
            setSlug(newSlug)
            validateSlug(newSlug)
        }
    }

    const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newSlug = e.target.value.toLowerCase()
        setSlug(newSlug)
        validateSlug(newSlug)
    }

    const validateSlug = (value: string) => {
        if (!value) {
            setSlugError('Slug is required')
        } else if (!isValidSlug(value)) {
            setSlugError('Slug can only contain lowercase letters, numbers, and hyphens')
        } else {
            setSlugError('')
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        validateSlug(slug)
        if (slugError) return

        setLoading(true)
        try {
            await onSubmit({
                title,
                slug,
                body,
                summary,
                tech_stack: techStack,
                demo_url: demoUrl,
                repo_url: repoUrl,
                is_featured: isFeatured,
                status,
            })
        } catch (error) {
            console.error('Error submitting project:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="e.g., E-Commerce Platform"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Slug <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">(URL-friendly identifier)</span>
                </label>
                <input
                    type="text"
                    value={slug}
                    onChange={handleSlugChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border ${slugError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                    placeholder="e.g., e-commerce-platform"
                />
                {slugError && <p className="mt-1 text-sm text-red-500">{slugError}</p>}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                    rows={2}
                    maxLength={1000}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    placeholder="Brief description for card preview..."
                />
                <p className="mt-1 text-xs text-gray-500">{summary.length}/1000 characters</p>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Description (Body) <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    rows={8}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    placeholder="Detailed project description..."
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tech Stack <span className="text-gray-500 text-xs">(comma separated)</span>
                </label>
                <input
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="e.g., React, TypeScript, Node.js"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Demo URL
                    </label>
                    <input
                        type="url"
                        value={demoUrl}
                        onChange={(e) => setDemoUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="https://demo.example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Repository URL
                    </label>
                    <input
                        type="url"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="https://github.com/username/repo"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-6">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isFeatured"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-5 h-5 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500"
                    />
                    <label htmlFor="isFeatured" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Featured Project
                    </label>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status:</span>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="status"
                            value="draft"
                            checked={status === 'draft'}
                            onChange={() => setStatus('draft')}
                            className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-2 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Draft</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="status"
                            value="published"
                            checked={status === 'published'}
                            onChange={() => setStatus('published')}
                            className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-2 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Published</span>
                    </label>
                </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                    className="flex-1 px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : initialData?.id ? 'Update Project' : 'Create Project'}
                </button>
            </div>
        </form>
    )
}