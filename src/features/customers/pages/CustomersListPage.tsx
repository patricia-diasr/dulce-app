import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Group,
  Loader,
  Menu,
  SimpleGrid,
  Skeleton,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { useDebouncedValue, useInViewport } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChevronDown, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Fab } from '@/shared/components/Fab/Fab';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { listCustomers, type CustomerSearchField } from '../api/customersApi';
import { CustomerCard } from '../components/CustomerCard';

const SEARCH_FIELD_LABELS: Record<CustomerSearchField, string> = {
  name: 'Nome',
  email: 'E-mail',
  phone: 'Telefone',
};

export function CustomersListPage() {
  const [searchField, setSearchField] = useState<CustomerSearchField>('name');
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 350);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['admin', 'customers', searchField, debouncedSearch],
      queryFn: ({ pageParam }) =>
        listCustomers({
          searchField,
          searchValue: debouncedSearch || undefined,
          page: pageParam,
          size: 20,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const nextPage = lastPage.page + 1;
        return nextPage < lastPage.totalPages ? nextPage : undefined;
      },
    });

  const customers = useMemo(
    () => data?.pages.flatMap((page) => page.content) ?? [],
    [data],
  );
  const totalElements = data?.pages[0]?.totalElements ?? 0;

  const { ref: sentinelRef, inViewport } = useInViewport();

  useEffect(() => {
    if (inViewport && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inViewport, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const showEmptyState = !isLoading && !isError && customers.length === 0;

  return (
    <Box style={{ minHeight: '100%', position: 'relative' }}>
      <Container size={MAX_CONTENT_WIDTH}>
        <Group mb="lg" gap="xs" wrap="nowrap">
          <TextInput
            style={{ flex: 1 }}
            placeholder={`Buscar por ${SEARCH_FIELD_LABELS[searchField].toLowerCase()}`}
            leftSection={<Search size={18} />}
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
          />

          <Menu withArrow position="bottom-end">
            <Menu.Target>
              <UnstyledButton
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px 12px',
                  borderRadius: 'var(--mantine-radius-md)',
                  border: '1px solid var(--mantine-color-lilac-4)',
                  backgroundColor: 'var(--mantine-color-lilac-0)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Text size="sm" fw={600} c="plum.7">
                  {SEARCH_FIELD_LABELS[searchField]}
                </Text>
                <ChevronDown size={16} color="var(--mantine-color-plum-6)" />
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              {(Object.keys(SEARCH_FIELD_LABELS) as CustomerSearchField[]).map(
                (field) => (
                  <Menu.Item
                    key={field}
                    onClick={() => setSearchField(field)}
                    color={field === searchField ? 'plum' : undefined}
                    fw={field === searchField ? 700 : 400}
                  >
                    {SEARCH_FIELD_LABELS[field]}
                  </Menu.Item>
                ),
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>

        {!isLoading && !isError && totalElements > 0 && (
          <Text size="sm" c="dimmed" mb="md">
            {totalElements}
            {totalElements === 1 ? 'cliente encontrado' : 'clientes encontrados'}
          </Text>
        )}

        {isLoading && (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            <Skeleton height={160} radius="md" />
            <Skeleton height={160} radius="md" />
            <Skeleton height={160} radius="md" />
          </SimpleGrid>
        )}

        {isError && (
          <Box
            style={{
              minHeight: '50vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Text c="rejected">
              Não foi possível carregar os clientes. Tente novamente em instantes.
            </Text>
          </Box>
        )}

        {showEmptyState && (
          <Box
            style={{
              minHeight: '50vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Text c="dimmed">Nenhum cliente encontrado.</Text>
          </Box>
        )}

        {customers.length > 0 && (
          <>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
              {customers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
            </SimpleGrid>

            <Box ref={sentinelRef} style={{ height: 1 }} />

            {isFetchingNextPage && (
              <Group justify="center" mt="md">
                <Loader size="sm" color="plum" />
              </Group>
            )}
          </>
        )}
      </Container>

      <Fab component={Link} to="/admin/clientes/novo" leftSection={<Plus size={18} />}>
        Novo cliente
      </Fab>
    </Box>
  );
}
