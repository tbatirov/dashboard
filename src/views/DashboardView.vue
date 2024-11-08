<script setup lang="ts">
  import { type Component, ref, computed, nextTick, onMounted } from 'vue';
  import { useRoute } from "vue-router";
  import { GridStack } from 'gridstack';
  import { Icon } from '@iconify/vue';
  import { v4 as uuid } from 'uuid';

  import type { Theme, Dataset, Dashlets, Dashlet, FormData, ConfirmData, DashletSettings, Field, Cache, TableData } from '@/types';
  import { setTheme, formatLabel, toTitleCase, isNumeric, groupBy, filterDataset } from '@/composables';
  import { useFieldTypeStore, useFieldStore } from '@/stores/field';
  import { useLabelStore } from '@/stores/label';
  import { useChartStore } from '@/stores/chart';
  import { DashboardApi } from '@/api';
  import { TextField, NumberField, FileField, SelectorField, MultiSelectorField, FilterField } from '@/components/field';
  import { DashletItem, DashletMenu, DashletMenuItem } from '@/components/dashlet';
  import { CardChart, LineChart, BarChart, TableChart } from '@/components/chart';
  import { FormModal, ConfirmModal } from '@/components/modal';
  import { CommandButton } from '@/components/command';

  defineProps({
    id: {
      type: String,
      default: null,
    }
  }); // TODO: Need to add lang in props

  const route = useRoute();
  const isBuilder = ref<boolean>(route.name === 'Builder');
  const grid = ref<GridStack | null>(null);

  const storedLang = localStorage.getItem('lang');
  const lang = ref<string>(storedLang || 'ru');

  const labelStore = useLabelStore()[lang.value];
  const fieldTypeStore = useFieldTypeStore();
  const fieldStore = useFieldStore();
  const chartStore = useChartStore();

  const selectedDashletId = ref<string>('');
  const dashlets = ref<Dashlets>({});
  const changedSettings = ref<DashletSettings>({});
  const dataset = ref<Dataset>({
    columns: [],
    labels: {
      ru: {} // TODO: Need to request TEAM to add locales to dataset and remove "ru" key
    },
    data: []
  });
  const cache = ref<Cache>({});

  const isLoading = ref<boolean>(false);
  const formData = ref<FormData | null>(null);
  const confirmData = ref<ConfirmData | null>(null);

  const storedTheme = localStorage.getItem('theme') as Theme | null;
  const theme = ref<Theme>(storedTheme === 'dark' ? 'dark' : 'light');

  // TODO: Need to think about rework and move icons to pinia store
  const activeThemeIcon = computed<string>(() => theme.value === 'dark' ? 'radix-icons:sun' : 'solar:moon-outline');
  const loadingIcon = ref<string>('eos-icons:three-dots-loading');
  const addDashletIcon = ref<string>('bi:app-indicator');
  const saveIcon = ref<string>('iconoir:save-floppy-disk');
  const editDashletIcon = ref<string>('bi:pencil');
  const deleteDashletIcon = ref<string>('bi:trash');

  const toogleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
    setTheme(theme.value);
  };

  const getFieldType = (key: string): Component | undefined => {
    const fieldType = fieldStore[key].type;
    switch (fieldType) {
      case fieldTypeStore.number:
        return NumberField;
      case fieldTypeStore.text:
        return TextField;
      case fieldTypeStore.selector:
        return SelectorField;
      case fieldTypeStore.multiSelector:
        return MultiSelectorField;
      case fieldTypeStore.file:
        return FileField;
      case fieldTypeStore.filter:
        return FilterField;
      default:
        return;
    }
  };

  const getFieldValue = (dashletId: string, field: string) => {
    return dashlets.value[dashletId].settings[field];
  };

  const onFieldChange = (key: string, value: any) => {
    changedSettings.value[key] = value;
  };

  const getCacheOrCalculate = (id: string, dashlet: Dashlet, calculateFunc: (dashlet: Dashlet) => any, forceUpdate: boolean = false) => {
    const ONE_MINUTE = 1000 * 60;
    const FIVE_MINUTES = ONE_MINUTE * 5;
    const cacheId = `${dashlet.type}.${id}`;
    const now = Date.now();
    if (cacheId in cache.value && !forceUpdate) {
      const lastUpdated = cache.value[cacheId].last_updated;
      if (lastUpdated && now - lastUpdated < FIVE_MINUTES) return cache.value[cacheId].data;
    }
    const value = calculateFunc(dashlet);
    cache.value[cacheId] = { data: value, last_updated: now };
    return value;
  };

  const calculateDashletData = (id: string, dashlet: Dashlet, forceUpdate: boolean = false) => {
    var calculateFunc;
    if (dashlet.type === 'card') calculateFunc = calculateCardData;
    else if (dashlet.type === 'line' || dashlet.type === 'bar') calculateFunc = calculateTwoAxisData;
    else if (dashlet.type === 'table') calculateFunc = calculateTableData;
    if (!calculateFunc) return;
    return getCacheOrCalculate(id, dashlet, calculateFunc, forceUpdate);
  };

  const onDashletChange = (_event: Event, changedDashlets: any[]) => {
    changedDashlets.forEach((changedDashlet) => {
      const id: string = changedDashlet.id;
      const dashlet: Dashlet = dashlets.value[id];
      dashlet.x = changedDashlet.x;
      dashlet.y = changedDashlet.y;
      dashlet.w = changedDashlet.w;
      dashlet.h = changedDashlet.h;
    });
  };

  const addDashlet = () => {
    if (!grid.value) return;

    const id = uuid();
    const defaultType = 'default';
    const defaultChart = chartStore[defaultType];
    dashlets.value[id] = {
      type: defaultType,
      w: defaultChart.minWidth,
      h: defaultChart.minHeight,
      settings: {...defaultChart.defaultSettings},
    };

    nextTick(() => {
      const dashletElement = document.getElementById(id);
      if (dashletElement) grid.value!.makeWidget(dashletElement);
    });
  };

  const editDashlet = (id: string) => {
    selectedDashletId.value = id;
    changedSettings.value = {};
    formData.value = {
      title: labelStore.editDashlet,
      description: `${id}`,
      action: () => saveDashlet(id),
      labels: {
        cancelBtnText: labelStore.cancel,
        actionBtnText: labelStore.save,
      },
    };
  };

  const deleteDashlet = (id: string) => {
    confirmData.value = {
      title: labelStore.warning,
      description: formatLabel(labelStore.warningDelete, {id: id}),
      action: () => {
        delete dashlets.value[id];
        grid.value?.removeWidget(`#${CSS.escape(id)}`, false);
      },
      labels: {
        cancelBtnText: labelStore.cancel,
        actionBtnText: labelStore.continue,
      },
      isAlert: false,
    };
  };

  const saveDashlet = (id: string) => {
    const updateDashletSettings = (chartType: string) => {
      const defaultSettings = chartStore[chartType].defaultSettings;
      Object.entries(defaultSettings).forEach(([key, value]) => {
        if (!(key in dashlet.settings)) {
          dashlet.settings[key] = value;
        }
      });
      const fields = chartStore[chartType].fields.map((field) => field.id);
      Object.keys(dashlet.settings).forEach((key) => {
        if (!fields.includes(key)) {
          delete dashlet.settings[key];
        }
      });
    };

    const dashlet: Dashlet = dashlets.value[id];
    const fields = chartStore[dashlet.type].fields.map((field: Field) => field.id);

    Object.entries(changedSettings.value).forEach(([key, value]: [string, any]) => {
      if (key === fieldStore.dashletType.id) {
        updateDashletSettings(value);
        dashlet.type = value;
      }
      if (fields.includes(key)) {
        dashlet.settings[key] = value;
      }
    });

    changedSettings.value = {};
    calculateDashletData(id, dashlet, true);
  };

  const getFieldOptions = (id: string, optionsName: string) => {
    const funcs = {
      'count': labelStore.count,
      'distinct-count': labelStore.distinctCount,
      'sum': labelStore.sum,
      'min': labelStore.min,
      'max': labelStore.max,
      'avg': labelStore.avg,
    };
    const operations = {
      'equal': '=',
      'not_equal': '<>',
    };
    const dashlet: Dashlet = dashlets.value[id];

    if (optionsName === 'similar-charts') {
      return [dashlet.type, ...chartStore[dashlet.type].similarCharts].reduce((acc, chart) => {
        acc[chart] = toTitleCase(chart);
        return acc;
      }, {} as Record<string, string>);
    } else if (optionsName === 'dataset-columns') {
      return dataset.value.labels[lang.value];
    } else if (optionsName === 'funcs') {
      return funcs;
    } else if (optionsName === 'dataset-columns-filter') {
      return {
        dataset: dataset.value.labels[lang.value],
        operations: operations,
      };
    }
    return {};
  };

  const getFieldConfig = (field: Field, id: string) => {
    const config = fieldStore[field.id].config;
    const optionsName = config.optionsName;
    if ('optionsName' in config) {
      return {...config, options: getFieldOptions(id, optionsName)};
    }
    return config;
  };

  const calculateCardData = (dashlet: Dashlet): number | string => {
    const { cardDataColumn, func, dashletFilter = [] } = dashlet.settings;
    const filteredDataset = filterDataset(dataset.value.data, dashletFilter);
    if (!func) return filteredDataset.length;

    var initialValue = 0;
    if (func === 'min') initialValue = Infinity;
    else if (func === 'max') initialValue = -Infinity;

    var data: string[] = [];
    var result = filteredDataset.reduce((acc, item) => {
      const value = item[cardDataColumn as string];
      if (!isNumeric(value) && func !== 'distinct-count') { return acc + 1; }
      const numValue = Number(value);
      switch (func) {
        case 'sum': return acc + numValue;
        case 'min': return Math.min(acc, numValue);
        case 'max': return Math.max(acc, numValue);
        case 'count': return acc + 1;
        case 'distinct-count':
          acc += (data.includes(value) ? 0 : 1);
          data.push(value);
          return acc;
      }
      return acc;
    }, initialValue);
    if (func === 'avg') result /= filteredDataset.length;
    return result;
  };

  const calculateTwoAxisData = (dashlet: Dashlet): { series: ApexAxisChartSeries, xaxis: { categories: string[] } } => {
    const { xAxisColumn, yAxisColumn, dashletFilter = [] } = dashlet.settings;
    const filteredDataset = filterDataset(dataset.value.data, dashletFilter);

    if (!xAxisColumn || !yAxisColumn) return { series: [], xaxis: { categories: [] } };

    const groups = groupBy(filteredDataset, xAxisColumn);
    const categories: string[] = Object.keys(groups);
    var data: number[] = [];

    categories.forEach((key: string) => {
      const item = groups[key];
      data.push(item.reduce((acc: number) => {
        return acc + 1;
      }, 0));
    });

    const seriesName = dataset.value.labels[lang.value][yAxisColumn];
    return {
      series: [{ name: seriesName, data }],
      xaxis: { categories },
    };
  };

  const calculateTableData = (dashlet: Dashlet): TableData => {
    const { tableColumns = [], dashletFilter = [] } = dashlet.settings;
    const filteredDataset = filterDataset(dataset.value.data, dashletFilter);

    const headers = tableColumns.map((header: string) => dataset.value.labels[lang.value][header]);
    const data = filteredDataset.map(item =>
      tableColumns.reduce((filteredItem: Record<string, string>, key: string) => {
        if (key in item) filteredItem[key] = item[key];
        return filteredItem;
      }, {})
    );
    return {
      headers: headers,
      data: data,
    };
  }

  const initDataset = async () => {
    const fetchedDataset = await DashboardApi.getDataset();
    if (!('data' in fetchedDataset) && !('columns' in fetchedDataset)) return;
    dataset.value.data = fetchedDataset.data;
    dataset.value.labels.ru = fetchedDataset.label; // TODO: Need to request to add locales to dataset and remove "ru" key
    dataset.value.columns = fetchedDataset.columns.split(",");
  }

  const initGrid = async () => {
    grid.value = GridStack.init({
      float: true,
      animate: false,
      cellHeight: 64,
      minRow: 1,
      maxRow: 24,
      margin: 3,
    });
    grid.value.on('change', onDashletChange);
  };

  onMounted(async () => {
    isLoading.value = true;
    setTheme(theme.value);
    await initGrid();
    await initDataset();
    isLoading.value = false;
  });
</script>

<template>
  <div class="loading-section" v-if="isLoading">
    <Icon class="loading-icon" :icon="loadingIcon"/>
  </div>
  <div class="content-section" v-show="!isLoading">
    <div class="navbar-section">
      <CommandButton :text="labelStore.addDashlet" :icon="addDashletIcon" @click="addDashlet"/>
      <CommandButton :text="labelStore.saveChanges" :icon="saveIcon" disabled/>
      <CommandButton :text="labelStore.changeTheme" :icon="activeThemeIcon" @click="toogleTheme" disabled/>
    </div>
    <div class="grid-section">
      <div class="grid-stack">
        <DashletItem v-for="([id, dashlet]) in Object.entries(dashlets)" :key="id" :id="id" :dashlet="dashlet" :is-builder="isBuilder">
          <div class="dashlet-header" v-if="dashlet.settings[fieldStore.title.id]">
            <div class="dashlet-title">{{ dashlet.settings[fieldStore.title.id] }}</div>
          </div>
          <div class="dashlet-content">
            <CardChart v-if="dashlet.type === 'card'" :chart-data="calculateDashletData(id, dashlet)" :settings="dashlet.settings"/>
            <LineChart v-else-if="dashlet.type === 'line'" :chart-data="calculateDashletData(id, dashlet)" :settings="dashlet.settings" :no-data-text="labelStore.noData"/>
            <BarChart v-else-if="dashlet.type === 'bar'" :chart-data="calculateDashletData(id, dashlet)" :settings="dashlet.settings" :no-data-text="labelStore.noData"/>
            <TableChart v-else-if="dashlet.type === 'table'" :chart-data="calculateDashletData(id, dashlet)" :settings="dashlet.settings" :no-data-text="labelStore.noData"/>
          </div>
          <DashletMenu v-if="isBuilder">
            <DashletMenuItem :text="labelStore.editDashlet" :icon="editDashletIcon" @click="editDashlet(id)"/>
            <DashletMenuItem :text="labelStore.deleteDashlet" :icon="deleteDashletIcon" @click="deleteDashlet(id)"/>
          </DashletMenu>
        </DashletItem>
      </div>
    </div>
  </div>
  <FormModal :modal-data="formData">
    <template v-for="field in chartStore[dashlets[selectedDashletId].type].fields" :key="field.id">
      <component :is="getFieldType(field.id)" :id="field.id" :label="labelStore[field.id]" :value="getFieldValue(selectedDashletId, field.id)" :config="getFieldConfig(field, selectedDashletId)" :on-change="onFieldChange"/>
    </template>
  </FormModal>
  <ConfirmModal :modal-data="confirmData"/>
</template>
