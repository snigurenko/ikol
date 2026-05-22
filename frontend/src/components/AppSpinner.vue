<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<template>
  <span class="spinner" role="status" aria-label="Ładowanie…">
    <svg
      :width="size ?? 20"
      :height="size ?? 20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-dasharray="31.4"
        stroke-dashoffset="10"
        class="spinner__arc"
      />
    </svg>
  </span>
</template>

<style scoped>
.spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.spinner__arc {
  animation: spin 0.75s linear infinite;
  transform-origin: center;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
