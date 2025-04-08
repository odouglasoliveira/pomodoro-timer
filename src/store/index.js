import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimerStore = defineStore("timer", () => {
  const sessionsInFocus = ref(0);
  const focusTime = ref(25);
  const restTime = ref(5);
  // Inicializa com o valor do localStorage
  const enableNotification = ref(
    localStorage.getItem("notificationsEnabled") === "true"
  );

  const incrementSession = () => sessionsInFocus.value++;
  const getTimeInSeconds = (minutes) => minutes * 60;

  const updateTimes = (newFocusTime, newRestTime) => {
    focusTime.value = newFocusTime;
    restTime.value = newRestTime;
  };

  const toggleNotification = (value) => {
    enableNotification.value = value;
    // Salva no localStorage quando alterado
    localStorage.setItem("notificationsEnabled", value);
  };

  return {
    enableNotification,
    toggleNotification,
    sessionsInFocus,
    focusTime,
    restTime,
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
