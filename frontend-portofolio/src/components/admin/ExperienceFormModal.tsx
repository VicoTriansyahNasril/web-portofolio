import { useState, useEffect, FormEvent } from 'react';
import { Experience } from '../../types';

interface ExperienceFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
    initialData?: Experience | null;
}

export default function ExperienceFormModal({ open, onClose, onSubmit, initialData }: ExperienceFormModalProps) {
    const [type, setType] = useState('Work');
    const [title, setTitle] = useState('');
    const [entityName, setEntityName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isCurrent, setIsCurrent] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setType(initialData.type || 'Work');
            setTitle(initialData.title || '');
            setEntityName(initialData.entity_name || '');
            setLocation(initialData.location || '');
            setDescription(initialData.description || '');
            setStartDate(initialData.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : '');
            setEndDate(initialData.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : '');
            setIsCurrent(initialData.end_date === null);
        } else {
            // Reset form
            setType('Work');
            setTitle('');
            setEntityName('');
            setLocation('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setIsCurrent(false);
        }
    }, [initialData, open]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                type,
                title,
                entity_name: entityName,
                location,
                description,
                start_date: startDate,
                end_date: isCurrent ? null : endDate,
            });
            onClose();
        } catch (error) {
            console.error('Error submitting experience:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {initialData ? 'Edit Experience' : 'Add Experience'}
                    </h2>
                    <button onClick={onClose} type="button" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Form fields go here */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title / Position</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full input-class" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Company / Organization</label>
                            <input type="text" value={entityName} onChange={e => setEntityName(e.target.value)} required className="w-full input-class" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full input-class" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full input-class" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} disabled={isCurrent} className="w-full input-class" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="isCurrent" checked={isCurrent} onChange={e => setIsCurrent(e.target.checked)} className="h-4 w-4 text-primary-600 border-gray-300 rounded" />
                        <label htmlFor="isCurrent" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">I currently work here</label>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 btn-primary">{loading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}