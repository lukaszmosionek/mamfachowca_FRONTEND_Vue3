import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import Header from '@/components/Header.vue'
import { router } from './setup'

enableAutoUnmount(afterEach)

describe('Header.vue', () => {
  it('uses the expandable menu at desktop widths', async () => {
    const previousCurrency = localStorage.getItem('currency')
    localStorage.setItem('currency', 'USD')
    await router.replace({ name: 'Home', query: {} })
    const wrapper = mount(Header, {
      global: {
        stubs: {
          'router-link': false
        }
      }
    })

    expect(wrapper.find('[aria-label="Menu"]').exists()).toBe(true)
    expect(wrapper.find('#site-menu').exists()).toBe(false)

    await wrapper.find('[aria-label="Menu"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('#site-menu').exists()).toBe(true)
    expect(wrapper.find('#site-menu').text()).toContain('Contact')
    expect(wrapper.find('#site-menu').text()).toContain('About')
    expect(wrapper.find('#site-menu').text()).toContain('Login')
    expect(wrapper.find('#site-menu').text()).toContain('Register')
    expect(wrapper.find('#site-menu').classes()).not.toContain('md:hidden')
    expect(wrapper.find('#site-menu [role="group"][aria-label="Currency"]').exists()).toBe(true)
    expect(wrapper.find('header select').exists()).toBe(false)
    expect(wrapper.find('#currency-option-usd').attributes('aria-pressed')).toBe('true')
    await wrapper.find('#currency-option-eur').trigger('click')
    expect(wrapper.find('#currency-option-eur').attributes('aria-pressed')).toBe('true')
    expect(localStorage.getItem('currency')).toBe('EUR')
    expect(wrapper.find('#site-menu #changeLanguage-pl').text()).toContain('Switch to Polish')

    if (previousCurrency === null) localStorage.removeItem('currency')
    else localStorage.setItem('currency', previousCurrency)
  })
})
