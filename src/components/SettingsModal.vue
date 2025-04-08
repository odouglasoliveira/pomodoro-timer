<template>
  <section
    class="bg-white text-black rounded-xl mx-auto w-[300px] h-[600px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
  >
    <button class="absolute right-4 top-4" @click="toggleModal">
      <img width="20" :src="closeModalIcon" alt="Fechar modal" />
    </button>
    <div class="flex flex-col h-full w-full justify-center gap-4">
      <div class="flex justify-between px-4 items-baseline">
        <p>Notificação</p>
        <div class="btn-status">
          <input
            v-model="enableNotification"
            :checked="enableNotification"
            @change="toggleNotification"
            type="checkbox"
            name="checkbox"
            id="checkbox"
            class="hidden"
          />
          <label
            for="checkbox"
            class="btn-change flex items-center p-1 rounded-lg w-12 h-6 cursor-pointer"
          ></label>
        </div>
      </div>
      <div class="flex justify-between px-4 items-baseline">
        <p>Tempo de Foco (min)</p>
        <input
          type="number"
          v-model="focusTimeInput"
          @change="updateTimes"
          min="1"
          max="60"
          class="w-16 p-1 border rounded-md bg-zinc-200"
        />
      </div>
      <div class="flex justify-between px-4 items-baseline">
        <p>Tempo de Descanso (min)</p>
        <input
          type="number"
          v-model="restTimeInput"
          @change="updateTimes"
          min="1"
          max="30"
          class="w-16 p-1 border rounded-md bg-zinc-200 focus:"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import closeModalIcon from "/close-svgrepo-com.svg";
import { useTimerStore } from "../store";
const store = useTimerStore();

const focusTimeInput = ref(store.focusTime);
const restTimeInput = ref(store.restTime);

const updateTimes = () => {
  store.updateTimes(focusTimeInput.value, restTimeInput.value);
};

defineProps({
  toggleModal: Function,
});

const enableNotification = ref(store.enableNotification);

const updateButtonStyle = () => {
  const btn = document.querySelector(".btn-change");
  if (!enableNotification.value) {
    btn.style.setProperty("--bg-btn", "#fed7d7");
    btn.style.setProperty("--btn-color", "#e53e3e");
  } else {
    btn.style.setProperty("--bg-btn", "#C6F6D5");
    btn.style.setProperty("--btn-color", "#38A169");
  }
};

const toggleNotification = async () => {
  if (enableNotification.value && Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      enableNotification.value = false;
      updateButtonStyle();
      return;
    }
  }

  store.toggleNotification(enableNotification.value);
  updateButtonStyle();
};

onMounted(() => {
  updateButtonStyle();
});
</script>

<style scoped>
#checkbox:checked ~ .btn-change::before {
  transition: 0.3s;
  transform: translateX(23px);
}

input:focus {
  outline: none;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.btn-change {
  background-color: var(--bg-btn);
}

.btn-change::before {
  content: "";
  display: block;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background-color: var(--btn-color);
  transition: 0.3s;
  transform: translateX(0);
}
</style>
