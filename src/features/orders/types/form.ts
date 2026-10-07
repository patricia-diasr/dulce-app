import dayjs from 'dayjs';
import { z } from 'zod';

export const scheduleBlockFormSchema = z
  .object({
    type: z.enum(['EVENTUAL', 'RECURRING']),
    allDay: z.boolean().optional(),
    blockDate: z.string().optional(),
    recurrence: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),
    weekday: z.number().optional(),
    monthDay: z.number().optional(),
    startTime: z.string().min(1, 'Informe o horário de início'),
    endTime: z.string().min(1, 'Informe o horário de término'),
    validFrom: z.string().optional(),
    validUntil: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const today = dayjs().startOf('day');

    if (values.type === 'EVENTUAL') {
      if (!values.blockDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['blockDate'],
          message: 'Informe a data do bloqueio',
        });
      } else if (dayjs(values.blockDate).isBefore(today, 'day')) {
        ctx.addIssue({
          code: 'custom',
          path: ['blockDate'],
          message: 'A data não pode estar no passado',
        });
      }
      return;
    }

    if (!values.recurrence) {
      ctx.addIssue({
        code: 'custom',
        path: ['recurrence'],
        message: 'Selecione a recorrência',
      });
    }

    if (values.recurrence === 'WEEKLY' && !values.weekday) {
      ctx.addIssue({
        code: 'custom',
        path: ['weekday'],
        message: 'Selecione o dia da semana',
      });
    }

    if (values.recurrence === 'MONTHLY' && !values.monthDay) {
      ctx.addIssue({
        code: 'custom',
        path: ['monthDay'],
        message: 'Informe o dia do mês',
      });
    }

    if (!values.validFrom) {
      ctx.addIssue({
        code: 'custom',
        path: ['validFrom'],
        message: 'Informe o início da vigência',
      });
    } else if (dayjs(values.validFrom).isBefore(today, 'day')) {
      ctx.addIssue({
        code: 'custom',
        path: ['validFrom'],
        message: 'O início da vigência não pode estar no passado',
      });
    }

    if (values.validUntil && values.validFrom && values.validUntil < values.validFrom) {
      ctx.addIssue({
        code: 'custom',
        path: ['validUntil'],
        message: 'Fim da vigência não pode ser anterior ao início',
      });
    }
  });

export type ScheduleBlockFormValues = z.infer<typeof scheduleBlockFormSchema>;
