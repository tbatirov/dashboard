<script setup lang="ts">
    import type { DashletSettings, TableData } from '@/types';
    import {
      ScrollArea,
      ScrollBar,
    } from '@/components/ui/scroll-area';
    import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
    } from '@/components/ui/table'

    const props = defineProps<{
      settings: DashletSettings;
      chartData: TableData;
    }>();
</script>

<template>
  <ScrollArea className="table-scroll">
    <Table class="overflow-auto">
      <TableHeader class="table-header">
        <template v-for="(header, index) in props.chartData.headers" :key="index">
          <TableHead class="table-head">{{ header }}</TableHead>
        </template>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(item, index) in props.chartData.data" :key="index">
          <TableCell class="table-head" v-for="(value, key) in item" :key="key">{{ value }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</template>
