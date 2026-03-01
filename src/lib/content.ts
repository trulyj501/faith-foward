// Utility to fetch and parse markdown files using Vite's import.meta.glob

export interface ContentItem {
    slug: string;
    title: string;
    excerpt: string;
    tags?: string[];
    publishedDate?: string;
    subtitle?: string;
    content: string; // the raw markdown body
    category: 'projects' | 'experiments' | 'essays';
}

// In Vite, this gathers all markdown files in the specified directories
const rawContentModules = import.meta.glob('../../content/**/*.md', {
    as: 'raw',
    eager: true,
});

export const getAllContent = (): ContentItem[] => {
    const allContent: ContentItem[] = [];

    for (const path in rawContentModules) {
        const rawMarkdown = rawContentModules[path] as string;

        // Determine category from path (.../content/projects/qotd.md -> projects)
        const categoryMatch = path.match(/content\/(.*?)\//);
        const category = categoryMatch ? categoryMatch[1] : 'unknown';

        // Very basic frontmatter parser (assuming --- blocks)
        // For a real production app with complex markdown, 'gray-matter' is used during build,
        // but here we can parse the raw string directly since 'import.meta.glob' gives us raw strings in the client/SSR bundle.

        const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
        const match = rawMarkdown.match(frontmatterRegex);

        let metadata: Partial<ContentItem> = {};
        let content = rawMarkdown;

        if (match) {
            const fmString = match[1];
            content = rawMarkdown.replace(frontmatterRegex, '').trim();

            // Parse simple key: value pairs from frontmatter
            const lines = fmString.split('\n');
            lines.forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length > 0) {
                    const val = valueParts.join(':').trim().replace(/^"|"$/g, ''); // Remove quotes
                    const cleanKey = key.trim() as keyof ContentItem;

                    if (cleanKey === 'tags') {
                        // handle arrays like ["react", "spirituality"]
                        metadata[cleanKey] = val.replace(/^\[|\]$/g, '').split(',').map(s => s.trim().replace(/^"|"$/g, ''));
                    } else {
                        (metadata as any)[cleanKey] = val;
                    }
                }
            });
        }

        // Default slug to filename if not provided
        if (!metadata.slug) {
            metadata.slug = path.split('/').pop()?.replace('.md', '') || 'unknown';
        }

        allContent.push({
            ...metadata,
            content,
            category: category as any,
        } as ContentItem);
    }

    // Sort by date descending
    return allContent.sort((a, b) => {
        if (!a.publishedDate) return 1;
        if (!b.publishedDate) return -1;
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });
};

export const getContentByCategory = (category: string) => {
    return getAllContent().filter(item => item.category === category);
};

export const getContentBySlug = (slug: string) => {
    return getAllContent().find(item => item.slug === slug);
};
