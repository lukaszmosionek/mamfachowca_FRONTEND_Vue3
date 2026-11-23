import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, afterEach } from 'vitest'
import Filtering from '@/components/Filtering.vue'
import { router } from './setup'

const pushSpy = vi.spyOn(router, 'push').mockImplementation(() => Promise.resolve())

describe('Filtering.vue', () => {
  afterEach(() => {
    pushSpy.mockClear()
  })

  const baseProps = {
    providers: [{ id: 1, name: 'Provider One' }],
    filters: { name: '', provider_id: '', sortBy: 'popularity' }
  }

  it('renders the name search box', () => {
    const wrapper = mount(Filtering, { props: baseProps })
    expect(wrapper.find('input[name="search-box"]').exists()).toBe(true)
  })

  it('renders the provider SearchableSelect filter', () => {
    const wrapper = mount(Filtering, {
      props: baseProps,
      global: {
        stubs: {
          SearchableSelect: {
            template: '<div class="searchable-select"><input placeholder="Search providers" /></div>',
            emits: ['update:modelValue']
          }
        }
      }
    })
    expect(wrapper.find('.searchable-select').exists()).toBe(true)
  })

  it('renders the sorting select', () => {
    const wrapper = mount(Filtering, { props: baseProps })
    expect(wrapper.find('select#sort-by').exists()).toBe(true)
  })

  it('emits update:filters when the name filter value changes', async () => {
    const wrapper = mount(Filtering, { props: baseProps })
    await wrapper.find('input[name="search-box"]').setValue('test')
    await flushPromises()
    const emitted = wrapper.emitted('update:filters')
    expect(emitted).toBeTruthy()
    const lastEmit = emitted![emitted.length - 1]
    expect(lastEmit[0]).toEqual({ name: 'test', provider_id: '', sortBy: 'popularity' })
  })

  it('updatePerPage emits update:perPage and updates query params', async () => {
    const wrapper = mount(Filtering, {
      props: {
        ...baseProps,
        perPage: 30,
        perPageOptions: [30, 60, 90],
        showProductsCount: true
      }
    })
    await wrapper.find('#offers-per-page').setValue('60')
    await flushPromises()
    expect(wrapper.emitted('update:perPage')).toEqual([[60]])
    expect(router.push).toHaveBeenCalledWith({
      query: {
        perPage: 60,
        page: 1
      }
    })
  })
})