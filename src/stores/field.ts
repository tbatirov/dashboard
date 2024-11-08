import type { FieldTypeStore, FieldStore } from '@/types'
import { defineStore } from 'pinia'

export const useFieldTypeStore = defineStore<'fieldType', FieldTypeStore>('fieldType', {
  state: () => ({
    number: 'number',
    text: 'text',
    file: 'file',
    selector: 'selector',
    multiSelector: 'multi-selector',
    filter: 'filter',
  })
})

export const useFieldStore = defineStore<'field', FieldStore>('field', {
  state: () => ({
    title: { id: 'title', label: 'title', type: useFieldTypeStore().text, config: { autofocus: false, maxlength: 32 } },
    decimalPoint: { id: 'decimalPoint', label: 'decimalPoint', type: useFieldTypeStore().number, config: { min: 0, max: 6 } },
    icon: { id: 'icon', label: 'icon', type: useFieldTypeStore().file, config: { accept: '.svg' } },
    dashletType: { id: 'dashletType', label: 'dashletType', type: useFieldTypeStore().selector, config: { optionsName: 'similar-charts' } },
    cardDataColumn: { id: 'cardDataColumn', label: 'cardDataColumn', type: useFieldTypeStore().selector, config: { optionsName: 'dataset-columns' } },
    func: { id: 'func', label: 'func', type: useFieldTypeStore().selector, config: { optionsName: 'funcs' } },
    xAxisColumn: { id: 'xAxisColumn', label: 'xAxisColumn', type: useFieldTypeStore().selector, config: { optionsName: 'dataset-columns' } },
    yAxisColumn: { id: 'yAxisColumn', label: 'yAxisColumn', type: useFieldTypeStore().selector, config: { optionsName: 'dataset-columns' } },
    tableColumns: { id: 'tableColumns', label: 'tableColumns', type: useFieldTypeStore().multiSelector, config: { optionsName: 'dataset-columns' } },
    dashletFilter: { id: 'dashletFilter', label: 'dashletFilter', type: useFieldTypeStore().filter, config: { optionsName: 'dataset-columns-filter' } },
  })
})
