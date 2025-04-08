<template>
  <h1 class="text-3xl font-bold mb-4 text-white">
    {{ mode === "focus" ? "Foco" : "Descanse" }}
  </h1>
</template>

<script setup>
defineProps({
  mode: {
    type: String,
    required: true,
  },
});
</script>
