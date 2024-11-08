<script setup lang="ts">
  import { Button } from '@/components/ui/button';
  import { Icon } from '@iconify/vue';

  defineProps<{
    text: string;
    icon: string;
  }>();
</script>

<template>
  <Button class="navbar-button" variant="outline">
    <Icon class="navbar-button-icon" :icon="icon"/> {{ text }}
  </Button>
</template>
