import { writable } from 'svelte/store'

export const provider = writable(null)
export const address = writable('')
export const ens = writable({ name: '', avatar: '' })
export const connected = writable(false)
