// tests/Home.spec.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '@/views/HomeView.vue'

describe('Home.vue', () => {
  it('renders "All providers"', () => {
    const wrapper = mount(Home)
    expect(wrapper.text()).toContain('All Providers')
  })
})
