import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { VariableBadge } from './VariableBadge';

export function VariablePillView({ node }: NodeViewProps) {
  const name = node.attrs.name as string;

  return (
    <NodeViewWrapper as="span" style={{ display: 'inline-block' }}>
      <VariableBadge name={name} style={{ cursor: 'default' }} />
    </NodeViewWrapper>
  );
}
