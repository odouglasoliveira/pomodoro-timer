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
        <img
          class="w-10 skip-button"
          :src="skip"
          title="Pular sessão"
          alt="Pular sessão"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount, onMounted } from "vue";
import { useTimerStore, useThemeStore } from "../store";

import skip from "/skip-svgrepo-com.svg";
import bell from "../audio/bell.mp3";

const notificationPermission = ref("default");
const notificationsEnabled = computed(() => store.enableNotification);
const store = useTimerStore();
const themeStore = useThemeStore();
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

const setupNotifications = async () => {
  try {
    if (!("Notification" in window)) {
      console.log("Este navegador não suporta notificações");
      return;
    }

    const permission = await Notification.requestPermission();
    notificationPermission.value = permission;
  } catch (error) {
    console.error("Erro ao configurar notificações:", error);
  }
};

const sendNotification = () => {
  if (notificationPermission.value === "granted" && store.enableNotification) {
    const title =
      currentMode.value === "focus"
        ? "Tempo de foco finalizado!"
        : "Tempo de descanso finalizado!";

    const body =
      currentMode.value === "focus"
        ? "Hora de fazer uma pausa! 😌"
        : "Hora de voltar ao foco! 💪";

    const notification = new Notification(title, {
      body: body,
      icon: "/timer-svgrepo-com.svg",
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
    };
  }
};

const formattedTime = computed(() => {
  const timeValue = isNaN(time.value) ? 0 : time.value;

  const minutes = Math.floor(timeValue / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeValue % 60).toString().padStart(2, "0");
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
  if (notificationPermission.value === "default") {
    setupNotifications();
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
      sendNotification();
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
  const labelMode = currentMode.value === "focus" ? "Foco" : "Descanse";
  document.title = `${formattedTime.value} - ${labelMode}`;
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
      themeStore.updateBackgroundColor("#222222");
    } else {
      themeStore.updateBackgroundColor("#ad4043");
    }
  }
};

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
  setupNotifications();
  updateBackgroundColor();
});

watch(notificationsEnabled, (newValue) => {
  localStorage.setItem("notificationsEnabled", newValue);
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
</style>
