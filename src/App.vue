<script setup>
import { onMounted, ref } from "vue";
import { inject } from "@vercel/analytics";
import SettingsModal from "./components/SettingsModal.vue";
import TimerContainer from "./components/timer/TimerContainer.vue";

const isSettingsOpen = ref(false);

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value;
};

onMounted(() => {
  inject();
});
</script>

<template>
  <h1 class="font-bold">Pomodoro Timer</h1>
  <button @click="toggleSettings" class="settings-button">
    <img class="w-6" src="/settings-svgrepo-com.svg" alt="Configurações" />
  </button>
  <SettingsModal v-if="isSettingsOpen" :toggleModal="toggleSettings" />
  <TimerContainer />
</template>

<style scoped>
.settings-button {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
}
</style>
