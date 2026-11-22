import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import Header from '@/components/Header.vue'
import { router } from './setup'

enableAutoUnmount(afterEach)

describe('Header.vue', () => {
  it('uses the expandable menu at desktop widths', async () => {
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
    expect(wrapper.find('#site-menu #changeLanguage-pl').text()).toContain('Switch to Polish')
  })
})
