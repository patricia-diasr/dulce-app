import { Group, Text } from '@mantine/core';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { caramelBorder, creamBackground } from '@/theme/colors';
import { MAX_HEADER_WIDTH } from '@/theme/layout';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div
      style={{
        backgroundColor: creamBackground,
        borderBottom: `1px solid ${caramelBorder}`,
      }}
    >
      <Group h={60} px="md" gap={8} wrap="nowrap" maw={MAX_HEADER_WIDTH} mx="auto">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Group key={`${item.label}-${index}`} gap={8} wrap="nowrap" align="center">
              {index > 0 && <ChevronRight size={16} color={caramelBorder} aria-hidden />}

              {isLast ? (
                <Text size="sm" fw={800}>
                  {item.label}
                </Text>
              ) : item.href ? (
                <Text
                  component={Link}
                  to={item.href}
                  size="sm"
                  fw={900}

                  c="plum.6"
                  style={{ textDecoration: 'none' }}
                >
                  {item.label}
                </Text>
              ) : (
                <Text size="sm" fw={900} c="plum.8">
                  {item.label}
                </Text>
              )}
            </Group>
          );
        })}
      </Group>
    </div>
  );
}
