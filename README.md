# Kalkulator odległości geograficznych

Aplikacja obliczająca odległość między dwoma punktami geograficznymi.  
**Backend:** PHP 8.1+ · **Frontend:** Vue 3 + TypeScript + Vite

---

## Struktura projektu

```
ikol/
├── backend/
│   ├── DistanceCalculator.php   # Logika – formuła Haversine
│   ├── api.php                  # Endpoint REST (POST /api/api.php)
│   ├── composer.json
│   ├── phpunit.xml
│   └── tests/
│       └── DistanceCalculatorTest.php
└── frontend/
    ├── src/
    │   ├── App.vue                          # Główny komponent
    │   ├── main.ts
    │   ├── assets/base.css                  # CSS custom properties + reset
    │   ├── types/index.ts                   # Interfejsy TypeScript
    │   ├── composables/useDistance.ts       # Logika API (fetch + stan)
    │   └── components/
    │       ├── CoordinateForm.vue   # Formularz + przykłady + akcje
    │       ├── PointInput.vue       # Jeden punkt (lat + lon)
    │       ├── CoordinateField.vue  # Pojedyncze pole z walidacją
    │       ├── DistanceResult.vue   # Wyświetlanie wyniku
    │       └── AppSpinner.vue       # Animowany spinner ładowania
    └── tests/
        ├── components/
        │   ├── CoordinateField.spec.ts
        │   └── DistanceResult.spec.ts
        └── composables/
            └── useDistance.spec.ts
```

---

## Uruchomienie

### Backend (PHP)

```bash
cd backend
composer install          # instaluje PHPUnit
php -S localhost:8000     # serwer deweloperski
```

### Frontend (Vue)

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

Vite proxy przekierowuje zapytania frontendu `/api/*` → `http://localhost:8000/*` (z usunięciem prefiksu `/api`), więc oba serwery muszą działać jednocześnie.  
Przykład: `fetch('/api/api.php')` → `http://localhost:8000/api.php`.

---

## Testy

### PHP (PHPUnit)

```bash
cd backend
composer test
```

Przypadki testowe:
- Ten sam punkt → 0 m
- Odległość Warszawa → Kraków (~252 km)
- Symetria pomiaru (A→B = B→A)
- Bieguny (Biegun Północny → Południowy ~20 015 km)
- Koordynaty ujemne (Buenos Aires → Sydney)
- Parametryczne testy dla znanych par miast

### JavaScript (Vitest)

```bash
cd frontend
npm test              # jednorazowy przebieg
npm run test:watch    # tryb watch
npm run test:coverage # raport pokrycia
```

Pokrycie testami: **27 testów** w 3 plikach spec.

---

## Architektura frontendu

```
App.vue
└── CoordinateForm.vue        emituje: submit(p1, p2), reset
    ├── PointInput.vue × 2    v-model: Coordinates
    │   └── CoordinateField.vue × 2   v-model: string, walidacja inline
    └── AppSpinner.vue
└── DistanceResult.vue        props: DistanceResult
```

Composable `useDistance` izoluje cały stan związany z API:  
`{ result, error, loading, calculate(), reset() }`

---

## API

PHP-serwer nasłuchuje bezpośrednio pod adresem `http://localhost:8000/api.php`.  
Frontend wywołuje endpoint przez Vite proxy jako `/api/api.php`.

### `POST /api.php`

**Request body (JSON):**
```json
{ "lat1": 52.2297, "lon1": 21.0122, "lat2": 50.0647, "lon2": 19.9450 }
```

**Response 200** (Warszawa → Kraków):
```json
{ "meters": 251976.58, "kilometers": 251.9766 }
```

**Kody błędów:** `400` (invalid JSON), `405` (wrong method), `422` (walidacja)

---

## Walidacja

| Pole | Zakres |
|------|--------|
| lat  | −90 … 90 |
| lon  | −180 … 180 |

Walidacja po obu stronach: inline w `CoordinateField.vue` (UX) i w `api.php` (bezpieczeństwo).  
Przycisk „Oblicz odległość" jest aktywny tylko gdy oba punkty są kompletne i poprawne.
