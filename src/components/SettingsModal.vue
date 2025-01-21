<template>
  <section
    class="bg-white text-black rounded-xl mx-auto w-[300px] h-[600px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <button class="absolute right-4 top-4" @click="toggleModal">
      <img width="20" :src="closeModalIcon" alt="Fechar modal" />
    </button>
    <div class="flex h-full w-full justify-around items-center">
      <p>Som de fundo</p>
      <div class="btn-status">
        <input
          v-model="enableBackgroundSound"
          :checked="enableBackgroundSound"
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
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import closeModalIcon from "/close-svgrepo-com.svg";

defineProps({
  toggleModal: Function,
});

const enableBackgroundSound = ref(true);

onMounted(() => {
  const btn = document.querySelector(".btn-change");
  if (!enableBackgroundSound.value) {
    btn.style.setProperty("--bg-btn", "#fed7d7");
    btn.style.setProperty("--btn-color", "#e53e3e");
  } else {
    btn.style.setProperty("--bg-btn", "#C6F6D5");
    btn.style.setProperty("--btn-color", "#38A169");
  }
  btn.addEventListener("click", () => {
    if (enableBackgroundSound.value) {
      btn.style.setProperty("--bg-btn", "#fed7d7");
      btn.style.setProperty("--btn-color", "#e53e3e");
    } else {
      btn.style.setProperty("--bg-btn", "#C6F6D5");
      btn.style.setProperty("--btn-color", "#38A169");
    }
  });
});
</script>

<style scoped>
#checkbox:checked ~ .btn-change::before {
  transition: 0.3s;
  transform: translateX(23px);
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
