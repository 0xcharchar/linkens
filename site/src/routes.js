import SelectSubdomain from './views/select-subdomain.svelte'
import SocialsForm from './views/socials-form.svelte'
import Confirmation from './views/confirmation.svelte'
import User from './views/user.svelte'
import About from './views/about.svelte'
import Contact from './views/contact.svelte'

const routes = {
  '/': SelectSubdomain,
  '/socials': SocialsForm,
  '/confirm': Confirmation,
  '/user/:siteUrl': User,
  '/about': About,
  '/contact': Contact
}

export { routes }
