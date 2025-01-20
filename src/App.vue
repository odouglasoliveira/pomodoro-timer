<script setup>
import { onMounted } from 'vue';
import Timer from './components/Timer.vue'
import { inject } from "@vercel/analytics"

onMounted(() => {
  inject();
})
</script>

<template>
  <h1>Cronômetro Pomodoro</h1>
  <Timer />
</template>

<style scoped>
</style>
