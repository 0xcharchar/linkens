import Landing from './views/landing.svelte'
import Search from './views/search.svelte'

const routes = [
  { name: '/', component: Landing },
  { name: '/supporters', component: Search },
]

export { routes }
