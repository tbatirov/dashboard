<script setup lang="ts">
    import type { DashletSettings } from '@/types';
    import {  useFieldStore } from '@/stores/field';

    defineProps<{
        settings: DashletSettings;
        chartData: number;
    }>();
    const fieldStore = useFieldStore();
</script>

<template>
    <div class="card-content">
        <span class="card-value">{{ Number(chartData.toLocaleString('en-US')).toFixed(settings[fieldStore.decimalPoint.id]) }}</span>
    </div>
</template>
