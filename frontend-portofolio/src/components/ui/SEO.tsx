import { Helmet } from 'react-helmet-async'

interface SEOProps {
    title?: string
    description?: string
    name?: string
    type?: string
    image?: string
    url?: string
}

export default function SEO({ 
    title = 'Portfolio',
    description = 'Welcome to my professional portfolio showcasing my projects and skills.',
    name = 'Portfolio',
    type = 'website',
    image = '/og-image.jpg',
    url = window.location.href
}: SEOProps) {
    const defaultTitle = 'Vico Triansyah | Fullstack Developer'
    const fullTitle = title === 'Portfolio' ? defaultTitle : `${title} | Vico Triansyah`

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name='description' content={description} />
            
            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={name} />
            
            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    )
}
