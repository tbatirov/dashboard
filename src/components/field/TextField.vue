<script setup lang="ts">
    import { ref } from "vue";
    import { getEventValue } from '@/composables';
    import { Label } from '@/components/ui/label';
    import { Input } from '@/components/ui/input';

    const props = defineProps<{
        id: string;
        label: string;
        value?: string;
        config: any;
        onChange: (key: string, value: string) => void;
    }>();

    const value = ref(props.value || '');
    const config = ref<any>({
        ...props.config,
    });
</script>

<template>
    <div class="form-field">
        <Label class="field-label" :for="id">{{ label }}</Label>
        <Input class="field-input" type="text" v-model="value" v-bind="config" :id="id" @change="onChange(id, getEventValue($event))"/>
    </div>
</template>
