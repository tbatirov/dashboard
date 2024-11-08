<script setup lang="ts">
    import { ref } from "vue";
    import { Label } from '@/components/ui/label';
    import {
        NumberField,
        NumberFieldContent,
        NumberFieldDecrement,
        NumberFieldIncrement,
        NumberFieldInput,
    } from '@/components/ui/number-field';

    const props = defineProps<{
        id: string;
        label: string;
        value?: number;
        config: any;
        onChange: (key: string, value: any) => void;
    }>();

    const value = ref(props.value || 0);
    const config = ref<any>({
        ...props.config,
    });
</script>

<template>
    <div class="form-field">
        <Label class="field-label" :for="id">{{ label }}</Label>
        <NumberField class="field-input" v-bind="config" :id="id" v-model:model-value="value" @update:model-value="onChange(id, $event)">
            <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
            </NumberFieldContent>
        </NumberField>
    </div>
</template>
