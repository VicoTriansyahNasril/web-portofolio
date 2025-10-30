import { Project } from '../../types'
import { fileUrl } from '../../utils/url'

interface ProjectPreviewProps {
    project: Partial<Project> | null
}

export default function ProjectPreview({ project }: ProjectPreviewProps) {
    if (!project) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-6 text-center">
                <p className="text-gray-500">No project data to preview.</p>
            </div>
        )
    }

    const techStack = project.tech_stack ? project.tech_stack.split(',').map(t => t.trim()) : [];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Preview</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    How your project will appear to visitors
                </p>
            </div>

            <div className="p-6 space-y-6">
                {project.cover_url && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                        <img
                            src={fileUrl(project.cover_url)}
                            alt={project.title || 'Project thumbnail'}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {project.is_featured && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm font-medium">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Featured
                    </div>
                )}

                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {project.title || 'Untitled Project'}
                    </h1>
                    {project.slug && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                            URL: /projects/{project.slug}
                        </p>
                    )}
                </div>

                {project.summary && (
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {project.summary}
                    </p>
                )}

                {techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {techStack.map((tech: string, index: number) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}

                {(project.demo_url || project.repo_url) && (
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {project.demo_url && (
                            <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Live Demo
                            </a>
                        )}
                        {project.repo_url && (
                            <a
                                href={project.repo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                                View Code
                            </a>
                        )}
                    </div>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" style={{
                        backgroundColor: project.status === 'published' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                        color: project.status === 'published' ? 'rgb(34, 197, 94)' : 'rgb(249, 115, 22)'
                    }}>
                        <span className="w-2 h-2 rounded-full" style={{
                            backgroundColor: project.status === 'published' ? 'rgb(34, 197, 94)' : 'rgb(249, 115, 22)'
                        }} />
                        {project.status === 'published' ? 'Published' : 'Draft'}
                    </div>
                </div>
            </div>
        </div>
    )
}