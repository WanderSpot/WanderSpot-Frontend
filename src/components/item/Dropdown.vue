<template>
  <div class="relative flex justify-end text-lg w-96 mr-3">
    <button
      class="flex items-center b-10 bg-white w-10 h-10  rounded-full justify-center"
      @click="toggleOptions"
      @blur="closeOptions"
    >
      <img src="@/assets/icon/bell-solid.svg" class="w-5 h-5" />
      <!-- <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="h-4 w-4 transform transition-transform duration-200 ease-in-out"
        :class="isOptionsExpanded ? 'rotate-180' : 'rotate-0'"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg> -->
    </button>
    <transition
      enter-active-class="transform transition duration-500 ease-custom"
      enter-class="-translate-y-1/2 scale-y-0 opacity-0"
      enter-to-class="translate-y-0 scale-y-100 opacity-100"
      leave-active-class="transform transition duration-300 ease-custom"
      leave-class="translate-y-0 scale-y-100 opacity-100"
      leave-to-class="-translate-y-1/2 scale-y-0 opacity-0"
    >
      <ul
        v-show="isOptionsExpanded"
        class="absolute h-48 right-0 mt-10 mb-4 bg-white divide-y rounded-lg shadow-lg overflow-y-auto"
      >
        <li
          v-for="(option, index) in props.selectedOption"
          :key="index"
          class="px-3 py-2 transition-colors duration-300 hover:bg-gray-200"
          @mousedown.prevent="setOption(option)"
        >
          {{ option.message }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue'

const isOptionsExpanded = ref(false)
const optionArr = ref([])
const options = ref([])

const props = defineProps({
  selectedOption: {
    type: String,
    required: true,
  },
})

const toggleOptions = () => {
  isOptionsExpanded.value = !isOptionsExpanded.value
}

const closeOptions = () => {
  isOptionsExpanded.value = false
}

const setOption = (option) => {
  optionArr.value = option
  isOptionsExpanded.value = false
}

watch(props.selectedOption, (newVal) => {
  optionArr.value = newVal
})
</script>

<style>
.ease-custom {
  transition-timing-function: cubic-bezier(0.61, -0.53, 0.43, 1.43);
}
</style>
