<script lang="ts" setup>
interface ITableFooterPaginationProps {
  paginationData: string;
  totalPages: number;
  isVisible: boolean;
  currentPage: number;
}
interface ITableFooterPaginationEmits {
  (e: "update:currentPage", v: number): void;
}
const props = defineProps<ITableFooterPaginationProps>();
const emit = defineEmits<ITableFooterPaginationEmits>();

const updateCurrentPage = (v: number) => {
  emit("update:currentPage", v);
};
</script>

<template>
  <VDivider />

  <VCardText class="d-flex flex-wrap justify-end gap-4 pa-2">
    <div class="d-flex align-center" v-if="props.isVisible">
      <h6 class="text-sm font-weight-regular">
        {{ props.paginationData }}
      </h6>
    </div>
    <VPagination
      v-if="props.isVisible"
      :model-value="props.currentPage"
      @update:model-value="updateCurrentPage"
      :length="props.totalPages"
    />
  </VCardText>
</template>

<style lang="scss"></style>
