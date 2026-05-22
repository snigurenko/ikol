import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDistance } from '../../src/composables/useDistance'

const POINT_A = { lat: '52.2297', lon: '21.0122' }
const POINT_B = { lat: '50.0647', lon: '19.9450' }

describe('useDistance', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts with null result, no error, not loading', () => {
    const { result, error, loading } = useDistance()
    expect(result.value).toBeNull()
    expect(error.value).toBeNull()
    expect(loading.value).toBe(false)
  })

  it('sets loading true during calculation then false after', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ meters: 252_000, kilometers: 252 }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { loading, calculate } = useDistance()
    const promise = calculate(POINT_A, POINT_B)
    expect(loading.value).toBe(true)
    await promise
    expect(loading.value).toBe(false)
  })

  it('populates result on successful response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ meters: 252_000, kilometers: 252 }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result, calculate } = useDistance()
    await calculate(POINT_A, POINT_B)

    expect(result.value).toEqual({ meters: 252_000, kilometers: 252 })
  })

  it('sets error on non-ok HTTP response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Latitude must be between -90 and 90.' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { error, result, calculate } = useDistance()
    await calculate(POINT_A, POINT_B)

    expect(error.value).toBe('Latitude must be between -90 and 90.')
    expect(result.value).toBeNull()
  })

  it('sets network error message when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failure')))

    const { error, calculate } = useDistance()
    await calculate(POINT_A, POINT_B)

    expect(error.value).toContain('Błąd sieci')
  })

  it('clears previous result and error before new calculation', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ meters: 100, kilometers: 0.1 }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result, error, calculate } = useDistance()
    await calculate(POINT_A, POINT_B)
    expect(result.value).not.toBeNull()

    fetchMock.mockRejectedValueOnce(new Error('fail'))
    await calculate(POINT_A, POINT_B)

    expect(result.value).toBeNull()
    expect(error.value).toBeTruthy()
  })

  it('reset() clears result and error', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ meters: 500, kilometers: 0.5 }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result, error, calculate, reset } = useDistance()
    await calculate(POINT_A, POINT_B)
    expect(result.value).not.toBeNull()

    reset()

    expect(result.value).toBeNull()
    expect(error.value).toBeNull()
  })

  it('sends correct payload to the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ meters: 0, kilometers: 0 }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { calculate } = useDistance()
    await calculate(POINT_A, POINT_B)

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('/api/api.php')
    expect(options.method).toBe('POST')

    const body = JSON.parse(options.body as string)
    expect(body).toMatchObject({
      lat1: 52.2297,
      lon1: 21.0122,
      lat2: 50.0647,
      lon2: 19.9450,
    })
  })
})
