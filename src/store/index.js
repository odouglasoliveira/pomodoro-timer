import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimerStore = defineStore("timer", () => {
  const sessionsInFocus = ref(0);
  function incrementSession() {
    sessionsInFocus.value++;
  }

  return { sessionsInFocus, incrementSession };
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
