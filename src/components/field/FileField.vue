<script setup lang="ts">
    import { ref } from "vue";
    import { getFileEventAsHex } from '@/composables';
    import { Label } from '@/components/ui/label';
    import { Input } from '@/components/ui/input';

    const props = defineProps<{
        id: string;
        label: string;
        value: string;
        config: any;
        onChange: (key: string, value: string) => void;
    }>();

    const config = ref<any>({
        ...props.config,
    });

    const handleChanges = async (event: Event) => {
        const hex = await getFileEventAsHex(event);
        if (!hex) return;
        props.onChange(props.id, hex);
    };
</script>

<template>
    <div class="form-field">
        <Label class="field-label" :for="id">{{ label }}</Label>
        <Input class="field-input" type="file" v-bind="config" :id="id" @change="handleChanges($event)"/>
    </div>
</template>

