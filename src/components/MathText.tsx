import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
}

const blockRegex = /\$\$([\s\S]+?)\$\$/g;
const inlineRegex = /\$([^$\n]+?)\$/g;

function renderInlineMath(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  return escaped.replace(inlineRegex, (_match, expression) =>
    katex.renderToString(expression.trim(), {
      throwOnError: false,
      displayMode: false,
    })
  );
}

export default function MathText({ text, className }: MathTextProps) {
  const parts: Array<{ type: 'text' | 'block'; value: string }> = [];
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: 'text', value: text.slice(last, match.index) });
    }
    parts.push({ type: 'block', value: match[1] });
    last = match.index + match[0].length;
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
                __html: katex.renderToString(part.value.trim(), {
                  throwOnError: false,
                  displayMode: true,
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
