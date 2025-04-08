import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimerStore = defineStore("timer", () => {
  const sessionsInFocus = ref(0);
  const focusTime = ref(25);
  const restTime = ref(5);
  const enableBackgroundSound = ref(false);

  const incrementSession = () => sessionsInFocus.value++;

  const getTimeInSeconds = (minutes) => minutes * 60;

  const updateTimes = (newFocusTime, newRestTime) => {
    focusTime.value = newFocusTime;
    restTime.value = newRestTime;
  };
  const toggleBackgroundSound = (value) => {
    enableBackgroundSound.value = value;
  };

  return {
    enableBackgroundSound,
    toggleBackgroundSound,
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
