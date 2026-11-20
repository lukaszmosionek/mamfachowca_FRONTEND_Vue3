// tests/Home.spec.js
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '@/views/HomeView.vue'
import api from '@/services/api'

describe('Home.vue', () => {
  it('renders "All providers"', () => {
    const wrapper = mount(Home)
    expect(wrapper.text()).toContain('All Providers')
  })

  it('sends the entered service name to the services API', async () => {
    vi.useFakeTimers()
    const getMock = vi.mocked(api.get)
    getMock.mockClear()

    const wrapper = mount(Home)
    await wrapper.find('input[placeholder="Search by name"]').setValue('My service')
    await vi.advanceTimersByTimeAsync(500)

    expect(getMock).toHaveBeenCalledWith('/services', expect.objectContaining({
      params: expect.objectContaining({ name: 'My service' })
    }))

    vi.useRealTimers()
  })
})
