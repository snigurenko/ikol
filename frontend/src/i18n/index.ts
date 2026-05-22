import { createI18n } from 'vue-i18n'

const messages = {
  pl: {
    app: {
      title: 'Kalkulator odległości',
      subtitle: 'Oblicz dystans między dwoma punktami na Ziemi',
      footer: {
        task: 'Zadanie testowe dla Ikol.',
        author: 'Zrobione przez Dymitr Snigurenko.',
        accuracy: 'Dokładność ±0.5%',
      },
    },
    form: {
      examples: 'Przykłady:',
      presets: {
        warsawKrakow: 'Warszawa → Kraków',
        parisBerlin: 'Paryż → Berlin',
        nycLondon: 'NYC → Londyn',
      },
      pointA: 'Punkt A',
      pointB: 'Punkt B',
      clear: 'Wyczyść',
      calculating: 'Obliczanie…',
      calculate: 'Oblicz odległość',
    },
    point: {
      complete: 'Kompletny',
      lat: 'Szerokość geograficzna (lat)',
      lon: 'Długość geograficzna (lon)',
    },
    validation: {
      mustBeNumber: 'Wartość musi być liczbą.',
      range: 'Zakres: {min} do {max}.',
    },
    result: {
      title: 'Obliczona odległość',
      meters: 'metrów',
      kilometers: 'kilometrów',
    },
  },
  en: {
    app: {
      title: 'Distance Calculator',
      subtitle: 'Calculate the distance between two points on Earth',
      footer: {
        task: 'Test task for Ikol.',
        author: 'Made by Dymitr Snigurenko.',
        accuracy: 'Accuracy ±0.5%',
      },
    },
    form: {
      examples: 'Examples:',
      presets: {
        warsawKrakow: 'Warsaw → Kraków',
        parisBerlin: 'Paris → Berlin',
        nycLondon: 'NYC → London',
      },
      pointA: 'Point A',
      pointB: 'Point B',
      clear: 'Clear',
      calculating: 'Calculating…',
      calculate: 'Calculate distance',
    },
    point: {
      complete: 'Complete',
      lat: 'Latitude (lat)',
      lon: 'Longitude (lon)',
    },
    validation: {
      mustBeNumber: 'Value must be a number.',
      range: 'Range: {min} to {max}.',
    },
    result: {
      title: 'Calculated distance',
      meters: 'meters',
      kilometers: 'kilometers',
    },
  },
}

export const i18n = createI18n({
  legacy: false,
  locale: 'pl',
  fallbackLocale: 'en',
  messages,
})
