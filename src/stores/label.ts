import type { LabelStore } from '@/types';
import { defineStore } from 'pinia';

export const useLabelStore = defineStore<'label', LabelStore>('label', {
  state: () => ({
    ru: {
      title: 'Названия',
      decimalPoint: 'Десятичные разряды',
      icon: 'Иконка',
      dashletType: 'Тип дашлета',
      cardDataColumn: 'Значение',
      func: 'Функция',
      xAxisColumn: 'Значение по оси X',
      yAxisColumn: 'Значение по оси Y',
      tableColumns: 'Cтолбцы таблицы',
      dashletFilter: 'Фильтр',

      count: 'Количество',
      sum: 'Сумма',
      min: 'Минимум',
      max: 'Максимум',
      avg: 'Среднее',
      distinctCount: 'Отчетливое количество',

      noData: 'Нет данных',

      addDashlet: 'Добавить дашлет',
      saveChanges: 'Сохранить изменения',
      changeTheme: 'Сменить тему',
      editDashlet: 'Редактировать',
      filterDashlet: 'Фильтр',
      deleteDashlet: 'Удалить',
      warning: 'Предупреждение',
      warningDelete: 'Вы собираетесь удалить дашлет: [{id}].\nВсе данные о дашлете будут потеряны.',
      cancel: 'Отменить',
      continue: 'Продолжить',
      ok: 'Понятно',
      save: 'Cохранить',
    }
  }),
});
