<script setup lang="ts">
    import { ref } from "vue";
    import { Label } from '@/components/ui/label';
    import {
        Select,
        SelectContent,
        SelectGroup,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from '@/components/ui/select'

    const props = defineProps<{
        id: string;
        label: string;
        value?: string;
        config: any;
        onChange: (key: string, value: any) => void;
    }>();

    const value = ref(props.value || '');
</script>

<template>
    <div class="form-field">
        <Label class="field-label" :for="id">{{ label }}</Label>
        <Select :id="id" v-model:model-value="value" @update:model-value="onChange(id, $event)">
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <template v-for="([optionKey, optionValue]) in Object.entries(config.options)" :key="optionKey">
                        <SelectItem :value="optionKey">{{ optionValue }}</SelectItem>
                    </template>
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
</template>
