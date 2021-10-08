import { wrap } from 'svelte-spa-router/wrap'

import Landing from './views/landing.svelte'
import Wizard from './views/wizard.svelte'

const routes = {
  '/': Landing,
  '/wizard': Wizard,
}

export { routes }
