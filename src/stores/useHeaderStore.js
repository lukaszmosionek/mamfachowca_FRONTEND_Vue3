import { defineStore } from 'pinia'

export const useHeaderStore = defineStore('header', {
  state: () => ({
    homeClicked: false
  }),
  actions: {
    triggerHomeClick() {
      this.homeClicked = true
    },
    resetHomeClick() {
      this.homeClicked = false
    }
  }
})
