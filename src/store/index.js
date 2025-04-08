import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimerStore = defineStore("timer", () => {
  const sessionsInFocus = ref(0);
  const focusTime = ref(parseInt(localStorage.getItem("focusTime")) || 25);
  const restTime = ref(parseInt(localStorage.getItem("restTime")) || 5);
  const currentMode = ref(localStorage.getItem("currentMode") || "focus");
  const enableNotification = ref(
    localStorage.getItem("notificationsEnabled") === "true"
  );

  const incrementSession = () => sessionsInFocus.value++;
  const getTimeInSeconds = (minutes) => minutes * 60;

  const updateTimes = (newFocusTime, newRestTime) => {
    focusTime.value = newFocusTime;
    restTime.value = newRestTime;
    localStorage.setItem("focusTime", newFocusTime);
    localStorage.setItem("restTime", newRestTime);
  };

  const toggleNotification = (value) => {
    enableNotification.value = value;
    localStorage.setItem("notificationsEnabled", value);
  };

  const setCurrentMode = (mode) => {
    currentMode.value = mode;
    localStorage.setItem("currentMode", mode);
  };

  return {
    enableNotification,
    toggleNotification,
    sessionsInFocus,
    focusTime,
    restTime,
    currentMode,
    setCurrentMode,
    incrementSession,
    getTimeInSeconds,
    updateTimes,
  };
});

export const useThemeStore = defineStore("theme", {
  state: () => ({
    theme: {
      backgroundColor: "#ad4043",
    },
  }),
  actions: {
    updateBackgroundColor(color) {
      this.theme.backgroundColor = color;
      this.applyBackgroundColor();
    },
    applyBackgroundColor() {
      const root = document.documentElement;
      root.style.setProperty("transition", "400ms");
      root.style.setProperty("--background-color", this.theme.backgroundColor);
    },
  },
});
