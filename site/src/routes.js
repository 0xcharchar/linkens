import SelectSubdomain from './views/select-subdomain.svelte'
import SocialsForm from './views/socials-form.svelte'
import Confirmation from './views/confirmation.svelte'
import User from './views/user.svelte'

const routes = {
  '/': SelectSubdomain,
  '/socials': SocialsForm,
  '/confirm': Confirmation,
  '/user': User
}

export { routes }
