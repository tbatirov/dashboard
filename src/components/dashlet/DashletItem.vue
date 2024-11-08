<script setup lang="ts">
    import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
    import { useChartStore } from '@/stores/chart';
    import type { Dashlet } from '@/types';

    defineProps<{
        id: string;
        dashlet: Dashlet;
        isBuilder: Boolean;
    }>();

    const chartStore = useChartStore();
</script>

<template>
    <ContextMenu>
        <div class="grid-stack-item" :id="id" :gs-id="id"
            :gs-x="dashlet.x" :gs-y="dashlet.y" :gs-w="dashlet.w" :gs-h="dashlet.h"
            :gs-min-w="chartStore[dashlet.type].minWidth" :gs-min-h="chartStore[dashlet.type].minHeight"
            :gs-no-resize="!isBuilder" :gs-no-move="!isBuilder">
            <ContextMenuTrigger class="grid-stack-item-content" :disabled="!isBuilder">
                <slot></slot>
            </ContextMenuTrigger>
        </div>
    </ContextMenu>
</template>
