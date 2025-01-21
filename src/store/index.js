import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimerStore = defineStore("timer", () => {
  const sessionsInFocus = ref(0);
  const incrementSession = () => sessionsInFocus.value++;
  const getTimeInSeconds = (minutes) => minutes * 60;

  return { sessionsInFocus, incrementSession, getTimeInSeconds };
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
