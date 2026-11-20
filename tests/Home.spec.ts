// tests/Home.spec.js
import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Home from '@/views/HomeView.vue'
import api from '@/services/api'
import { router } from './setup'

describe('Home.vue', () => {
  it('renders "All providers"', async () => {
    const wrapper = mount(Home)
    await flushPromises()
    await wrapper.find('input[placeholder="Search providers"]').trigger('focus')
    expect(wrapper.text()).toContain('All Providers')
  })

  it('sends the entered service name to the services API', async () => {
    vi.useFakeTimers()
    const getMock = vi.mocked(api.get)
    getMock.mockClear()

    const wrapper = mount(Home)
    await flushPromises()
    getMock.mockClear()
    await wrapper.find('input[placeholder="Search by name"]').setValue('My service')
    await flushPromises()
    await vi.advanceTimersByTimeAsync(500)

    expect(getMock).toHaveBeenCalledWith('/services', expect.objectContaining({
      params: expect.objectContaining({ name: 'My service' })
    }))

    vi.useRealTimers()
  })

  it('shows the active currency beside the price filters and sends it to the API', async () => {
    vi.useFakeTimers()
    const getMock = vi.mocked(api.get)
    getMock.mockClear()
    localStorage.setItem('currency', 'USD')
    await router.replace({ name: 'Home', query: { currency: 'USD' } })

    const wrapper = mount(Home)
    await flushPromises()
    getMock.mockClear()
    expect(wrapper.find('select[name="currency"]').exists()).toBe(false)
    expect(wrapper.find('input#price-from').element.parentElement?.textContent).toContain('USD')
    await wrapper.find('input#price-from').setValue('25')
    await flushPromises()
    await vi.advanceTimersByTimeAsync(500)

    expect(getMock).toHaveBeenCalledWith('/services', expect.objectContaining({
      params: expect.objectContaining({ currency: 'USD' })
    }))

    localStorage.removeItem('currency')
    vi.useRealTimers()
  })

  it('sends a minimum price without an empty maximum-price parameter', async () => {
    vi.useFakeTimers()
    const getMock = vi.mocked(api.get)
    getMock.mockClear()

    const wrapper = mount(Home)
    await flushPromises()
    await wrapper.find('input#price-from').setValue('25')
    await flushPromises()
    await vi.advanceTimersByTimeAsync(500)

    expect(getMock).toHaveBeenCalledWith('/services', expect.objectContaining({
      params: expect.objectContaining({
        price_from: '25'
      })
    }))
    const serviceRequest = getMock.mock.calls
      .filter(([url]) => url === '/services')
      .map(([, config]) => config)
      .find(config => config.params.price_from === '25')
    expect(serviceRequest.params).not.toHaveProperty('price_to')

    vi.useRealTimers()
  })

  it('hides services below the minimum after converting to the selected currency', async () => {
    vi.useFakeTimers()
    const getMock = vi.mocked(api.get)
    const previousCurrency = localStorage.getItem('currency')
    localStorage.setItem('currency', 'USD')
    await router.replace({ name: 'Home', query: { currency: 'USD' } })
    getMock.mockImplementation(async (url) => {
      if (url === '/services') {
        return {
          services: [
            {
              id: 38,
              name: 'Interior Painting',
              price: '136',
              currency: { code: 'PLN' },
              photos: [],
              provider: { id: 1, name: 'Provider' },
              duration_minutes: 30,
              is_favorited: false
            },
            {
              id: 39,
              name: 'Premium Painting',
              price: '200',
              currency: { code: 'PLN' },
              photos: [],
              provider: { id: 1, name: 'Provider' },
              duration_minutes: 30,
              is_favorited: false
            }
          ],
          last_page: 1
        }
      }
      return { providers: [] }
    })

    const wrapper = mount(Home)
    await flushPromises()
    await wrapper.find('input#price-from').setValue('40')
    await vi.advanceTimersByTimeAsync(500)
    await flushPromises()

    expect(wrapper.text()).not.toContain('Interior Painting')
    expect(wrapper.text()).toContain('Premium Painting')

    getMock.mockReset()
    if (previousCurrency === null) localStorage.removeItem('currency')
    else localStorage.setItem('currency', previousCurrency)
    vi.useRealTimers()
  })
})
