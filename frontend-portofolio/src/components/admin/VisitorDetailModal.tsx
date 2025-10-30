import { VisitorDetail } from '../../types';
import { format } from 'date-fns';

interface VisitorDetailModalProps {
    detail: VisitorDetail | null;
    open: boolean;
    onClose: () => void;
}

export default function VisitorDetailModal({ detail, open, onClose }: VisitorDetailModalProps) {
    if (!open || !detail) return null;

    const formatDate = (dateString: string): string => {
        return format(new Date(dateString), 'dd MMM yyyy, HH:mm:ss');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Visitor Details
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

                <div className="p-6 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Total Visits</h3>
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{detail.totalPageViews}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Most Visited</h3>
                            <p className="text-lg font-medium text-gray-900 dark:text-white truncate">{detail.pageFrequencies[0]?.path || 'N/A'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">First Visit</h3>
                            <p className="text-gray-900 dark:text-white font-medium">{formatDate(detail.firstVisit)}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Last Visit</h3>
                            <p className="text-gray-900 dark:text-white font-medium">{formatDate(detail.lastVisit)}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Visit Log</h3>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg max-h-64 overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2">Path</th>
                                        <th className="px-4 py-2">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {detail.visitLog.map(log => (
                                        <tr key={log.id}>
                                            <td className="px-4 py-2 font-mono">{log.path}</td>
                                            <td className="px-4 py-2">{formatDate(log.timestamp)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}