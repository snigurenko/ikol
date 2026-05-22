<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CoordinateField from './CoordinateField.vue'
import type { Coordinates } from '../types'

const { t } = useI18n()

const props = defineProps<{
  modelValue: Coordinates
  pointNumber: 1 | 2
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Coordinates]
}>()

function updateLat(val: string) {
  emit('update:modelValue', { ...props.modelValue, lat: val })
}

function updateLon(val: string) {
  emit('update:modelValue', { ...props.modelValue, lon: val })
}

const isComplete = computed(() => {
  const lat = parseFloat(props.modelValue.lat)
  const lon = parseFloat(props.modelValue.lon)
  return (
    props.modelValue.lat !== '' &&
    props.modelValue.lon !== '' &&
    !isNaN(lat) && lat >= -90 && lat <= 90 &&
    !isNaN(lon) && lon >= -180 && lon <= 180
  )
})
</script>

<template>
  <div class="point" :class="`point--${pointNumber}`">
    <div class="point__header">
      <span class="point__badge">{{ pointNumber }}</span>
      <h3 class="point__title">{{ label }}</h3>
      <span v-if="isComplete" class="point__complete">{{ t('point.complete') }}</span>
    </div>

    <div class="point__fields">
      <CoordinateField
        :id="`lat-${pointNumber}`"
        :model-value="modelValue.lat"
        :label="t('point.lat')"
        :min="-90"
        :max="90"
        placeholder="-90 … 90"
        @update:model-value="updateLat"
      />
      <CoordinateField
        :id="`lon-${pointNumber}`"
        :model-value="modelValue.lon"
        :label="t('point.lon')"
        :min="-180"
        :max="180"
        placeholder="-180 … 180"
        @update:model-value="updateLon"
      />
    </div>
  </div>
</template>

<style scoped>
.point {
  padding: 20px;
  border-radius: var(--radius-md);
  background: var(--color-surface-alt);
  border: 1.5px solid var(--color-border);
  transition: border-color var(--transition);
}

.point--1 { border-left: 4px solid #6366f1; }
.point--2 { border-left: 4px solid #06b6d4; }

.point__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.point__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: .8125rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.point--1 .point__badge { background: #6366f1; }
.point--2 .point__badge { background: #06b6d4; }

.point__title {
  font-size: .9375rem;
  font-weight: 600;
  color: var(--color-text);
  flex: 1;
}

.point__complete {
  font-size: .6875rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
  background: var(--color-success-bg);
  color: var(--color-success-text);
  letter-spacing: .03em;
  text-transform: uppercase;
}

.point__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 480px) {
  .point__fields {
    grid-template-columns: 1fr;
  }
}
</style>
