import { ref } from 'vue'
import type { Coordinates, DistanceResult } from '../types'

export function useDistance() {
  const result  = ref<DistanceResult | null>(null)
  const error   = ref<string | null>(null)
  const loading = ref(false)

  async function calculate(point1: Coordinates, point2: Coordinates): Promise<void> {
    loading.value = true
    error.value   = null
    result.value  = null

    try {
      const response = await fetch('/api/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat1: parseFloat(point1.lat),
          lon1: parseFloat(point1.lon),
          lat2: parseFloat(point2.lat),
          lon2: parseFloat(point2.lon),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        error.value = (data as { error: string }).error ?? 'Nieznany błąd serwera.'
        return
      }

      result.value = data as DistanceResult
    } catch {
      error.value = 'Błąd sieci. Sprawdź połączenie z serwerem.'
    } finally {
      loading.value = false
    }
  }

  function reset(): void {
    result.value = null
    error.value  = null
  }

  return { result, error, loading, calculate, reset }
}
