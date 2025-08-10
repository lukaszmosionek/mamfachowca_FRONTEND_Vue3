// tests/Contact.spec.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Contact from '../src/views/ContactView.vue'

describe('Contact.vue', () => {
  it('renders "Contact Us"', () => {
    const wrapper = mount(Contact)
    expect(wrapper.text()).toContain('Contact Us')
  })
})
