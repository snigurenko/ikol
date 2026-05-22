import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CoordinateField from '../../src/components/CoordinateField.vue'

const defaultProps = {
  modelValue: '',
  label: 'Szerokość geograficzna',
  id: 'lat-1',
  min: -90,
  max: 90,
}

describe('CoordinateField', () => {
  it('renders the label text', () => {
    const wrapper = mount(CoordinateField, { props: defaultProps })
    expect(wrapper.find('label').text()).toBe('Szerokość geograficzna')
  })

  it('renders input with correct min/max attributes', () => {
    const wrapper = mount(CoordinateField, { props: defaultProps })
    const input = wrapper.find('input')
    expect(input.attributes('min')).toBe('-90')
    expect(input.attributes('max')).toBe('90')
  })

  it('shows no error when value is empty', () => {
    const wrapper = mount(CoordinateField, { props: defaultProps })
    expect(wrapper.find('.field__error').exists()).toBe(false)
  })

  it('shows no error for a valid value within range', async () => {
    const wrapper = mount(CoordinateField, {
      props: { ...defaultProps, modelValue: '52.2297' },
    })
    expect(wrapper.find('.field__error').exists()).toBe(false)
  })

  it('shows error when value is out of range', async () => {
    const wrapper = mount(CoordinateField, {
      props: { ...defaultProps, modelValue: '95' },
    })
    expect(wrapper.find('.field__error').exists()).toBe(true)
    expect(wrapper.find('.field__error').text()).toContain('-90')
  })

  it('shows error for non-numeric value', async () => {
    const wrapper = mount(CoordinateField, {
      props: { ...defaultProps, modelValue: 'abc' },
    })
    expect(wrapper.find('.field__error').text()).toContain('liczbą')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(CoordinateField, { props: defaultProps })
    const input = wrapper.find('input')
    await input.setValue('45')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['45'])
  })

  it('shows ok icon for valid non-empty value', () => {
    const wrapper = mount(CoordinateField, {
      props: { ...defaultProps, modelValue: '0' },
    })
    expect(wrapper.find('.field__icon--ok').exists()).toBe(true)
  })

  it('applies invalid class to wrapper when out of range', () => {
    const wrapper = mount(CoordinateField, {
      props: { ...defaultProps, modelValue: '200' },
    })
    expect(wrapper.find('.field__wrapper').classes()).toContain('field__wrapper--invalid')
  })

  it('applies valid class to wrapper for valid value', () => {
    const wrapper = mount(CoordinateField, {
      props: { ...defaultProps, modelValue: '45.5' },
    })
    expect(wrapper.find('.field__wrapper').classes()).toContain('field__wrapper--valid')
  })

  it('links aria-describedby to error element id when invalid', () => {
    const wrapper = mount(CoordinateField, {
      props: { ...defaultProps, modelValue: '999' },
    })
    expect(wrapper.find('input').attributes('aria-describedby')).toBe('lat-1-error')
    expect(wrapper.find('#lat-1-error').exists()).toBe(true)
  })
})
