<script setup lang="ts">
import { computed } from 'vue'
import type { ValidationError } from '../types'

const props = defineProps<{
  modelValue: string
  label: string
  id: string
  min: number
  max: number
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const validationError = computed<ValidationError>(() => {
  if (props.modelValue === '') return null
  const num = parseFloat(props.modelValue)
  if (isNaN(num)) return 'Wartość musi być liczbą.'
  if (num < props.min || num > props.max)
    return `Zakres: ${props.min} do ${props.max}.`
  return null
})

const isInvalid = computed(() => validationError.value !== null)
const isValid   = computed(() => props.modelValue !== '' && !isInvalid.value)
</script>

<template>
  <div class="field">
    <label :for="id" class="field__label">{{ label }}</label>
    <div class="field__wrapper" :class="{ 'field__wrapper--invalid': isInvalid, 'field__wrapper--valid': isValid }">
      <input
        :id="id"
        class="field__input"
        type="number"
        :step="0.000001"
        :min="min"
        :max="max"
        :placeholder="placeholder"
        :value="modelValue"
        :aria-describedby="isInvalid ? `${id}-error` : undefined"
        :aria-invalid="isInvalid || undefined"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <span v-if="isValid" class="field__icon field__icon--ok" aria-hidden="true">✓</span>
    </div>
    <p v-if="isInvalid" :id="`${id}-error`" class="field__error" role="alert">
      {{ validationError }}
    </p>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field__label {
  font-size: .8125rem;
  font-weight: 600;
  color: var(--color-text-label);
  letter-spacing: .01em;
}

.field__wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  transition: border-color var(--transition), box-shadow var(--transition);
}

.field__wrapper:focus-within {
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px rgba(99,102,241,.15);
}

.field__wrapper--invalid {
  border-color: var(--color-border-error);
}

.field__wrapper--invalid:focus-within {
  border-color: var(--color-border-error);
  box-shadow: 0 0 0 3px rgba(239,68,68,.15);
}

.field__wrapper--valid {
  border-color: var(--color-success);
}

.field__input {
  flex: 1;
  padding: 9px 12px;
  border: none;
  background: transparent;
  font-size: .9375rem;
  color: var(--color-text);
  outline: none;
  min-width: 0;
}

.field__input::placeholder {
  color: var(--color-text-muted);
  opacity: .7;
}

.field__icon {
  padding-right: 10px;
  font-size: .875rem;
  flex-shrink: 0;
}

.field__icon--ok {
  color: var(--color-success);
}

.field__error {
  font-size: .75rem;
  color: var(--color-error);
  padding-left: 2px;
}
</style>
