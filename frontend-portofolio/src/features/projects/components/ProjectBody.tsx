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
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}