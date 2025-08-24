import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Login from '@/views/LoginView.vue'

describe('Login.vue', () => {
  it('shows error if fields are empty', async () => {
    const wrapper = mount(Login)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Email is required.')
  })

  it('clears error when username and password are filled', async () => {
    const wrapper = mount(Login)

    await wrapper.find('input[id="email"]').setValue('testuser')
    await wrapper.find('input[id="password"]').setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).not.toContain('Email is required.')
  })
})
