<template>
  <p class="text-8xl font-bold mb-6 text-white">
    {{ formattedTime }}
  </p>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  seconds: {
    type: Number,
    required: true,
  },
});

const formattedTime = computed(() => {
  const timeValue = isNaN(props.seconds) ? 0 : props.seconds;
  const minutes = Math.floor(timeValue / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeValue % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
});
</script>
