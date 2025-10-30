import { Experience } from '../../types'

interface ExperienceTimelineProps {
    experiences: Experience[]
}

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
    const formatDate = (date: string | null): string => {
        if (!date) return 'Present'
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    }

    const sortedExperiences = [...experiences].sort((a, b) => {
        const aDate = a.end_date === null ? new Date() : new Date(a.start_date)
        const bDate = b.end_date === null ? new Date() : new Date(b.start_date)
        return bDate.getTime() - aDate.getTime()
    })

    if (experiences.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No experience data available</p>
            </div>
        )
    }

    return (
        <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-secondary-500 transform -translate-x-1/2" />

            <div className="space-y-8">
                {sortedExperiences.map((exp) => (
                    <div key={exp.id} className="relative pl-12">
                        <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-primary-500 border-4 border-white dark:border-gray-900 shadow-lg transform -translate-x-1/2" />

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                        {exp.title}
                                    </h3>
                                    <p className="text-lg text-primary-600 dark:text-primary-400 font-medium">
                                        {exp.entity_name}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                        {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                {exp.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}