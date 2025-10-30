import { Profile } from '../../types'
import { fileUrl } from '../../utils/url'

interface ProfileHeaderProps {
    profile: Profile
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
    return (
        <div className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    {profile.photo_url && (
                        <div className="relative">
                            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                                <img
                                    src={fileUrl(profile.photo_url)}
                                    alt={profile.full_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-3xl">👋</span>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            {profile.full_name}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-6">
                            {profile.headline}
                        </p>
                        <p className="text-lg text-white/80 max-w-3xl mb-8 leading-relaxed">
                            {profile.bio}
                        </p>

                        {profile.socials && profile.socials.length > 0 && (
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                {profile.socials.filter(s => s.active).map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.name.toLowerCase() === 'email' ? `mailto:${link.url}` : link.url}
                                        target={link.name.toLowerCase() === 'email' ? undefined : '_blank'}
                                        rel={link.name.toLowerCase() === 'email' ? undefined : 'noopener noreferrer'}
                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                                    >
                                        <span className="font-medium">{link.name}</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}