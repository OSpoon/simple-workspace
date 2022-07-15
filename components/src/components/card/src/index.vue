<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "it-card",
});
</script>
<script setup lang="ts">
const props = defineProps({
  shadow: {
    type: String,
    default: "always",
  },
  bodyStyle: {
    type: Object,
    default: () => {
      return { padding: "20px" };
    },
  },
});
console.log("[ props ] >", props);
</script>

<template>
  <div class="it-card">
    <div :class="`is-${shadow}-shadow`"></div>
    <div class="it-card__body" :style="bodyStyle">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
