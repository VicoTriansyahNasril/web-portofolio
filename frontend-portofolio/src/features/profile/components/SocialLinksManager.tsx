import { useEffect, useState, ChangeEvent } from 'react'
import { SocialLink } from '../types'

interface SocialLinksManagerProps {
    links: SocialLink[]
    onUpdate: (links: SocialLink[]) => void
}

const socialPlatforms = [
    { name: 'GitHub', icon: 'github', placeholder: 'https://github.com/username' },
    { name: 'LinkedIn', icon: 'linkedin', placeholder: 'https://linkedin.com/in/username' },
    { name: 'Twitter', icon: 'twitter', placeholder: 'https://twitter.com/username' },
    { name: 'Instagram', icon: 'instagram', placeholder: 'https://instagram.com/username' },
    { name: 'Facebook', icon: 'facebook', placeholder: 'https://facebook.com/username' },
    { name: 'YouTube', icon: 'youtube', placeholder: 'https://youtube.com/@username' },
    { name: 'Portfolio', icon: 'globe', placeholder: 'https://yourwebsite.com' },
    { name: 'Email', icon: 'mail', placeholder: 'mailto:your@email.com' },
]

export default function SocialLinksManager({ links, onUpdate }: SocialLinksManagerProps) {
    const [internalLinks, setInternalLinks] = useState<SocialLink[]>([])

    useEffect(() => {
        const mergedLinks = socialPlatforms.map(platform => {
            const existingLink = links.find(l => l.name === platform.name);
            return existingLink ? { ...existingLink } : {
                id: 0,
                name: platform.name,
                url: '',
                icon: platform.icon,
                active: false,
            };
        });
        setInternalLinks(mergedLinks);
    }, [links]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
        const newUrl = e.target.value;
        const updatedLinks = internalLinks.map(link => {
            if (link.name === name) {
                return { ...link, url: newUrl, active: newUrl.length > 0 };
            }
            return link;
        });
        setInternalLinks(updatedLinks);
        onUpdate(updatedLinks);
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Social Media Links
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Isi URL untuk memunculkan ikon sosial media di halaman publik.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {internalLinks.map((link) => {
                    const platform = socialPlatforms.find(p => p.name === link.name);
                    return (
                        <div key={link.name}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {link.name}
                            </label>
                            <input
                                type={link.icon === 'mail' ? 'email' : 'url'}
                                value={link.url}
                                onChange={(e) => handleChange(e, link.name)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder={platform?.placeholder}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}