import { describe, it, expect } from 'vitest';

// Simple utility test to demonstrate testing infrastructure
describe('Slug Generation Logic', () => {
    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    };

    it('should convert name to kebab-case slug', () => {
        expect(generateSlug('My AI Tool')).toBe('my-ai-tool');
    });

    it('should handle special characters', () => {
        expect(generateSlug('AI-Tool! 2026')).toBe('ai-tool-2026');
    });

    it('should trim leading and trailing hyphens', () => {
        expect(generateSlug('--Extra--Hyphens--')).toBe('extra-hyphens');
    });
});
