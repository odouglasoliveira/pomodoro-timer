<script setup>
import { onMounted } from "vue";
import { inject } from "@vercel/analytics";
import TimerComponent from "./components/TimerComponent.vue";

onMounted(() => {
  inject();
});
</script>

<template>
  <h1 class="font-bold">Pomodoro Timer</h1>
  <TimerComponent />
</template>

<style scoped>
.settings-button {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
}
</style>
