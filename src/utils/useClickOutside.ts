import type { Directive } from 'vue'

interface ClickOutsideElement extends HTMLElement {
  clickOutsideEvent?: (event: MouseEvent) => void
}

const clickOutsideDirective: Directive = {
  beforeMount(el: ClickOutsideElement, binding) {
    el.clickOutsideEvent = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        if (typeof binding.value === 'function') {
          binding.value(event)
        }
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },

  unmounted(el: ClickOutsideElement) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  }
}

export default clickOutsideDirective
