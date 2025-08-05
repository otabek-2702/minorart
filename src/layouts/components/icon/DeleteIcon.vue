<script lang="ts" setup>
interface EditIconProps {
  id: number;
  title: string;
  size?: number;
  color?: string;
}

interface EditIconEmits {
  (e: "update:deleteData", val: { id: number; title: string }): void;
}

const props = withDefaults(defineProps<EditIconProps>(), {
  size: 30,
  color: "red",
});

const emit = defineEmits<EditIconEmits>();

const openDeleteDialog = () => {
  emit("update:deleteData", { id: props.id, title: props.title });
};
</script>

<template>
  <VIcon
    size="30"
    icon="bx-trash"
    @click.stop="openDeleteDialog"
    color="error"
  ></VIcon>
</template>

<style lang="scss" scoped>
.v-icon {
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
}
</style>
