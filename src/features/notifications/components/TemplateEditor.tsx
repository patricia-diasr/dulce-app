import { useEffect } from 'react';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Braces } from 'lucide-react';
import { InsertVariableMenu } from './InsertVariableMenu';
import { VariableNode } from './VariableNode';
import {
  unwrapVariablesForApi,
  wrapVariablesForEditor,
} from '../utils/variableTransforms';

const EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [3, 4] },
    blockquote: false,
    codeBlock: false,
    code: false,
    horizontalRule: false,
    strike: false,
  }),
  VariableNode,
];

interface TemplateEditorProps {
  initialContent: string;
  onChange: (html: string) => void;
}

export function TemplateEditor({ initialContent, onChange }: TemplateEditorProps) {
  const editor = useEditor({
    extensions: EXTENSIONS,
    content: wrapVariablesForEditor(initialContent),
  });

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => onChange(unwrapVariablesForApi(editor.getHTML()));
    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, onChange]);

  const handleInsertVariable = (name: string) => {
    editor?.chain().focus().insertVariable(name).run();
  };

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar sticky stickyOffset={0}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <InsertVariableMenu onSelect={handleInsertVariable}>
            <RichTextEditor.Control
              aria-label="Inserir variável"
              title="Inserir variável"
            >
              <Braces size={16} />
            </RichTextEditor.Control>
          </InsertVariableMenu>
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
