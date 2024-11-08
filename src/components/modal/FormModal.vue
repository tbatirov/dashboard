<script setup lang="ts">
  import { ref, watch } from "vue";
  import type { FormData } from "@/types";
  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';

  const props = defineProps<{
    modalData: FormData | null;
  }>();

  const modalData = ref<FormData | null>(props.modalData);
  const isOpen = ref<boolean>(modalData.value !== null);

  const closeDialog = () => {
    isOpen.value = false;
  };

  watch(() => props.modalData, (newModalData) => {
    modalData.value = newModalData;
    isOpen.value = newModalData !== null;
  }, {immediate: true});
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[480px]">
      <DialogHeader>
        <DialogTitle>{{ modalData?.title }}</DialogTitle>
        <DialogDescription>{{ modalData?.description }}</DialogDescription>
      </DialogHeader>
      <slot/>
      <DialogFooter>
        <Button @click="closeDialog()" variant="outline">{{ modalData?.labels?.cancelBtnText }}</Button>
        <Button @click="[closeDialog(), modalData?.action()]">{{ modalData?.labels?.actionBtnText }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
