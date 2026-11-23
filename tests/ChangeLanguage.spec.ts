import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import ChangeLanguage from '@/components/ChangeLanguage.vue'

enableAutoUnmount(afterEach)

describe('ChangeLanguage.vue', () => {
  it('renders buttons for English, Polish and Spanish', () => {
    const wrapper = mount(ChangeLanguage)

    expect(wrapper.findAll('[data-lang="en"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-lang="pl"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-lang="es"]')).toHaveLength(1)

    expect(wrapper.find('[data-lang="en"]').text()).toContain('EN')
    expect(wrapper.find('[data-lang="pl"]').text()).toContain('PL')
    expect(wrapper.find('[data-lang="es"]').text()).toContain('ES')
  })

  it('marks the active language with aria-pressed="true"', () => {
    const wrapper = mount(ChangeLanguage)

    expect(wrapper.find('[data-lang="en"]').attributes('aria-pressed')).toBe('true')
    expect(wrapper.find('[data-lang="pl"]').attributes('aria-pressed')).toBe('false')
    expect(wrapper.find('[data-lang="es"]').attributes('aria-pressed')).toBe('false')
  })

  it('changes the locale and updates localStorage when a language button is clicked', async () => {
    const previousLanguage = localStorage.getItem('lang')
    localStorage.removeItem('lang')

    const wrapper = mount(ChangeLanguage)

    expect(wrapper.find('[data-lang="en"]').attributes('aria-pressed')).toBe('true')
    expect(localStorage.getItem('lang')).toBe(null)

    await wrapper.find('[data-lang="pl"]').trigger('click')

    expect(wrapper.find('[data-lang="pl"]').attributes('aria-pressed')).toBe('true')
    expect(wrapper.find('[data-lang="en"]').attributes('aria-pressed')).toBe('false')
    expect(localStorage.getItem('lang')).toBe('pl')

    await wrapper.find('[data-lang="es"]').trigger('click')

    expect(wrapper.find('[data-lang="es"]').attributes('aria-pressed')).toBe('true')
    expect(wrapper.find('[data-lang="pl"]').attributes('aria-pressed')).toBe('false')
    expect(localStorage.getItem('lang')).toBe('es')

    if (previousLanguage === null) localStorage.removeItem('lang')
    else localStorage.setItem('lang', previousLanguage)
  })
})