import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import Footer from '@/components/Footer.vue'
import { router } from './setup'

enableAutoUnmount(afterEach)

describe('Footer.vue', () => {
  it('renders logo and description', async () => {
    await router.replace({ name: 'Home', query: {} })
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          'router-link': false
        }
      }
    })
    expect(wrapper.text()).toContain('Mam fachowca')
  })

  it('renders navigation links', async () => {
    await router.replace({ name: 'Home', query: {} })
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          'router-link': false
        }
      }
    })
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('About')
    expect(wrapper.text()).toContain('Contact')
  })

  it('renders social media icons', async () => {
    await router.replace({ name: 'Home', query: {} })
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          'router-link': false
        }
      }
    })
    expect(wrapper.html()).toContain('facebook-f')
    expect(wrapper.html()).toContain('twitter')
    expect(wrapper.html()).toContain('instagram')
    expect(wrapper.html()).toContain('linkedin-in')
  })

  it('contains ChangeLanguage component', async () => {
    await router.replace({ name: 'Home', query: {} })
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          'router-link': false
        }
      }
    })
    expect(wrapper.findComponent({ name: 'ChangeLanguage' }).exists()).toBe(true)
  })
})
