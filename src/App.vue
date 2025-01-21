<script setup>
import { onMounted, ref } from "vue";
import { inject } from "@vercel/analytics";
import TimerComponent from "./components/TimerComponent.vue";
import SettingsModal from "./components/SettingsModal.vue";
import settingsIcon from "/settings-svgrepo-com.svg";

const showSettingsModal = ref(false);
const toggleSettingsModal = () =>
  (showSettingsModal.value = !showSettingsModal.value);

onMounted(() => {
  inject();
});
</script>

<template>
  <h1 class="font-bold">Cronômetro Pomodoro</h1>
  <button @click="toggleSettingsModal">
    <img
      width="40"
      :src="settingsIcon"
      class="settings-button"
      title="Configurações"
      alt="Configurações"
    />
  </button>
  <TimerComponent />
  <SettingsModal :toggle-modal="toggleSettingsModal" v-if="showSettingsModal" />
</template>

<style scoped>
.settings-button {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
}
</style>
