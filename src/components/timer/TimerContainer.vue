<template>
  <div
    class="flex font-sans flex-col rounded-xl items-center place-self-center justify-center max-w-min p-32 my-40 bg-gray-100 bg-opacity-5"
  >
    <TimerHeader :mode="currentMode" />
    <TimerDisplay :seconds="time" />
    <TimerControls
      :isRunning="isRunning"
      @toggle="toggleTimer"
      @switch-mode="switchMode"
    />
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, onMounted, computed } from "vue";
import { useTimerStore, useThemeStore } from "../../store";
import TimerHeader from "./TimerHeader.vue";
import TimerDisplay from "./TimerDisplay.vue";
import TimerControls from "./TimerControls.vue";
import NotificationService from "../../services/NotificationService";
import bell from "../../audio/bell.mp3";

const store = useTimerStore();
const themeStore = useThemeStore();
const notificationService = new NotificationService();
const notificationsEnabled = computed(() => store.enableNotification);

const currentMode = ref(store.currentMode);
const time = ref(
  parseInt(localStorage.getItem("currentTime")) ||
    (currentMode.value === "focus"
      ? store.getTimeInSeconds(store.focusTime)
      : store.getTimeInSeconds(store.restTime))
);
const isRunning = ref(false);
const endAudio = new Audio(bell);
let interval = null;

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

  if (notificationService.permission === "default") {
    notificationService.setup();
  }

  interval = setInterval(() => {
    if (time.value > 0) {
      time.value -= 1;
    } else {
      if (currentMode.value === "focus") {
        store.incrementSession();
      }
      endAudio.volume = 0.2;
      endAudio.play();

      // Enviar notificação
      if (notificationsEnabled.value) {
        const title =
          currentMode.value === "focus"
            ? "Tempo de foco finalizado!"
            : "Tempo de descanso finalizado!";
        const body =
          currentMode.value === "focus"
            ? "Hora de fazer uma pausa! 😌"
            : "Hora de voltar ao foco! 💪";
        notificationService.send(title, body);
      }

      switchMode();
    }
  }, 1000);
};

const stopTimer = () => {
  isRunning.value = false;
  updateBackgroundColor();
  clearInterval(interval);
};

const updateTitle = () => {
  const minutes = Math.floor(time.value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time.value % 60).toString().padStart(2, "0");
  const formattedTime = `${minutes}:${seconds}`;

  const labelMode = currentMode.value === "focus" ? "Foco" : "Descanse";
  document.title = `${formattedTime} - ${labelMode}`;
};

const switchMode = () => {
  currentMode.value = currentMode.value === "focus" ? "rest" : "focus";
  store.setCurrentMode(currentMode.value);

  time.value =
    currentMode.value === "focus"
      ? store.getTimeInSeconds(store.focusTime)
      : store.getTimeInSeconds(store.restTime);

  localStorage.setItem("currentTime", time.value.toString());
  stopTimer();
};

const updateBackgroundColor = () => {
  if (currentMode.value === "rest") {
    themeStore.updateBackgroundColor("#055864");
  } else {
    if (isRunning.value) {
      themeStore.updateBackgroundColor("#2222");
    } else {
      themeStore.updateBackgroundColor("#ad4043");
    }
  }
};

// Watchers e lifecycle hooks
watch(time, (newValue) => {
  updateTitle();
  localStorage.setItem("currentTime", newValue.toString());
});

watch(
  () => store.currentMode,
  (newMode) => {
    currentMode.value = newMode;
  }
);

watch(notificationsEnabled, (newValue) => {
  localStorage.setItem("notificationsEnabled", newValue);
});

onBeforeUnmount(() => {
  clearInterval(interval);
});

onMounted(() => {
  if (isNaN(time.value)) {
    time.value =
      currentMode.value === "focus"
        ? store.getTimeInSeconds(store.focusTime)
        : store.getTimeInSeconds(store.restTime);
  }
  notificationService.setup();
  updateBackgroundColor();
});
</script>
