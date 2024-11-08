<script setup lang="ts">
    import { ref, watch } from 'vue';
    import type { DashletSettings } from '@/types';
    import type { ApexOptions } from "apexcharts";

    const props = defineProps<{
        settings: DashletSettings;
        chartData: any;
        noDataText: string;
    }>();

    const options = ref<ApexOptions>({
        chart: {
            toolbar: { show: false },
            zoom: { enabled: false },
            selection: { enabled: false },
        },
        stroke: {
            width: 4,
            curve: 'smooth',
        },
        markers: {
            size: 2,
        },
        grid: {
            borderColor: 'muted',
        },
        legend: {
            position: 'top'
        },
        tooltip: {
            marker: {
                show: false,
            },
        },
        dataLabels: {
            enabled: true
        },
        noData: {
            text: props.noDataText,
        },
        xaxis: {
            categories: props.chartData.xaxis.categories,
            labels: {
                style: {
                    fontWeight: 600,
                }
            },
            tooltip: {
                enabled: false,
            },
        },
        colors: ['primary'],
    });
    const series = ref<any>(props.chartData.series);

    watch(() => props.chartData, (newChartData) => {
        options.value = {
            ...options.value,
            xaxis: newChartData.xaxis
        };
        series.value = newChartData.series;
    });
</script>

<template>
    <div class="line-content">
        <apexchart type="line" height="95%" :options="options" :series="series"></apexchart>
    </div>
</template>
