<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'

import skip from '/skip-svgrepo-com.svg'

const time = ref(25 * 60);
const isRunning = ref(false);
const currentMode = ref('pomodoro');

let interval = null;

const formattedTime = computed(() => {
  const minutes = Math.floor(time.value / 60).toString().padStart(2, '0');
  const seconds = (time.value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`
})

const toggleTimer = () => {
  if (isRunning.value) {
    stopTimer();
  } else {
    startTimer();
  }
}

const startTimer = () => {
  isRunning.value = true;
  interval = setInterval(() => {
    if (time.value > 0) {
      time.value -= 1;
    } else {
      switchMode();
    }
  }, 1000)
}

const stopTimer = () => {
  isRunning.value = false;
  clearInterval(interval)
}

const updateTitle = () => {
  const labelMode = currentMode.value === 'pomodoro' ? 'Foco' : 'Descanse';
  document.title = `${formattedTime.value} - ${labelMode}`
}

const switchMode = () => {
  currentMode.value = currentMode.value === 'pomodoro' ? 'descanso' : 'pomodoro';
  time.value = currentMode.value === 'pomodoro' ? 25 * 60 : 5 * 60;
  stopTimer();
}

watch(time, updateTitle)

onBeforeUnmount(() => {
  clearInterval(interval);
})
</script>

<template>
  <div class="flex flex-col rounded-xl items-center place-self-center justify-center max-w-min p-32 my-40 bg-gray-100 bg-opacity-5">
    <h1 class="text-3xl font-bold mb-4 text-white">
      {{ currentMode === 'pomodoro' ? 'Foco' : 'Descanse' }}
    </h1>
    <p class="text-6xl font-mono mb-6 text-white">
      {{ formattedTime }}
    </p>
    <div class="flex w-full justify-around items-center">
      <button @click="toggleTimer" class="w-2/3 button-30 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
      {{ isRunning ? 'Parar' : 'Começar' }}
      </button>
      <button @click="switchMode">
        <img class="w-10" :src="skip">
      </button>
    </div>
  </div>
</template>

<style scoped>
.button-30 {
  align-items: center;
  appearance: none;
  background-color: #FCFCFD;
  border-radius: 4px;
  border-width: 0;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset;
  box-sizing: border-box;
  color: #36395A;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono",monospace;
  height: 48px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow .15s,transform .15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow,transform;
  font-size: 18px;
}

.button-30:focus {
  box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
}

.button-30:hover {
  box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
  transform: translateY(-2px);
}

.button-30:active {
  box-shadow: #D6D6E7 0 3px 7px inset;
  transform: translateY(2px);
}
</style>
