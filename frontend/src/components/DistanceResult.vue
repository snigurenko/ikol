<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DistanceResult } from '../types'

const props = defineProps<{
  result: DistanceResult
}>()

const { t, locale } = useI18n()

const formattedMeters = computed(() =>
  new Intl.NumberFormat(locale.value === 'pl' ? 'pl-PL' : 'en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(props.result.meters)
)

const formattedKilometers = computed(() =>
  new Intl.NumberFormat(locale.value === 'pl' ? 'pl-PL' : 'en-US', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 4,
  }).format(props.result.kilometers)
)
</script>

<template>
  <section class="result" aria-live="polite" :aria-label="t('result.title')">
    <div class="result__header">
      <svg class="result__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
      </svg>
      <h2 class="result__title">{{ t('result.title') }}</h2>
    </div>

    <div class="result__cards">
      <div class="result__card result__card--primary">
        <span class="result__value">{{ formattedMeters }}</span>
        <span class="result__unit">{{ t('result.meters') }}</span>
      </div>
      <div class="result__divider" aria-hidden="true">=</div>
      <div class="result__card result__card--secondary">
        <span class="result__value">{{ formattedKilometers }}</span>
        <span class="result__unit">{{ t('result.kilometers') }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.result {
  animation: slideIn .3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.result__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.result__icon {
  width: 22px;
  height: 22px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.result__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
}

.result__cards {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.result__card {
  flex: 1;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  border-radius: var(--radius-md);
  gap: 4px;
}

.result__card--primary {
  background: linear-gradient(135deg, #6366f1, #818cf8);
  color: #fff;
}

.result__card--secondary {
  background: linear-gradient(135deg, #0891b2, #06b6d4);
  color: #fff;
}

.result__value {
  font-size: 1.625rem;
  font-weight: 800;
  letter-spacing: -.02em;
  line-height: 1.1;
}

.result__unit {
  font-size: .8125rem;
  font-weight: 500;
  opacity: .85;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.result__divider {
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--color-text-muted);
  flex-shrink: 0;
}
</style>
