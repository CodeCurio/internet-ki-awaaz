import { describe, it, expect } from 'vitest';
import { formatHindiDate, formatRelativeHindiTime, truncateGlyphs, slugifyText } from '@/lib/utils';
import { extractYoutubeVideoId } from '@/lib/youtube/youtube-client';

describe('Pure Helper Functions', () => {
  it('truncates text based on true Devanagari glyph count rather than raw code units', () => {
    const text = 'गोंडा में अत्याधुनिक सुपर स्पेशियलिटी';
    const truncated = truncateGlyphs(text, 10);
    expect(Array.from(truncated).length).toBeLessThanOrEqual(11);
  });

  it('slugifies Hindi and alphanumeric text cleanly', () => {
    const text = 'गोंडा में नई सड़क परियोजना 2026';
    const slug = slugifyText(text);
    expect(slug).toBe('गोंडा-में-नई-सड़क-परियोजना-2026');
  });

  it('extracts YouTube video IDs correctly from various URL patterns', () => {
    expect(extractYoutubeVideoId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractYoutubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractYoutubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractYoutubeVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('formats Hindi dates and relative times properly', () => {
    const nowIso = new Date().toISOString();
    expect(formatRelativeHindiTime(nowIso)).toBe('अभी-अभी');
  });
});
