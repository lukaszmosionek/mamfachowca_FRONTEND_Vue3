// tests/Home.spec.js
import { afterEach, describe, it, expect, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import Home from '@/views/HomeView.vue'
import api from '@/services/api'
import { useHeaderStore } from '@/stores/useHeaderStore'
import { router } from './setup'

enableAutoUnmount(afterEach)

describe('Home.vue', () => {
  it('places name search and sorting above the offers and other filters in the sidebar', async () => {
    const wrapper = mount(Home)
    await flushPromises()

    expect(wrapper.find('section input#search-box').exists()).toBe(true)
    expect(wrapper.find('section select#sort-by').exists()).toBe(true)
    expect(wrapper.find('section').text()).toContain('30 products')
    expect(wrapper.find('aside input#search-box').exists()).toBe(false)
    expect(wrapper.find('aside select#sort-by').exists()).toBe(false)
    expect(wrapper.find('aside input#price-from').exists()).toBe(true)
    expect(wrapper.find('aside input#duration-from').exists()).toBe(true)
    expect(wrapper.find('section legend').text()).toContain('Search by name')
    expect(wrapper.findAll('aside legend').map(legend => legend.text())).toEqual([
      'Provider',
      'Price from',
      'Price to',
      'Duration from',
      'Duration to'
    ])
  })

  it('shows an empty state when the services API returns no services', async () => {
    const wrapper = mount(Home)
    await flushPromises()

    expect(wrapper.find('[role="status"]').text()).toBe('No services match the selected filters.')
  })

  it('shows a loading indicator while services are being fetched', async () => {
    const getMock = vi.mocked(api.get)
    let resolveServices = () => {}
    const pendingServices = new Promise((resolve) => {
      resolveServices = () => resolve({ services: [], last_page: 1 })
    })
    getMock.mockImplementation(async (url) => {
      if (url === '/services') return pendingServices
      if (url === '/providers') return { providers: [] }
      return {}
    })

    const wrapper = mount(Home)
    await flushPromises()

    expect(wrapper.find('[role="status"]').text()).toBe('Loading services...')
    resolveServices()
    await flushPromises()

    expect(wrapper.find('[role="status"]').text()).toBe('No services match the selected filters.')
    getMock.mockReset()
  })

  it('resets filters, sorting, page size and pagination when Home is clicked', async () => {
    const getMock = vi.mocked(api.get)
    const previousCurrency = localStorage.getItem('currency')
    localStorage.setItem('currency', 'USD')
    await router.replace({
      name: 'Home',
      query: {
        name: 'Existing service',
        provider_id: '2',
        priceFrom: '20',
        priceTo: '80',
        durationFrom: '30',
        durationTo: '60',
        currency: 'USD',
        sortBy: 'price_desc',
        perPage: '60',
        page: '2'
      }
    })
    getMock.mockImplementation(async (url, config) => {
      if (url === '/providers') return { providers: [] }
      if (url !== '/services') return {}

      const start = (config.params.page - 1) * 30
      const end = config.params.page === 1 ? 30 : 65
      const services = Array.from({ length: end - start }, (_, index) => ({
        id: start + index + 1,
        name: `Service ${start + index + 1}`,
        price: '50',
        duration_minutes: 45,
        currency: { code: 'USD' },
        photos: [],
        provider: { id: 2, name: 'Provider' },
        is_favorited: false
      }))

      return { services, last_page: 2 }
    })

    const wrapper = mount(Home)
    await flushPromises()
    await flushPromises()
    expect(wrapper.find('input#search-box').element.value).toBe('Existing service')
    expect(wrapper.find('select#sort-by').element.value).toBe('price_desc')
    expect(wrapper.find('input#price-from').element.value).toBe('20')
    expect(wrapper.find('input#duration-from').element.value).toBe('30')
    expect(wrapper.find('#offers-per-page').element.value).toBe('60')
    expect(wrapper.findAll('.service-tile')).toHaveLength(5)

    getMock.mockClear()
    await router.replace({ name: 'Home', query: {} })
    const headerStore = useHeaderStore()
    expect(headerStore.homeClicked).toBe(false)
    headerStore.triggerHomeClick()
    expect(headerStore.homeClicked).toBe(true)
    await wrapper.vm.$nextTick()
    expect(headerStore.homeClicked).toBe(false)
    await flushPromises()
    await flushPromises()

    expect(wrapper.find('input#search-box').element.value).toBe('')
    expect(wrapper.find('select#sort-by').element.value).toBe('popularity')
    expect(wrapper.find('input#price-from').element.value).toBe('')
    expect(wrapper.find('input#price-to').element.value).toBe('')
    expect(wrapper.find('input#duration-from').element.value).toBe('')
    expect(wrapper.find('input#duration-to').element.value).toBe('')
    expect(wrapper.find('#offers-per-page').element.value).toBe('30')
    expect(wrapper.findAll('.service-tile')).toHaveLength(30)
    expect(Object.keys(router.currentRoute.value.query)).toHaveLength(0)

    const homeRequest = getMock.mock.calls
      .filter(([url]) => url === '/services')
      .map(([, config]) => config)
      .find(config => config.params.page === 1)
    expect(homeRequest.params).toMatchObject({
      name: null,
      provider_id: null,
      sortBy: 'popularity',
      currency: 'USD'
    })

    getMock.mockReset()
    if (previousCurrency === null) localStorage.removeItem('currency')
    else localStorage.setItem('currency', previousCurrency)
  })

  it('defaults to popularity and preserves the API result order', async () => {
    const getMock = vi.mocked(api.get)
    await router.replace({ name: 'Home', query: { currency: 'USD' } })
    getMock.mockImplementation(async (url) => {
      if (url !== '/services') return { providers: [] }

      return {
        services: [
          { id: 1, name: 'Zulu Service', price: '50', currency: { code: 'USD' } },
          { id: 2, name: 'Alpha Service', price: '10', currency: { code: 'USD' } }
        ].map(service => ({
          ...service,
          photos: [],
          provider: { id: 1, name: 'Provider' },
          duration_minutes: 30,
          is_favorited: false
        })),
        last_page: 1
      }
    })

    const wrapper = mount(Home)
    await flushPromises()

    expect(wrapper.find('select[name="sortBy"]').element.value).toBe('popularity')
    expect(wrapper.findAll('h2.service-title').map(title => title.text())).toEqual([
      'Zulu Service',
      'Alpha Service'
    ])

    getMock.mockReset()
  })

  it('shows 30 offers per page and navigates to the remaining offers', async () => {
    const getMock = vi.mocked(api.get)
    await router.replace({ name: 'Home', query: { currency: 'USD', sortBy: 'popularity', page: '1' } })
    getMock.mockImplementation(async (url, config) => {
      if (url !== '/services') return { providers: [] }

      const start = (config.params.page - 1) * 30
      const end = config.params.page === 1 ? 30 : 35
      const services = Array.from({ length: end - start }, (_, index) => {
        const id = start + index + 1
        return {
          id,
          name: `Service ${id}`,
          price: '50',
          currency: { code: 'USD' },
          photos: [],
          provider: { id: 1, name: 'Provider' },
          duration_minutes: 30,
          is_favorited: false
        }
      })

      return { services, last_page: 2 }
    })

    const wrapper = mount(Home)
    await flushPromises()
    await flushPromises()

    expect(wrapper.findAll('.service-tile')).toHaveLength(30)
    const secondPageButton = wrapper.findAll('nav button').find(button => button.text() === '2')
    expect(secondPageButton).toBeDefined()
    await secondPageButton.trigger('click')

    expect(wrapper.findAll('.service-tile')).toHaveLength(5)
    expect(wrapper.find('.service-tile').attributes('data-id')).toBe('31')

    getMock.mockReset()
  })

  it('lets the Show selector change the number of visible offers', async () => {
    const getMock = vi.mocked(api.get)
    await router.replace({ name: 'Home', query: { currency: 'USD', sortBy: 'popularity', page: '1' } })
    getMock.mockImplementation(async (url) => {
      if (url !== '/services') return { providers: [] }

      return {
        services: Array.from({ length: 35 }, (_, index) => ({
          id: index + 1,
          name: `Service ${index + 1}`,
          price: '50',
          currency: { code: 'USD' },
          photos: [],
          provider: { id: 1, name: 'Provider' },
          duration_minutes: 30,
          is_favorited: false
        })),
        last_page: 1
      }
    })

    const wrapper = mount(Home)
    await flushPromises()

    expect(wrapper.findAll('.service-tile')).toHaveLength(30)
    await wrapper.find('#offers-per-page').setValue('60')
    await flushPromises()

    expect(wrapper.findAll('.service-tile')).toHaveLength(35)
    expect(wrapper.find('nav').exists()).toBe(false)
    expect(router.currentRoute.value.query.perPage).toBe('60')

    getMock.mockReset()
  })

  it('renders "All providers"', async () => {
    const wrapper = mount(Home)
    await flushPromises()
    await wrapper.find('input[placeholder="Search providers"]').trigger('focus')
    expect(wrapper.text()).toContain('All Providers')
  })

  it('shows the service count beside each provider in the filter', async () => {
    const getMock = vi.mocked(api.get)
    getMock.mockImplementation(async (url) => {
      if (url === '/providers') {
        return { providers: [{ id: 1, name: 'Provider One', services_count: 4 }] }
      }
      if (url === '/services') return { services: [], last_page: 1 }
      return {}
    })

    const wrapper = mount(Home)
    await flushPromises()
    await wrapper.find('input[placeholder="Search providers"]').trigger('focus')

    expect(wrapper.text()).toContain('Provider One')
    expect(wrapper.text()).toContain('(4)')

    getMock.mockReset()
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

  it('filters by price locally without sending unsupported price parameters', async () => {
    vi.useFakeTimers()
    const getMock = vi.mocked(api.get)
    getMock.mockClear()

    const wrapper = mount(Home)
    await flushPromises()
    await wrapper.find('input#price-from').setValue('25')
    await flushPromises()
    await vi.advanceTimersByTimeAsync(500)

    const serviceRequest = getMock.mock.calls
      .filter(([url]) => url === '/services')
      .map(([, config]) => config)
      [0]
    expect(serviceRequest).toBeDefined()
    expect(serviceRequest.params).not.toHaveProperty('price_from')
    expect(serviceRequest.params).not.toHaveProperty('price_to')

    vi.useRealTimers()
  })

  it('filters services by duration locally without sending duration parameters to the API', async () => {
    vi.useFakeTimers()
    const getMock = vi.mocked(api.get)
    await router.replace({ name: 'Home', query: { currency: 'USD' } })
    getMock.mockImplementation(async (url) => {
      if (url !== '/services') return { providers: [] }

      return {
        services: [
          { id: 1, name: 'Short service', price: '50', duration_minutes: 30, currency: { code: 'USD' } },
          { id: 2, name: 'Medium service', price: '50', duration_minutes: 60, currency: { code: 'USD' } },
          { id: 3, name: 'Long service', price: '50', duration_minutes: 90, currency: { code: 'USD' } }
        ].map(service => ({
          ...service,
          photos: [],
          provider: { id: 1, name: 'Provider' },
          is_favorited: false
        })),
        last_page: 1
      }
    })

    const wrapper = mount(Home)
    await flushPromises()
    getMock.mockClear()
    await wrapper.find('#duration-from').setValue('45')
    await flushPromises()
    await vi.advanceTimersByTimeAsync(500)
    await flushPromises()

    expect(wrapper.findAll('h2.service-title').map(title => title.text())).toEqual([
      'Medium service',
      'Long service'
    ])
    const serviceRequest = getMock.mock.calls
      .filter(([url]) => url === '/services')
      .map(([, config]) => config)
      [0]
    expect(serviceRequest).toBeDefined()
    expect(serviceRequest.params).not.toHaveProperty('durationFrom')
    expect(serviceRequest.params).not.toHaveProperty('durationTo')
    expect(serviceRequest.params).not.toHaveProperty('duration_from')
    expect(serviceRequest.params).not.toHaveProperty('duration_to')

    getMock.mockReset()
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

  it('sorts all pages by converted price from low to high by default', async () => {
    const getMock = vi.mocked(api.get)
    localStorage.setItem('currency', 'USD')
    await router.replace({ name: 'Home', query: { currency: 'USD', sortBy: 'price_asc' } })
    getMock.mockImplementation(async (url, config) => {
      if (url !== '/services') return { providers: [] }

      const servicesByPage = {
        1: [
          { id: 1, name: 'Fifty USD', price: '50', currency: { code: 'USD' } },
          { id: 2, name: 'Interior Painting', price: '136', currency: { code: 'PLN' } }
        ],
        2: [
          { id: 3, name: 'Thirty-five USD', price: '35', currency: { code: 'USD' } },
          { id: 4, name: 'Fifty-one EUR', price: '51', currency: { code: 'EUR' } }
        ]
      }

      return {
        services: servicesByPage[config.params.page].map(service => ({
          ...service,
          photos: [],
          provider: { id: 1, name: 'Provider' },
          duration_minutes: 30,
          is_favorited: false
        })),
        last_page: 2
      }
    })

    const wrapper = mount(Home)
    await flushPromises()
    await flushPromises()

    expect(wrapper.findAll('h2.service-title').map(title => title.text())).toEqual([
      'Thirty-five USD',
      'Interior Painting',
      'Fifty USD',
      'Fifty-one EUR'
    ])

    getMock.mockReset()
    vi.useRealTimers()
  })

  it('re-sorts loaded services when the sort option changes', async () => {
    const getMock = vi.mocked(api.get)
    await router.replace({ name: 'Home', query: { currency: 'USD', sortBy: 'price_asc' } })
    getMock.mockImplementation(async (url) => {
      if (url !== '/services') return { providers: [] }

      return {
        services: [
          { id: 1, name: 'Zulu Service', price: '50', currency: { code: 'USD' } },
          { id: 2, name: 'Alpha Service', price: '100', currency: { code: 'USD' } }
        ].map(service => ({
          ...service,
          photos: [],
          provider: { id: 1, name: 'Provider' },
          duration_minutes: 30,
          is_favorited: false
        })),
        last_page: 1
      }
    })

    const wrapper = mount(Home)
    await flushPromises()
    expect(wrapper.findAll('h2.service-title').map(title => title.text())).toEqual([
      'Zulu Service',
      'Alpha Service'
    ])
    const serviceRequestCount = getMock.mock.calls.filter(([url]) => url === '/services').length

    await wrapper.find('select[name="sortBy"]').setValue('name_asc')

    expect(wrapper.findAll('h2.service-title').map(title => title.text())).toEqual([
      'Alpha Service',
      'Zulu Service'
    ])
    expect(getMock.mock.calls.filter(([url]) => url === '/services')).toHaveLength(serviceRequestCount)

    getMock.mockReset()
  })

  it('renders overlapping paginated services only once', async () => {
    const getMock = vi.mocked(api.get)
    await router.replace({ name: 'Home', query: { currency: 'USD', sortBy: 'price_asc' } })
    getMock.mockImplementation(async (url, config) => {
      if (url !== '/services') return { providers: [] }

      const servicesByPage = {
        1: [
          { id: 22, name: 'Service 22', price: '10', currency: { code: 'USD' } },
          { id: 12, name: 'Service 12', price: '20', currency: { code: 'USD' } }
        ],
        2: [
          { id: 22, name: 'Service 22', price: '10', currency: { code: 'USD' } },
          { id: 24, name: 'Service 24', price: '30', currency: { code: 'USD' } }
        ]
      }

      return {
        services: servicesByPage[config.params.page].map(service => ({
          ...service,
          photos: [],
          provider: { id: 1, name: 'Provider' },
          duration_minutes: 30,
          is_favorited: false
        })),
        last_page: 2
      }
    })

    const wrapper = mount(Home)
    await flushPromises()
    await flushPromises()

    expect(wrapper.findAll('.service-tile')).toHaveLength(3)
    expect(wrapper.findAll('.service-tile').map(tile => tile.attributes('data-id'))).toEqual([
      '22',
      '12',
      '24'
    ])

    getMock.mockReset()
  })
})
