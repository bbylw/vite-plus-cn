import GithubSlugger from 'github-slugger';

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** 去掉标题里的内联 markdown 标记，得到纯文本 */
function plainText(src: string): string {
  return src
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 用与 rehype-slug 相同的 github-slugger 提取 Markdown 的 h2/h3 标题，
 * 从而与渲染出的 heading id 完全一致。h1 也会使 slugger 计数器前进，
 * 以匹配整篇文档中的真实去重行为。
 */
export function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];

  for (const line of markdown.split('\n')) {
    const m = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    if (!m) continue;
    const level = m[1].length as 1 | 2 | 3;
    const id = slugger.slug(plainText(m[2]));
    if (level === 2 || level === 3) {
      out.push({ id, text: plainText(m[2]), level });
    }
  }

  return out;
}
