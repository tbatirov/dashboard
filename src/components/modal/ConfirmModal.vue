<script setup lang="ts">
  import { ref, watch } from "vue";
  import type { ConfirmData } from "@/types";
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
    modalData: ConfirmData | null;
  }>();

  const modalData = ref<ConfirmData | null>(props.modalData);
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
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ modalData?.title }}</DialogTitle>
        <DialogDescription>{{ modalData?.description }}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <template v-if="modalData?.isAlert">
          <Button>{{ modalData?.labels?.okBtnText }}</Button>
        </template>
        <template v-else>
          <Button @click="closeDialog()" variant="outline">{{ modalData?.labels?.cancelBtnText }}</Button>
          <Button @click="[closeDialog(), modalData?.action()]">{{ modalData?.labels?.actionBtnText }}</Button>
        </template>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
