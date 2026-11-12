import katex from 'katex';

interface MathTextProps {
  /** Prose with $inline$ and $$display$$ TeX. */
  text: string;
  className?: string;
}

const blockRegex = /\$\$([\s\S]+?)\$\$/g;
const inlineRegex = /\$([^$\n]+?)\$/g;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escape the prose and render the $...$ spans. The TeX itself must reach KaTeX
 * unescaped, or a prime or a comparison sign in a formula turns into an HTML entity.
 */
function renderInlineMath(text: string): string {
  let html = '';
  let last = 0;

  for (const match of text.matchAll(inlineRegex)) {
    const start = match.index ?? 0;
    html += escapeHtml(text.slice(last, start));
    html += katex.renderToString(match[1].trim(), {
      throwOnError: false,
      displayMode: false,
    });
    last = start + match[0].length;
  }

  return html + escapeHtml(text.slice(last));
}

export default function MathText({ text, className }: MathTextProps) {
  const parts: Array<{ type: 'text' | 'block'; value: string }> = [];
  let last = 0;

  for (const match of text.matchAll(blockRegex)) {
    const start = match.index ?? 0;
    if (start > last) {
      parts.push({ type: 'text', value: text.slice(last, start) });
    }
    parts.push({ type: 'block', value: match[1] });
    last = start + match[0].length;
  }

  if (last < text.length) {
    parts.push({ type: 'text', value: text.slice(last) });
  }

  return (
    <div className={className}>
      {parts.map((part, index) => {
        if (part.type === 'block') {
          return (
            <div
              key={`block-${index}`}
              className="my-2 overflow-x-auto"
              dangerouslySetInnerHTML={{
                // fleqn: left-aligned, so a long equation starts at the margin instead of being centred off-screen
                __html: katex.renderToString(part.value.trim(), {
                  throwOnError: false,
                  displayMode: true,
                  fleqn: true,
                }),
              }}
            />
          );
        }

        const lines = part.value.split('\n').filter((line) => line.trim().length > 0);

        return lines.map((line, lineIndex) => (
          <p
            key={`text-${index}-${lineIndex}`}
            className="leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: renderInlineMath(line.trim()),
            }}
          />
        ));
      })}
    </div>
  );
}
