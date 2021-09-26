import Landing from './views/landing.svelte'
import Search from './views/search.svelte'
import User from './views/user.svelte'

const routes = [
  { name: '/', component: Landing },
  { name: '/supporters', component: Search },
  { name: '/user/:id', component: User },
]

export { routes }
