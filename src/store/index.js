import { defineStore } from "pinia";;
import { ref, computed } from 'vue'

export const useTimerStore = defineStore('timer', () => {

  const sessionInFocus = ref(0)
  function incrementSession() {
    sessionInFocus.value++
  }

  return { sessionInFocus, incrementSession }
})