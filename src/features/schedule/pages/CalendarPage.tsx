import 'dayjs/locale/pt-br';
import { useMemo, useState } from 'react';
import { Box, Container, Grid, LoadingOverlay, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  MonthView,
  WeekView,
  type DateStringValue,
  type ScheduleEventData,
} from '@mantine/schedule';
import dayjs from 'dayjs';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Fab } from '@/shared/components/Fab/Fab';
import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { CalendarToolbar } from '../components/CalendarToolbar';
import { DayAgenda } from '../components/DayAgenda';
import { SCHEDULE_LABELS } from '../constants/scheduleLabels';
import { useCalendarData } from '../hooks/useCalendarData';
import {
  buildBlockedDayEvents,
  buildMonthOrderEvents,
  buildWeekBlockEvents,
  buildWeekOrderEvents,
} from '../utils/calendarEvents';
import {
  formatPeriodLabel,
  getVisibleRange,
  shiftAnchor,
  type CalendarView,
} from '../utils/calendarRange';
import { FIRST_DAY_OF_WEEK } from '../constants/calendar';
import { textColor } from '@/theme/colors';

const toDateString = (value: string) =>
  dayjs(value).format('YYYY-MM-DD') as DateStringValue;

const renderMonthEventBody = (event: ScheduleEventData) => (
  <Text size="xs" fw={600} c={textColor} style={{ lineHeight: 1, padding: '1px 1px' }}>
    {event.title}
  </Text>
);

const renderWeekEventBody = (event: ScheduleEventData) => {
  const isBlock = typeof event.id === 'string' && event.id.startsWith('block-');
  if (isBlock) return null;

  return (
    <Text size="xs" fw={600} c={textColor} style={{ lineHeight: 1, padding: '1px 1px' }}>
      {event.title}
    </Text>
  );
};

export function CalendarPage() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width: 75em)');

  const [view, setView] = useState<CalendarView>('month');
  const [anchor, setAnchor] = useState<DateStringValue>(() =>
    toDateString(dayjs().format('YYYY-MM-DD')),
  );
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    dayjs().format('YYYY-MM-DD'),
  );

  const { from, to } = getVisibleRange(view, anchor);
  const { orders, blockedDays, blocks, isLoading, isError } = useCalendarData(from, to);

  const events = useMemo(() => {
    if (view === 'month') {
      return [...buildBlockedDayEvents(blockedDays), ...buildMonthOrderEvents(orders)];
    }
    return [...buildWeekBlockEvents(blocks, from, to), ...buildWeekOrderEvents(orders)];
  }, [view, blockedDays, blocks, orders, from, to]);

  const goToDate = (date: string) => setSelectedDate(dayjs(date).format('YYYY-MM-DD'));

  const handleDaySelect = (date: string) => {
    if (isDesktop) {
      goToDate(date);
    } else {
      navigate(`/admin/calendario/dias/${dayjs(date).format('YYYY-MM-DD')}`);
    }
  };

  return (
    <Box style={{ minHeight: '100%', position: 'relative' }}>
      <Container size={MAX_CONTENT_WIDTH} py={{ base: 'md', sm: 'xl' }}>
        <CalendarToolbar
          label={formatPeriodLabel(view, anchor)}
          view={view}
          showViewSwitcher
          onViewChange={setView}
          onPrevious={() => setAnchor(toDateString(shiftAnchor(view, anchor, -1)))}
          onNext={() => setAnchor(toDateString(shiftAnchor(view, anchor, 1)))}
          onToday={() => setAnchor(toDateString(dayjs().format('YYYY-MM-DD')))}
        />

        {isError ? (
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
              Não foi possível carregar o calendário. Tente novamente em instantes.
            </Text>
          </Box>
        ) : (
          <Grid columns={10} gap="xl">
            <Grid.Col span={{ base: 10, lg: 7 }}>
              <Box pos="relative" style={{ backgroundColor: '#FEFEFE' }}>
                <LoadingOverlay
                  visible={isLoading}
                  loaderProps={{ color: 'plum' }}
                  overlayProps={{ radius: 'md', blur: 1 }}
                />

                {view === 'month' ? (
                  <MonthView
                    radius="sm"
                    date={anchor}
                    onDateChange={setAnchor}
                    events={events}
                    withHeader={false}
                    locale="pt-br"
                    labels={SCHEDULE_LABELS}
                    firstDayOfWeek={FIRST_DAY_OF_WEEK}
                    onDayClick={handleDaySelect}
                    onEventClick={(event) => handleDaySelect(String(event.start))}
                    renderEventBody={renderMonthEventBody}
                  />
                ) : (
                  <WeekView
                    radius={0}
                    date={anchor}
                    onDateChange={setAnchor}
                    events={events}
                    withHeader={false}
                    withAllDaySlots={false}
                    locale="pt-br"
                    labels={SCHEDULE_LABELS}
                    firstDayOfWeek={FIRST_DAY_OF_WEEK}
                    startTime="06:00:00"
                    endTime="22:00:00"
                    onEventClick={(event) => {
                      if (typeof event.id === 'number')
                        navigate(`/admin/pedidos/${event.id}`);
                    }}
                    onTimeSlotClick={({ slotStart }) => handleDaySelect(slotStart)}
                    renderEventBody={renderWeekEventBody}
                  />
                )}
              </Box>
            </Grid.Col>

            {isDesktop && (
              <Grid.Col
                span={{ base: 10, lg: 3 }}
                style={{ position: 'sticky', top: 90, alignSelf: 'flex-start' }}
              >
                <DayAgenda date={selectedDate} />
              </Grid.Col>
            )}
          </Grid>
        )}
      </Container>

      <Fab
        component={Link}
        to="/admin/calendario/bloqueios/novo"
        leftSection={<Plus size={18} />}
      >
        Novo bloqueio
      </Fab>
    </Box>
  );
}
