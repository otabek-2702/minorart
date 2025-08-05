<script lang="ts" setup>
interface EditIconProps {
  id: number;
  size?: number;
  color?: string;
}

interface EditIconEmits {
  (e: "update:updateId", val: number): void;
}

const props = withDefaults(defineProps<EditIconProps>(), {
  size: 30,
  color: "primary",
});

const emit = defineEmits<EditIconEmits>();

const openEditDrawer = () => {
  emit("update:updateId", props.id);
};
</script>

<template>
  <VIcon
    @click.stop="openEditDrawer"
    :size="size"
    icon="bx-edit-alt"
    :color="color"
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
