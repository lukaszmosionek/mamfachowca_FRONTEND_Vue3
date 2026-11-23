import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import CurrencySwitcher from '@/components/CurrencySwitcher.vue'

enableAutoUnmount(afterEach)

describe('CurrencySwitcher.vue', () => {
  it('renders a button for each supported currency', async () => {
    const wrapper = mount(CurrencySwitcher)
    await flushPromises()

    expect(wrapper.find('#currency-option-usd').exists()).toBe(true)
    expect(wrapper.find('#currency-option-pln').exists()).toBe(true)
    expect(wrapper.find('#currency-option-eur').exists()).toBe(true)
  })

  it('marks the active currency with aria-pressed="true"', async () => {
    localStorage.setItem('currency', 'PLN')
    const wrapper = mount(CurrencySwitcher)
    await flushPromises()

    expect(wrapper.find('#currency-option-pln').attributes('aria-pressed')).toBe('true')
    expect(wrapper.find('#currency-option-usd').attributes('aria-pressed')).toBe('false')
    expect(wrapper.find('#currency-option-eur').attributes('aria-pressed')).toBe('false')
  })

  it('updates the active currency and aria-pressed when a button is clicked', async () => {
    localStorage.setItem('currency', 'USD')
    const wrapper = mount(CurrencySwitcher)
    await flushPromises()

    expect(wrapper.find('#currency-option-usd').attributes('aria-pressed')).toBe('true')

    await wrapper.find('#currency-option-eur').trigger('click')
    await flushPromises()

    expect(wrapper.find('#currency-option-eur').attributes('aria-pressed')).toBe('true')
    expect(wrapper.find('#currency-option-usd').attributes('aria-pressed')).toBe('false')
  })

  it('persists the selected currency in localStorage', async () => {
    localStorage.setItem('currency', 'PLN')
    const wrapper = mount(CurrencySwitcher)
    await flushPromises()

    await wrapper.find('#currency-option-usd').trigger('click')
    await flushPromises()

    expect(localStorage.getItem('currency')).toBe('USD')
  })
})