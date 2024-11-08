<script setup lang="ts">
  import { ref } from "vue";
  import { Icon } from '@iconify/vue';
  import { Label } from "@/components/ui/label";
  import { Button } from '@/components/ui/button';
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

  const props = defineProps<{
    id: string;
    label: string;
    value?: string[];
    config: any;
    onChange: (key: string, value: any) => void;
  }>();

  const fields = ref<any[]>(props.value || []);

  const removeField = (index: number) => {
      fields.value.splice(index, 1);
      props.onChange(props.id, [...fields.value]);
  };

  const handleSelectChange = (index: number, value: string) => {
    fields.value[index] = value;
    props.onChange(props.id, [...fields.value]);
  };
</script>

<template>
  <div class="form-field">
    <Label class="field-label" :for="props.id">{{ props.label }}</Label>
    <div class="multi-selector-fields">
      <div v-for="(field, index) in [...fields, '']" :key="index" class="multi-selector-field">
        <Select class="flex-1" v-model:model-value="fields[index]" @update:model-value="(value) => handleSelectChange(index, value)">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="([optionKey, optionValue]) in Object.entries(props.config.options)" :key="optionKey" :value="optionKey">
                {{optionValue}}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button class="multi-selector-delete-btn" variant="outline" v-if="index < fields.length" @click="removeField(index)">
          <Icon icon="bi:trash"/>
        </Button>
      </div>
    </div>
  </div>
</template>
