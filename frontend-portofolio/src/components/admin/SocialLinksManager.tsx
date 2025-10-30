import { useState, useEffect, FormEvent } from 'react'
import { Social } from '../../types'

interface SocialLinksManagerProps {
    links: Social[]
    onUpdate: (links: Social[]) => void
}

const socialPlatforms = [
    { name: 'GitHub', icon: 'github', placeholder: 'https://github.com/username' },
    { name: 'LinkedIn', icon: 'linkedin', placeholder: 'https://linkedin.com/in/username' },
    { name: 'Twitter', icon: 'twitter', placeholder: 'https://twitter.com/username' },
    { name: 'Instagram', icon: 'instagram', placeholder: 'https://instagram.com/username' },
    { name: 'Facebook', icon: 'facebook', placeholder: 'https://facebook.com/username' },
    { name: 'YouTube', icon: 'youtube', placeholder: 'https://youtube.com/@username' },
    { name: 'Portfolio', icon: 'globe', placeholder: 'https://yourwebsite.com' },
    { name: 'Email', icon: 'mail', placeholder: 'your@email.com' },
]

export default function SocialLinksManager({ links, onUpdate }: SocialLinksManagerProps) {
    const [socialLinks, setSocialLinks] = useState<Social[]>(links)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setSocialLinks(links);
    }, [links]);

    const handleChange = (name: string, url: string) => {
        setSocialLinks((prev) => {
            const newLinks = [...prev];
            const existingIndex = newLinks.findIndex((link) => link.name === name);
            if (existingIndex > -1) {
                newLinks[existingIndex] = { ...newLinks[existingIndex], url: url };
            } else {
                const platform = socialPlatforms.find(p => p.name === name);
                newLinks.push({ name, url, id: 0, icon: platform?.icon || '', active: url.length > 0 });
            }
            return newLinks.map(link => ({ ...link, active: link.url.length > 0 }));
        });
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onUpdate(socialLinks)
        } catch (error) {
            console.error('Error updating social links:', error)
        } finally {
            setLoading(false)
        }
    }

    const getLinkValue = (name: string): string => {
        return socialLinks.find((link) => link.name === name)?.url || ''
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Social Media Links
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Isi URL untuk memunculkan ikon sosial media di halaman publik.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialPlatforms.map((platform) => (
                    <div key={platform.name}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {platform.name}
                        </label>
                        <input
                            type={platform.icon === 'mail' ? 'email' : 'url'}
                            value={getLinkValue(platform.name)}
                            onChange={(e) => handleChange(platform.name, e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder={platform.placeholder}
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    )
}