function applyTransformations(url: string, transformations: string): string {
    if (!url || !url.includes('cloudinary.com')) {
        return url;
    }
    const parts = url.split('/upload/');
    if (parts.length !== 2) {
        return url;
    }
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
}

export function fileUrl(u?: string | null): string {
    if (!u) return '';
    const transformations = 'f_auto,q_auto';
    return applyTransformations(u, transformations);
}

export function transformedFileUrl(u?: string | null, options: { width?: number; height?: number } = {}): string {
    if (!u) return '';
    const baseTransforms = ['f_auto', 'q_auto'];
    if (options.width) baseTransforms.push(`w_${options.width}`);
    if (options.height) baseTransforms.push(`h_${options.height}`);
    if (options.width || options.height) baseTransforms.push('c_fill');

    return applyTransformations(u, baseTransforms.join(','));
}