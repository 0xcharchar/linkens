import { wrap } from 'svelte-spa-router/wrap'

import Landing from './views/landing.svelte'
import Search from './views/search.svelte'
import User from './views/user.svelte'
import Wizard from './views/wizard.svelte'

const routes = {
  '/': Landing,
  '/supporters': Search,
  '/user': User,
  '/wizard': Wizard,
}

export { routes }
