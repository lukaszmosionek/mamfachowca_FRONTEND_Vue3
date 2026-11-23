// tests/About.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutView from '@/views/AboutView.vue'

describe('AboutView.vue', () => {
  it('renders "About Me" header', () => {
    const wrapper = mount(AboutView)
    expect(wrapper.text()).toContain(wrapper.vm.$t('about.title'))
  })

  it('renders description', () => {
    const wrapper = mount(AboutView)
    expect(wrapper.text()).toContain(wrapper.vm.$t('about.description'))
  })

  it('renders Skills and Hobbies sections', () => {
    const wrapper = mount(AboutView)
    expect(wrapper.text()).toContain(wrapper.vm.$t('about.skills'))
    expect(wrapper.text()).toContain(wrapper.vm.$t('about.hobbies'))
  })

  it('renders all skills', () => {
    const wrapper = mount(AboutView)
    expect(wrapper.text()).toContain(wrapper.vm.$t('about.skill1'))
    expect(wrapper.text()).toContain(wrapper.vm.$t('about.skill2'))
    expect(wrapper.text()).toContain(wrapper.vm.$t('about.skill3'))
    expect(wrapper.text()).toContain(wrapper.vm.$t('about.skill4'))
  })

  it('renders all hobbies', () => {
    const wrapper = mount(AboutView)
    expect(wrapper.text()).toContain(wrapper.vm.$t('about.hobby1'))
    expect(wrapper.text()).toContain(wrapper.vm.$t('about.hobby2'))
    expect(wrapper.text()).toContain(wrapper.vm.$t('about.hobby3'))
    expect(wrapper.text()).toContain(wrapper.vm.$t('about.hobby4'))
  })
})
