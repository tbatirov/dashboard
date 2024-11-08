import { useFieldStore } from '@/stores/field';
import type { ChartStore } from '@/types'
import { defineStore } from 'pinia'

export const useChartStore = defineStore<'chart', ChartStore>('chart', {
  state: () => ({
    default: {
      minWidth: 2,
      minHeight: 2,
      tools: [],
      similarCharts: ['card', 'line', 'bar', 'table'],
      fields: [
        useFieldStore().dashletType,
        useFieldStore().title,
      ],
      defaultSettings: {
        [useFieldStore().dashletType.id]: 'default',
        [useFieldStore().title.id]: '',
      },
    },
    card: {
      minWidth: 2,
      minHeight: 2,
      tools: [],
      similarCharts: [],
      fields: [
        useFieldStore().dashletType,
        useFieldStore().title,
        useFieldStore().cardDataColumn,
        useFieldStore().func,
        useFieldStore().decimalPoint,
        useFieldStore().dashletFilter,
      ],
      defaultSettings: {
        [useFieldStore().title.id]: '',
        [useFieldStore().func.id]: 'count',
        [useFieldStore().decimalPoint.id]: 0,
      },
    },
    line: {
      minWidth: 2,
      minHeight: 2,
      tools: [],
      similarCharts: ['bar'],
      fields: [
        useFieldStore().dashletType,
        useFieldStore().title,
        useFieldStore().xAxisColumn,
        useFieldStore().yAxisColumn,
        useFieldStore().dashletFilter,
      ],
      defaultSettings: {
        [useFieldStore().title.id]: '',
      },
    },
    bar: {
      minWidth: 2,
      minHeight: 2,
      tools: [],
      similarCharts: ['line'],
      fields: [
        useFieldStore().dashletType,
        useFieldStore().title,
        useFieldStore().xAxisColumn,
        useFieldStore().yAxisColumn,
        useFieldStore().dashletFilter,
      ],
      defaultSettings: {
        [useFieldStore().title.id]: '',
      },
    },
    table: {
      minWidth: 4,
      minHeight: 4,
      tools: [],
      similarCharts: [],
      fields: [
        useFieldStore().dashletType,
        useFieldStore().title,
        useFieldStore().tableColumns,
        useFieldStore().dashletFilter,
      ],
      defaultSettings: {
        [useFieldStore().title.id]: '',
        [useFieldStore().tableColumns.id]: [],
      },
    },
  })
});
