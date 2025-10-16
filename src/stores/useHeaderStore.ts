import { defineStore } from 'pinia'

interface HeaderState {
  homeClicked: boolean
}

export const useHeaderStore = defineStore('header', {
  state: (): HeaderState => ({
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
