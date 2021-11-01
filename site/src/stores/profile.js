import { writable } from 'svelte/store'

export const profile = writable({
  username: '',
  avatar: '',
  links: []
})
