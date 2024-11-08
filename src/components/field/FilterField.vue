<script setup lang="ts">
  import { ref } from "vue";
  import type { Filter } from '@/types';
  import { Icon } from '@iconify/vue';
  import { Label } from "@/components/ui/label";
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { getEventValue } from '@/composables';

  const props = defineProps<{
    id: string;
    label: string;
    value?: Filter[];
    config: {
      options: {
        dataset: Record<string, string>;
        operations: Record<string, string>;
      };
    };
    onChange: (key: string, value: any) => void;
  }>();
  const getDefaultField = (): Filter => ({ column: '', operator: 'equal', value: '', type: 'local' });
  const fields = ref<Filter[]>(props.value || []);

  const updateField = (index: number, key: 'column' | 'operator' | 'value', value: string) => {
    if (index === fields.value.length) fields.value[index] = getDefaultField();
    fields.value[index][key] = value;
    props.onChange(props.id, [...fields.value]);
  };

  const removeField = (index: number) => {
    fields.value.splice(index, 1);
    props.onChange(props.id, [...fields.value]);
  };
</script>

<template>
  <div class="form-field">
    <Label class="field-label" :for="props.id">{{ props.label }}</Label>
    <div class="filter-fields">
      <div v-for="(field, index) in [...fields, getDefaultField()]" :key="index" class="filter-field">
        <div class="filter-grid">
        <Select v-model:model-value="field.column" @update:model-value="(value) => updateField(index, 'column', value)">
            <SelectTrigger class="truncate">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="([optionKey, optionValue]) in Object.entries(props.config.options.dataset)" :key="optionKey" :value="optionKey">
                  {{ optionValue }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select v-model:model-value="field.operator" @update:model-value="(value) => updateField(index, 'operator', value)">
            <SelectTrigger hideArrow class="operator-trigger">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="([optionKey, optionValue]) in Object.entries(props.config.options.operations)" :key="optionKey" :value="optionKey">
                  {{ optionValue }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input class="filter-input" type="text" v-model="field.value" @onchange="updateField(index, 'value', getEventValue($event))"/>
        </div>

        <Button class="filter-delete-btn" variant="outline" @click="removeField(index)" v-if="index < fields.length">
          <Icon icon="bi:trash" />
        </Button>
      </div>
    </div>
  </div>
</template>