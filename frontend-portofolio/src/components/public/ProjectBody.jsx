import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'

const md = new MarkdownIt({ linkify: true, breaks: true, html: false })

export default function ProjectBody({ body }) {
    const html = DOMPurify.sanitize(md.render(body || ''))
    return <div dangerouslySetInnerHTML={{ __html: html }} />
}
