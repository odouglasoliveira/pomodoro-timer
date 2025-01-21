import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimerStore = defineStore("timer", () => {
  const sessionInFocus = ref(0);
  function incrementSession() {
    sessionInFocus.value++;
  }
  const currentMode = ref("focus");

  return { sessionInFocus, incrementSession, currentMode };
});
