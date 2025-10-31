import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'

const md = new MarkdownIt({ linkify: true, breaks: true, html: false })

interface ProjectBodyProps {
    body: string;
}

export default function ProjectBody({ body }: ProjectBodyProps) {
    const html = DOMPurify.sanitize(md.render(body || ''))

    return (
        <div
            className="
                [&>h1]:text-4xl [&>h1]:font-extrabold [&>h1]:mt-10 [&>h1]:mb-6 [&>h1]:leading-tight [&>h1]:border-b-[3px] [&>h1]:border-primary-600 [&>h1]:pb-3
                dark:[&>h1]:border-primary-400
                
                [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-5 [&>h2]:leading-snug [&>h2]:border-b-2 [&>h2]:border-primary-500/30 [&>h2]:pb-2
                dark:[&>h2]:border-primary-400/30
                
                [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:mt-7 [&>h3]:mb-4 [&>h3]:leading-normal
                [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:mt-6 [&>h4]:mb-3
                [&>h5]:text-lg [&>h5]:font-semibold [&>h5]:mt-5 [&>h5]:mb-3
                [&>h6]:text-base [&>h6]:font-semibold [&>h6]:mt-4 [&>h6]:mb-2
                
                [&>p]:my-5 [&>p]:leading-relaxed [&>p]:text-base
                
                [&>ul]:my-5 [&>ul]:pl-8 [&>ul]:list-disc [&>ul]:space-y-2
                [&>ul>li]:leading-relaxed
                [&>ul>ul]:mt-2 [&>ul>ul]:mb-2 [&>ul>ul]:list-[circle]
                
                [&>ol]:my-5 [&>ol]:pl-8 [&>ol]:list-decimal [&>ol]:space-y-2
                [&>ol>li]:leading-relaxed
                [&>ol>ol]:mt-2 [&>ol>ol]:mb-2 [&>ol>ol]:list-[lower-alpha]
                
                [&>blockquote]:my-6 [&>blockquote]:pl-6 [&>blockquote]:py-2 [&>blockquote]:border-l-4 [&>blockquote]:border-primary-600 [&>blockquote]:bg-primary-50/50 [&>blockquote]:rounded-r-lg [&>blockquote]:italic
                dark:[&>blockquote]:border-primary-400 dark:[&>blockquote]:bg-primary-900/20
                
                [&>pre]:my-6 [&>pre]:p-6 [&>pre]:bg-slate-900 [&>pre]:text-slate-100 [&>pre]:rounded-xl [&>pre]:overflow-x-auto [&>pre]:border [&>pre]:border-primary-500/20
                dark:[&>pre]:bg-slate-950 dark:[&>pre]:border-primary-400/30
                [&>pre>code]:bg-transparent [&>pre>code]:p-0 [&>pre>code]:text-inherit
                
                [&_code]:bg-primary-100 [&_code]:text-pink-600 [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.9em] [&_code]:font-semibold [&_code]:font-mono
                dark:[&_code]:bg-primary-900/30 dark:[&_code]:text-pink-400
                
                [&>table]:w-full [&>table]:my-6 [&>table]:border-collapse [&>table]:rounded-lg [&>table]:overflow-hidden [&>table]:border [&>table]:border-slate-300
                dark:[&>table]:border-slate-700
                [&>table>thead]:bg-primary-100
                dark:[&>table>thead]:bg-primary-900/30
                [&>table>thead>tr>th]:p-4 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-bold [&>table>thead>tr>th]:border-b-2 [&>table>thead>tr>th]:border-primary-500
                dark:[&>table>thead>tr>th]:border-primary-400
                [&>table>tbody>tr>td]:p-4 [&>table>tbody>tr>td]:border-b [&>table>tbody>tr>td]:border-slate-200
                dark:[&>table>tbody>tr>td]:border-slate-700
                [&>table>tbody>tr:last-child>td]:border-b-0
                [&>table>tbody>tr:hover]:bg-primary-50/50
                dark:[&>table>tbody>tr:hover]:bg-primary-900/10
                
                [&>hr]:my-10 [&>hr]:border-0 [&>hr]:border-t-2 [&>hr]:border-slate-300
                dark:[&>hr]:border-slate-700
                
                [&>img]:my-6 [&>img]:rounded-xl [&>img]:shadow-2xl [&>img]:max-w-full [&>img]:h-auto
                
                [&_a]:text-primary-600 [&_a]:font-medium [&_a]:no-underline [&_a]:transition-colors hover:[&_a]:text-primary-700 hover:[&_a]:underline
                dark:[&_a]:text-primary-400 dark:hover:[&_a]:text-primary-300
                
                [&_strong]:font-bold [&_strong]:text-inherit
                [&_em]:italic
            "
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}