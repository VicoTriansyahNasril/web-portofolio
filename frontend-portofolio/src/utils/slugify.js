export function slugify(input = '') {
    return String(input)
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
}

export const isValidSlug = (s) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(s));
