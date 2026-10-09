import { useEffect } from 'react';
import { Button, Group, Stack, Text } from '@mantine/core';
import { Extension, Node } from '@tiptap/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Braces } from 'lucide-react';
import { wrapSubjectForEditor } from '../utils/variableTransforms';
import { InsertVariableMenu } from './InsertVariableMenu';
import { VariableNode } from './VariableNode';

const SingleParagraphDocument = Node.create({
  name: 'doc',
  topNode: true,
  content: 'paragraph',
});

const BlockEnterKey = Extension.create({
  name: 'blockEnterKey',
  priority: 1000,
  addKeyboardShortcuts() {
    return {
      Enter: () => true,
      'Shift-Enter': () => true,
    };
  },
});

const EXTENSIONS = [
  SingleParagraphDocument,
  StarterKit.configure({
    document: false,
    heading: false,
    bold: false,
    italic: false,
    bulletList: false,
    orderedList: false,
    listItem: false,
    blockquote: false,
    codeBlock: false,
    code: false,
    horizontalRule: false,
    strike: false,
    hardBreak: false,
  }),
  VariableNode,
  BlockEnterKey,
];

interface SubjectEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export function SubjectEditor({ initialValue, onChange }: SubjectEditorProps) {
  const editor = useEditor({
    extensions: EXTENSIONS,
    content: wrapSubjectForEditor(initialValue),
    editorProps: {
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData('text/plain');
        if (text === undefined) return false;
        const singleLine = text.replace(/\s*[\r\n]+\s*/g, ' ');
        view.dispatch(view.state.tr.insertText(singleLine).scrollIntoView());
        return true;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => onChange(editor.getText());
    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, onChange]);

  const handleInsertVariable = (name: string) => {
    editor?.chain().focus().insertVariable(name).run();
  };

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center">
        <Text size="sm" fw={800}>
          Assunto
        </Text>
        <InsertVariableMenu onSelect={handleInsertVariable}>
          <Button
            variant="subtle"
            size="xs"
            color="plum"
            leftSection={<Braces size={14} />}
          >
            Inserir variável
          </Button>
        </InsertVariableMenu>
      </Group>

      <RichTextEditor editor={editor}>
        <RichTextEditor.Content />
      </RichTextEditor>
    </Stack>
  );
}
