<script setup lang="ts">
import CoordinateForm from './components/CoordinateForm.vue'
import DistanceResult from './components/DistanceResult.vue'
import { useDistance } from './composables/useDistance'
import type { Coordinates } from './types'

const { result, error, loading, calculate, reset } = useDistance()

async function handleSubmit(point1: Coordinates, point2: Coordinates) {
  await calculate(point1, point2)
}
</script>

<template>
  <div class="layout">
    <header class="header">
      <div class="header__inner">
        <svg class="header__logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#6366f1"/>
          <path d="M10 22l6-14 6 14M12 18h8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div>
          <h1 class="header__title">Kalkulator odległości</h1>
          <p class="header__subtitle">Oblicz dystans między dwoma punktami na Ziemi</p>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="card">
        <CoordinateForm
          :loading="loading"
          @submit="handleSubmit"
          @reset="reset"
        />

        <Transition name="fade-slide">
          <div v-if="result || error" class="card__result">
            <hr class="card__divider" />
            <DistanceResult v-if="result" :result="result" />
            <div v-else-if="error" class="error-banner" role="alert">
              <svg class="error-banner__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              {{ error }}
            </div>
          </div>
        </Transition>
      </div>
    </main>

    <footer class="footer">
      Zadanie testowe dla Ikol. 
      <p>Zrobione prez Dymitr Snigurenko. </p>
      <p>mail: dendygreek@gmail.com</p>
      <br/>
      <p>Dokładność ±0.5%</p>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
}

.header {
  width: 100%;
  max-width: 680px;
  padding: 40px 0 28px;
}

.header__inner {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header__logo {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.header__title {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.2;
}

.header__subtitle {
  font-size: .875rem;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.main {
  width: 100%;
  max-width: 680px;
  flex: 1;
}

.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 28px;
  border: 1px solid var(--color-border);
}

.card__result {
  margin-top: 0;
}

.card__divider {
  border: none;
  border-top: 1.5px solid var(--color-border);
  margin: 24px 0;
}

.error-banner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  background: var(--color-error-bg);
  border: 1.5px solid #fca5a5;
  border-radius: var(--radius-sm);
  color: var(--color-error-text);
  font-size: .9375rem;
  font-weight: 500;
}

.error-banner__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--color-error);
  margin-top: 1px;
}

.footer {
  padding: 24px 0 32px;
  font-size: .75rem;
  color: var(--color-text-muted);
  letter-spacing: .03em;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity .25s ease, transform .25s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
