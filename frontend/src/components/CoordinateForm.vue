<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PointInput from './PointInput.vue'
import AppSpinner from './AppSpinner.vue'
import type { Coordinates } from '../types'

const { t } = useI18n()

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  submit: [point1: Coordinates, point2: Coordinates]
  reset: []
}>()

const point1 = ref<Coordinates>({ lat: '', lon: '' })
const point2 = ref<Coordinates>({ lat: '', lon: '' })

function isPointValid(p: Coordinates): boolean {
  const lat = parseFloat(p.lat)
  const lon = parseFloat(p.lon)
  return (
    p.lat !== '' && p.lon !== '' &&
    !isNaN(lat) && lat >= -90 && lat <= 90 &&
    !isNaN(lon) && lon >= -180 && lon <= 180
  )
}

const canSubmit = computed(
  () => !props.loading && isPointValid(point1.value) && isPointValid(point2.value)
)

function handleSubmit() {
  if (!canSubmit.value) return
  emit('submit', { ...point1.value }, { ...point2.value })
}

function handleReset() {
  point1.value = { lat: '', lon: '' }
  point2.value = { lat: '', lon: '' }
  emit('reset')
}

const PRESET_EXAMPLES = [
  { key: 'warsawKrakow', p1: { lat: '52.2297', lon: '21.0122' }, p2: { lat: '50.0647', lon: '19.9450' } },
  { key: 'parisBerlin',  p1: { lat: '48.8566', lon: '2.3522'  }, p2: { lat: '52.5200', lon: '13.4050' } },
  { key: 'nycLondon',    p1: { lat: '40.7128', lon: '-74.0060'}, p2: { lat: '51.5074', lon: '-0.1278' } },
]

function applyPreset(preset: typeof PRESET_EXAMPLES[number]) {
  point1.value = { ...preset.p1 }
  point2.value = { ...preset.p2 }
}
</script>

<template>
  <div class="form-wrapper">
    <div class="form-wrapper__presets">
      <span class="form-wrapper__presets-label">{{ t('form.examples') }}</span>
      <button
        v-for="preset in PRESET_EXAMPLES"
        :key="preset.key"
        type="button"
        class="form-wrapper__preset-btn"
        @click="applyPreset(preset)"
      >
        {{ t(`form.presets.${preset.key}`) }}
      </button>
    </div>

    <form class="form" novalidate @submit.prevent="handleSubmit">
      <div class="form__points">
        <PointInput
          v-model="point1"
          :point-number="1"
          :label="t('form.pointA')"
        />
        <div class="form__separator" aria-hidden="true">
          <span class="form__separator-line" />
          <svg class="form__separator-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="form__separator-line" />
        </div>
        <PointInput
          v-model="point2"
          :point-number="2"
          :label="t('form.pointB')"
        />
      </div>

      <div class="form__actions">
        <button
          type="button"
          class="form__btn form__btn--ghost"
          :disabled="loading"
          @click="handleReset"
        >
          {{ t('form.clear') }}
        </button>
        <button
          type="submit"
          class="form__btn form__btn--primary"
          :disabled="!canSubmit"
          :aria-busy="loading"
        >
          <AppSpinner v-if="loading" :size="18" />
          <span>{{ loading ? t('form.calculating') : t('form.calculate') }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-wrapper__presets {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.form-wrapper__presets-label {
  font-size: .8125rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.form-wrapper__preset-btn {
  font-size: .8125rem;
  padding: 4px 12px;
  border: 1.5px solid var(--color-border);
  border-radius: 99px;
  background: var(--color-surface);
  color: var(--color-text);
  transition: border-color var(--transition), background var(--transition), color var(--transition);
}

.form-wrapper__preset-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: #eef2ff;
}

.form__points {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form__separator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.form__separator-line {
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.form__separator-icon {
  width: 22px;
  height: 22px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.form__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: var(--radius-sm);
  font-size: .9375rem;
  font-weight: 600;
  border: none;
  transition: background var(--transition), opacity var(--transition), transform var(--transition);
}

.form__btn:active:not(:disabled) {
  transform: scale(.97);
}

.form__btn--ghost {
  background: transparent;
  border: 1.5px solid var(--color-border);
  color: var(--color-text-muted);
}

.form__btn--ghost:hover:not(:disabled) {
  border-color: var(--color-border-error);
  color: var(--color-error);
}

.form__btn--primary {
  background: var(--color-primary);
  color: var(--color-primary-text);
  min-width: 178px;
  justify-content: center;
}

.form__btn--primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.form__btn:disabled {
  opacity: .5;
  cursor: not-allowed;
}
</style>
