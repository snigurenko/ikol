import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DistanceResult from '../../src/components/DistanceResult.vue'

describe('DistanceResult', () => {
  it('renders without errors', () => {
    const wrapper = mount(DistanceResult, {
      props: { result: { meters: 1234.56, kilometers: 1.2346 } },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays meters value', () => {
    const wrapper = mount(DistanceResult, {
      props: { result: { meters: 252_000, kilometers: 252 } },
    })
    // Polish locale: 252 000,00
    expect(wrapper.text()).toContain('252')
  })

  it('displays kilometers value', () => {
    const wrapper = mount(DistanceResult, {
      props: { result: { meters: 1000, kilometers: 1.0 } },
    })
    expect(wrapper.text()).toContain('1')
  })

  it('shows zero distance correctly', () => {
    const wrapper = mount(DistanceResult, {
      props: { result: { meters: 0, kilometers: 0 } },
    })
    expect(wrapper.text()).toContain('0')
  })

  it('renders section with aria-live attribute', () => {
    const wrapper = mount(DistanceResult, {
      props: { result: { meters: 500, kilometers: 0.5 } },
    })
    expect(wrapper.find('section').attributes('aria-live')).toBe('polite')
  })

  it('renders two result cards', () => {
    const wrapper = mount(DistanceResult, {
      props: { result: { meters: 5000, kilometers: 5 } },
    })
    expect(wrapper.findAll('.result__card')).toHaveLength(2)
  })

  it('primary card contains "metrów" unit label', () => {
    const wrapper = mount(DistanceResult, {
      props: { result: { meters: 100, kilometers: 0.1 } },
    })
    expect(wrapper.find('.result__card--primary').text()).toContain('metrów')
  })

  it('secondary card contains "kilometrów" unit label', () => {
    const wrapper = mount(DistanceResult, {
      props: { result: { meters: 100, kilometers: 0.1 } },
    })
    expect(wrapper.find('.result__card--secondary').text()).toContain('kilometrów')
  })
})
