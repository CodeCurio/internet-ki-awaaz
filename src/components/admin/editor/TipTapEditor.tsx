'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  ListChecks,
  Indent,
  Outdent,
  ChevronDown,
  ImageIcon,
  LinkIcon,
  Minus,
  Check,
} from 'lucide-react';

interface TipTapEditorProps {
  initialContentJson?: any;
  initialContentHtml?: string;
  onChange: (json: Record<string, unknown>, html: string) => void;
}

// Extend BulletList to support custom styling types (disc, circle, square)
const CustomBulletList = BulletList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      listType: {
        default: 'disc',
        parseHTML: (element) =>
          element.getAttribute('data-list-style') || element.style.listStyleType || 'disc',
        renderHTML: (attributes) => {
          const type = attributes.listType || 'disc';
          return {
            'data-list-style': type,
            style: `list-style-type: ${type};`,
          };
        },
      },
    };
  },
});

// Extend OrderedList to support custom numbering styles (decimal, devanagari, lower-alpha, upper-alpha, lower-roman, upper-roman)
const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      listType: {
        default: 'decimal',
        parseHTML: (element) =>
          element.getAttribute('data-list-style') || element.style.listStyleType || 'decimal',
        renderHTML: (attributes) => {
          const type = attributes.listType || 'decimal';
          return {
            'data-list-style': type,
            style: `list-style-type: ${type};`,
          };
        },
      },
    };
  },
});

export type OrderedListType =
  | 'decimal'
  | 'devanagari'
  | 'lower-alpha'
  | 'upper-alpha'
  | 'lower-roman'
  | 'upper-roman';

export type BulletListType = 'disc' | 'circle' | 'square';

const ORDERED_LIST_OPTIONS: { id: OrderedListType; label: string; preview: string; description: string }[] = [
  { id: 'decimal', label: '1, 2, 3...', preview: '1. 2. 3.', description: 'सामान्य संख्या (Decimal)' },
  { id: 'devanagari', label: '१, २, ३...', preview: '१. २. ३.', description: 'देवनागरी अंक (Hindi Numbers)' },
  { id: 'lower-alpha', label: 'a, b, c...', preview: 'a. b. c.', description: 'लैटिन छोटे वर्ण (Lower Alpha)' },
  { id: 'upper-alpha', label: 'A, B, C...', preview: 'A. B. C.', description: 'लैटिन बड़े वर्ण (Upper Alpha)' },
  { id: 'lower-roman', label: 'i, ii, iii...', preview: 'i. ii. iii.', description: 'रोमन छोटे अंक (Lower Roman)' },
  { id: 'upper-roman', label: 'I, II, III...', preview: 'I. II. III.', description: 'रोमन बड़े अंक (Upper Roman)' },
];

const BULLET_LIST_OPTIONS: { id: BulletListType; label: string; preview: string; description: string }[] = [
  { id: 'disc', label: '● गोल बुलेट', preview: '●', description: 'मानक गोल बिंदु (Solid Disc)' },
  { id: 'circle', label: '○ वृत्त बुलेट', preview: '○', description: 'खाली गोल वृत्त (Hollow Circle)' },
  { id: 'square', label: '■ चौकोर बुलेट', preview: '■', description: 'ठोस चौकोर (Square)' },
];

export function TipTapEditor({ initialContentJson, initialContentHtml, onChange }: TipTapEditorProps) {
  const supabase = createClient();
  const [activeMenu, setActiveMenu] = useState<'ordered' | 'bullet' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: false,
        orderedList: false,
      }),
      CustomBulletList,
      CustomOrderedList,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        placeholder: 'यहाँ अपनी विस्तृत खबर लिखना शुरू करें...',
      }),
    ],
    content: initialContentHtml || initialContentJson || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none font-devanagari focus:outline-none min-h-[450px] p-4 leading-[1.9]',
        lang: 'hi',
        dir: 'ltr',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON() as Record<string, unknown>, currentEditor.getHTML());
    },
    immediatelyRender: false,
  });

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !editor) return;

      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `article-inline/${fileName}`;

      try {
        const { error } = await supabase.storage.from('post-media').upload(filePath, file);

        if (!error) {
          const {
            data: { publicUrl },
          } = supabase.storage.from('post-media').getPublicUrl(filePath);

          editor.chain().focus().setImage({ src: publicUrl, alt: 'चित्र' }).run();
        } else {
          // Demo fallback
          const objectUrl = URL.createObjectURL(file);
          editor.chain().focus().setImage({ src: objectUrl, alt: 'चित्र' }).run();
        }
      } catch {
        const objectUrl = URL.createObjectURL(file);
        editor.chain().focus().setImage({ src: objectUrl, alt: 'चित्र' }).run();
      }

      event.target.value = '';
    },
    [editor, supabase]
  );

  const applyOrderedList = (type: OrderedListType) => {
    if (!editor) return;
    if (editor.isActive('orderedList')) {
      editor.chain().focus().updateAttributes('orderedList', { listType: type }).run();
    } else {
      editor.chain().focus().toggleOrderedList().updateAttributes('orderedList', { listType: type }).run();
    }
    setActiveMenu(null);
  };

  const applyBulletList = (type: BulletListType) => {
    if (!editor) return;
    if (editor.isActive('bulletList')) {
      editor.chain().focus().updateAttributes('bulletList', { listType: type }).run();
    } else {
      editor.chain().focus().toggleBulletList().updateAttributes('bulletList', { listType: type }).run();
    }
    setActiveMenu(null);
  };

  if (!editor) {
    return (
      <div className="min-h-[450px] animate-pulse rounded-xl border border-slate-200 bg-slate-50" />
    );
  }

  const isOrderedActive = editor.isActive('orderedList');
  const isBulletActive = editor.isActive('bulletList');
  const isTaskListActive = editor.isActive('taskList');
  const currentOrderedType = editor.getAttributes('orderedList')?.listType || 'decimal';
  const currentBulletType = editor.getAttributes('bulletList')?.listType || 'disc';

  const toolbarButtonClass = (isActive: boolean) =>
    `rounded-lg p-2 hover:bg-slate-100 transition-colors flex items-center gap-1 ${
      isActive ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700'
    }`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm" ref={menuRef}>
      {/* Toolbar */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/95 backdrop-blur p-2 rounded-t-xl">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toolbarButtonClass(editor.isActive('bold'))}
          aria-label="मोटा (Bold)"
          title="मोटा (Ctrl+B)"
        >
          <Bold size={16} />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={toolbarButtonClass(editor.isActive('italic'))}
          aria-label="तिरछा (Italic)"
          title="तिरछा (Ctrl+I)"
        >
          <Italic size={16} />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1"></div>

        {/* Heading 2 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={toolbarButtonClass(editor.isActive('heading', { level: 2 }))}
          aria-label="शीर्षक 2 (H2)"
          title="बड़ा उप-शीर्षक (H2)"
        >
          <Heading2 size={16} />
        </button>

        {/* Heading 3 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={toolbarButtonClass(editor.isActive('heading', { level: 3 }))}
          aria-label="शीर्षक 3 (H3)"
          title="छोटा उप-शीर्षक (H3)"
        >
          <Heading3 size={16} />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={toolbarButtonClass(editor.isActive('blockquote'))}
          aria-label="उद्धरण (Quote)"
          title="उद्धरण बॉक्स"
        >
          <Quote size={16} />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1"></div>

        {/* Bullet List with Dropdown */}
        <div className="relative inline-flex items-center">
          <button
            type="button"
            onClick={() => {
              if (isBulletActive) {
                editor.chain().focus().toggleBulletList().run();
              } else {
                applyBulletList('disc');
              }
            }}
            className={`rounded-l-lg p-2 transition-colors ${
              isBulletActive ? 'bg-red-50 text-red-700 font-bold hover:bg-red-100' : 'text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="बुलेट सूची"
            title="बुलेट सूची (Bullet List)"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => setActiveMenu(activeMenu === 'bullet' ? null : 'bullet')}
            className={`rounded-r-lg p-1.5 border-l border-slate-200/80 transition-colors ${
              isBulletActive || activeMenu === 'bullet'
                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="बुलेट सूची शैलियाँ (Bullet Styles: ●, ○, ■)"
          >
            <ChevronDown size={13} />
          </button>

          {/* Bullet Options Dropdown */}
          {activeMenu === 'bullet' && (
            <div className="absolute top-full left-0 mt-1.5 w-60 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-30 animate-in fade-in slide-in-from-top-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1">
                बुलेट शैली चुनें
              </div>
              <div className="space-y-0.5">
                {BULLET_LIST_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => applyBulletList(opt.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors text-left ${
                      isBulletActive && currentBulletType === opt.id
                        ? 'bg-red-50 text-red-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm w-4 text-center text-red-600 font-bold">{opt.preview}</span>
                      <div>
                        <div className="font-medium leading-none">{opt.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{opt.description}</div>
                      </div>
                    </div>
                    {isBulletActive && currentBulletType === opt.id && (
                      <Check size={14} className="text-red-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Numbered / Ordered List with Dropdown */}
        <div className="relative inline-flex items-center">
          <button
            type="button"
            onClick={() => {
              if (isOrderedActive) {
                editor.chain().focus().toggleOrderedList().run();
              } else {
                applyOrderedList('decimal');
              }
            }}
            className={`rounded-l-lg p-2 transition-colors ${
              isOrderedActive ? 'bg-red-50 text-red-700 font-bold hover:bg-red-100' : 'text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="क्रमांकित सूची"
            title="क्रमांकित सूची (1, 2, 3...)"
          >
            <ListOrdered size={16} />
          </button>
          <button
            type="button"
            onClick={() => setActiveMenu(activeMenu === 'ordered' ? null : 'ordered')}
            className={`rounded-r-lg p-1.5 border-l border-slate-200/80 transition-colors ${
              isOrderedActive || activeMenu === 'ordered'
                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="संख्या प्रकार चुनें (1, 2, 3 / १, २, ३ / a, b, c / i, ii, iii)"
          >
            <ChevronDown size={13} />
          </button>

          {/* Ordered Options Dropdown */}
          {activeMenu === 'ordered' && (
            <div className="absolute top-full left-0 mt-1.5 w-64 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-30 animate-in fade-in slide-in-from-top-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1">
                संख्या / अक्षर प्रकार (List Type)
              </div>
              <div className="space-y-0.5">
                {ORDERED_LIST_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => applyOrderedList(opt.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors text-left ${
                      isOrderedActive && currentOrderedType === opt.id
                        ? 'bg-red-50 text-red-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs w-10 px-1 py-0.5 rounded bg-slate-100 text-center text-red-700 font-bold">
                        {opt.preview}
                      </span>
                      <div>
                        <div className="font-medium leading-none">{opt.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{opt.description}</div>
                      </div>
                    </div>
                    {isOrderedActive && currentOrderedType === opt.id && (
                      <Check size={14} className="text-red-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Task List / Checklist */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={toolbarButtonClass(isTaskListActive)}
          aria-label="चेकलिस्ट / कार्य सूची"
          title="चेकलिस्ट (Checklist / Task List ☑️)"
        >
          <ListChecks size={16} />
        </button>

        {/* Indent (Sub-list) & Outdent (Parent-list) */}
        <button
          type="button"
          onClick={() => {
            if (editor.can().sinkListItem('listItem')) {
              editor.chain().focus().sinkListItem('listItem').run();
            } else if (editor.can().sinkListItem('taskItem')) {
              editor.chain().focus().sinkListItem('taskItem').run();
            }
          }}
          disabled={!editor.can().sinkListItem('listItem') && !editor.can().sinkListItem('taskItem')}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="इंडेंट (उप-सूची बनाएं)"
          title="दाएं खिसकाएं / उप-सूची बनाएं (Indent / Sub-list)"
        >
          <Indent size={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            if (editor.can().liftListItem('listItem')) {
              editor.chain().focus().liftListItem('listItem').run();
            } else if (editor.can().liftListItem('taskItem')) {
              editor.chain().focus().liftListItem('taskItem').run();
            }
          }}
          disabled={!editor.can().liftListItem('listItem') && !editor.can().liftListItem('taskItem')}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="आउटडेंट (मुख्य सूची बनाएं)"
          title="बाएं खिसकाएं / मुख्य सूची बनाएं (Outdent / Parent-list)"
        >
          <Outdent size={16} />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1"></div>

        {/* Image Upload */}
        <label
          className="cursor-pointer rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center"
          title="छवि जोड़ें (Inline Image)"
        >
          <ImageIcon size={16} />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>

        {/* Hyperlink */}
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('लिंक यूआरएल दर्ज करें:');
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={toolbarButtonClass(editor.isActive('link'))}
          aria-label="लिंक जोड़ें"
          title="हाइपरलिंक"
        >
          <LinkIcon size={16} />
        </button>

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="विभाजक रेखा"
          title="विभाजक रेखा (Divider)"
        >
          <Minus size={16} />
        </button>
      </div>

      {/* Editor Content Canvas */}
      <div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
