<script setup>
import { onMounted } from "vue";
import { inject } from "@vercel/analytics";
import TimerComponent from "./components/TimerComponent.vue";

onMounted(() => {
  inject();
});
</script>

<template>
  <h1 class="font-bold">Cronômetro Pomodoro</h1>
  <TimerComponent />
</template>

<style scoped></style>
