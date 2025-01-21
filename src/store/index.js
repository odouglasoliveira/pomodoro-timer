import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimerStore = defineStore("timer", () => {
  const sessionsInFocus = ref(0);
  function incrementSession() {
    sessionsInFocus.value++;
  }

  return { sessionsInFocus, incrementSession };
});
