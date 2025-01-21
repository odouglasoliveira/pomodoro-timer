<template>
  <div
    class="flex font-sans flex-col rounded-xl items-center place-self-center justify-center max-w-min p-32 my-40 bg-gray-100 bg-opacity-5"
  >
    <h1 class="text-3xl font-bold mb-4 text-white">
      {{ currentMode === "focus" ? "Foco" : "Descanse" }}
    </h1>
    <p class="text-8xl font-bold mb-6 text-white">
      {{ formattedTime }}
    </p>
    <div class="flex w-full justify-around items-center">
      <button @click="toggleTimer" class="w-2/3 start-button">
        {{ isRunning ? "Parar" : "Começar" }}
      </button>
      <button @click="switchMode">
        <img class="w-10 skip-button" :src="skip" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount, onMounted } from "vue";
import { useTimerStore, useThemeStore } from "../store";

import skip from "/skip-svgrepo-com.svg";
import rainSound from "../audio/rain-sound.mp3";
import bell from "../audio/bell.mp3";

const store = useTimerStore();
const themeStore = useThemeStore();
const time = ref(25 * 60);
const isRunning = ref(false);
const currentMode = ref("focus");
const overlapTime = 0.05;
const endAudio = new Audio(bell);
let audioContext = null;
let audioBuffer = null;
let nextStartTime = 0;
let interval = null;

const loadAudio = async () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  const response = await fetch(rainSound);
  const arrayBuffer = await response.arrayBuffer();
  audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
};

const startAudio = () => {
  if (currentMode.value !== "rest") {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    nextStartTime = audioContext.currentTime;

    const scheduleNext = () => {
      if (!isRunning.value) return;

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      source.start(nextStartTime);
      nextStartTime += audioBuffer.duration - overlapTime;

      setTimeout(scheduleNext, (audioBuffer.duration - overlapTime) * 1000);
    };

    scheduleNext();
  }
};

const stopAudio = () => {
  if (audioContext) {
    audioContext.suspend();
    audioContext = null;
  }
};

const formattedTime = computed(() => {
  const minutes = Math.floor(time.value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time.value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
});

const toggleTimer = () => {
  if (isRunning.value) {
    stopTimer();
  } else {
    startTimer();
  }
};

const startTimer = () => {
  isRunning.value = true;
  updateBackgroundColor();
  startAudio();
  interval = setInterval(() => {
    if (time.value > 0) {
      time.value -= 1;
    } else {
      if (currentMode.value === "focus") {
        store.incrementSession();
      }
      endAudio.volume = 0.2;
      endAudio.play();
      switchMode();
    }
  }, 1000);
};

const stopTimer = () => {
  isRunning.value = false;
  updateBackgroundColor();
  clearInterval(interval);
  stopAudio();
};

const updateTitle = () => {
  const labelMode = currentMode.value === "focus" ? "Foco" : "Descanse";
  document.title = `${formattedTime.value} - ${labelMode}`;
};

const switchMode = () => {
  currentMode.value = currentMode.value === "focus" ? "rest" : "focus";
  time.value =
    currentMode.value === "focus"
      ? store.getTimeInSeconds(25)
      : store.getTimeInSeconds(5);
  stopTimer();
};

const updateBackgroundColor = () => {
  if (currentMode.value === "rest") {
    themeStore.updateBackgroundColor("#055864");
  } else {
    if (isRunning.value) {
      themeStore.updateBackgroundColor("#222222");
    } else {
      themeStore.updateBackgroundColor("#ad4043");
    }
  }
};

watch(time, updateTitle);

onBeforeUnmount(() => {
  clearInterval(interval);
  stopAudio();
});

onMounted(() => {
  loadAudio();
});
</script>

<style scoped>
.start-button {
  align-items: center;
  appearance: none;
  background-color: #fcfcfd;
  border-radius: 4px;
  border-width: 0;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #d6d6e7 0 -3px 0 inset;
  box-sizing: border-box;
  color: #36395a;
  cursor: pointer;
  display: inline-flex;
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
  transition: box-shadow 0.15s, transform 0.15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow, transform;
  font-size: 18px;
}

.start-button:focus {
  box-shadow: #d6d6e7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #d6d6e7 0 -3px 0 inset;
}

.start-button:hover {
  box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #d6d6e7 0 -3px 0 inset;
  transform: translateY(-2px);
}

.start-button:active {
  box-shadow: #d6d6e7 0 3px 7px inset;
  transform: translateY(2px);
}

.skip-button:hover {
  transform: translateY(-2px);
}

.skip-button:active {
  transform: translateY(2px);
}
</style>
