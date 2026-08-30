interface ArticleBodyProps {
  bodyJson?: any;
  bodyHtmlCache?: string | null;
}

export function ArticleBody({ bodyJson, bodyHtmlCache }: ArticleBodyProps) {
  // If pre-cached HTML is available, render safely
  if (bodyHtmlCache && bodyHtmlCache.trim().length > 0) {
    return (
      <div
        className="prose prose-lg max-w-none text-slate-800 font-devanagari leading-[1.9] text-[1.125rem]"
        dangerouslySetInnerHTML={{ __html: bodyHtmlCache }}
      />
    );
  }

  // If TipTap JSON node structure is provided
  if (bodyJson && typeof bodyJson === 'object' && bodyJson.content) {
    return (
      <div className="prose prose-lg max-w-none text-slate-800 font-devanagari leading-[1.9] text-[1.125rem]">
        {renderTipTapNodes(bodyJson.content)}
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none text-slate-800 font-devanagari leading-[1.9] text-[1.125rem]">
      <p>
        इस खबर का विस्तृत विवरण शीघ्र ही अपडेट किया जा रहा है। जुड़े रहें इंटरनेट की आवाज़ के साथ।
      </p>
    </div>
  );
}

function renderTipTapNodes(nodes: any[]): React.ReactNode {
  return nodes.map((node, index) => {
    switch (node.type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-6">
            {node.content ? renderInlineMarks(node.content) : null}
          </p>
        );
      case 'heading':
        const Tag = `h${node.attrs?.level || 2}` as keyof JSX.IntrinsicElements;
        return (
          <Tag key={index} className="font-bold text-slate-900 mt-8 mb-4">
            {node.content ? renderInlineMarks(node.content) : null}
          </Tag>
        );
      case 'blockquote':
        return (
          <blockquote key={index} className="border-l-4 border-red-700 bg-slate-100/70 p-4 rounded-r-lg my-6">
            {node.content ? renderTipTapNodes(node.content) : null}
          </blockquote>
        );
      case 'bulletList':
        return (
          <ul
            key={index}
            style={node.attrs?.listType ? { listStyleType: node.attrs.listType } : undefined}
            data-list-style={node.attrs?.listType || 'disc'}
            className="list-disc pl-6 mb-6 space-y-2"
          >
            {node.content ? renderTipTapNodes(node.content) : null}
          </ul>
        );
      case 'orderedList':
        return (
          <ol
            key={index}
            style={node.attrs?.listType ? { listStyleType: node.attrs.listType } : undefined}
            data-list-style={node.attrs?.listType || 'decimal'}
            className="list-decimal pl-6 mb-6 space-y-2"
          >
            {node.content ? renderTipTapNodes(node.content) : null}
          </ol>
        );
      case 'taskList':
        return (
          <ul key={index} data-type="taskList" className="my-4 space-y-2 list-none pl-0">
            {node.content ? renderTipTapNodes(node.content) : null}
          </ul>
        );
      case 'taskItem':
        const isChecked = Boolean(node.attrs?.checked);
        return (
          <li key={index} data-type="taskItem" data-checked={isChecked} className="flex items-start gap-2.5 my-1">
            <label className="flex items-center pt-1">
              <input
                type="checkbox"
                checked={isChecked}
                readOnly
                className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
            </label>
            <div className={`flex-1 ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {node.content ? renderTipTapNodes(node.content) : null}
            </div>
          </li>
        );
      case 'listItem':
        return (
          <li key={index}>
            {node.content ? renderTipTapNodes(node.content) : null}
          </li>
        );
      case 'image':
        return (
          <figure key={index} className="my-6">
            <img
              src={node.attrs?.src}
              alt={node.attrs?.alt || ''}
              className="w-full rounded-xl shadow-md object-cover"
            />
            {node.attrs?.title && (
              <figcaption className="text-xs text-slate-500 text-center mt-2">
                {node.attrs.title}
              </figcaption>
            )}
          </figure>
        );
      default:
        return null;
    }
  });
}

function renderInlineMarks(contentList: any[]): React.ReactNode {
  return contentList.map((item, idx) => {
    let textNode: React.ReactNode = item.text;

    if (item.marks) {
      for (const mark of item.marks) {
        if (mark.type === 'bold') {
          textNode = <strong key={`b-${idx}`} className="font-bold text-slate-950">{textNode}</strong>;
        } else if (mark.type === 'italic') {
          textNode = <em key={`i-${idx}`} className="italic text-red-900">{textNode}</em>;
        } else if (mark.type === 'link') {
          textNode = (
            <a
              key={`a-${idx}`}
              href={mark.attrs?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-700 hover:text-red-900 underline font-medium"
            >
              {textNode}
            </a>
          );
        }
      }
    }

    return <span key={idx}>{textNode}</span>;
  });
}
