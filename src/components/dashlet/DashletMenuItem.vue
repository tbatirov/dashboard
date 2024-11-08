<script setup lang="ts">
  import { ContextMenuItem } from '@/components/ui/context-menu';
  import { Icon } from '@iconify/vue';

  defineProps<{
    text: string;
    icon: string;
  }>();
</script>

<template>
  <ContextMenuItem class="dashlet-menu-item">
    <Icon class="dashlet-menu-icon" :icon="icon"/> {{ text }}
  </ContextMenuItem>
</template>
