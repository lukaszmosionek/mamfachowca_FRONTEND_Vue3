import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Register from '@/views/RegisterView.vue'
import api from '@/services/api'

describe('Register.vue', () => {
  const postMock = vi.mocked(api.post)

  beforeEach(() => {
    postMock.mockReset()
    ;(api as unknown as { defaults: { headers: { common: Record<string, string> } } }).defaults = {
      headers: { common: {} }
    }
  })

  it('renders the registration form', () => {
    const wrapper = mount(Register)

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Register')
    expect(wrapper.find('input[name="name"]').exists()).toBe(true)
    expect(wrapper.find('input[name="email"]').exists()).toBe(true)
    expect(wrapper.find('input[name="password"]').exists()).toBe(true)
  })

  it('shows validation errors when submitting empty form', async () => {
    const wrapper = mount(Register)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Name is required.')
    expect(wrapper.text()).toContain('Email is required.')
    expect(wrapper.text()).toContain('Password is required.')
    expect(wrapper.text()).toContain('Password confirmation is required.')
  })

  it('submits valid data and calls the register API', async () => {
    postMock.mockResolvedValue({
      token: 'test-token',
      user: { id: 1, name: 'John', email: 'john@example.com', role: 'client' }
    })

    const wrapper = mount(Register)

    await wrapper.find('input[name="name"]').setValue('John')
    await wrapper.find('input[name="email"]').setValue('john@example.com')
    await wrapper.find('input[name="password"]').setValue('Secret123!')
    await wrapper.find('input[name="password_confirmation"]').setValue('Secret123!')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(postMock).toHaveBeenCalledWith('/register', expect.objectContaining({
      name: 'John',
      email: 'john@example.com',
      password: 'Secret123!'
    }))
  })
})
