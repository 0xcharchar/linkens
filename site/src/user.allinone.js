import App from './UserApp.svelte';

const username = process.env.USER_SUBDOMAIN.split('.')[0]
// TODO map these into proper links
const links = JSON.parse(decodeURIComponent(process.env.USER_LINKS))
const avatar = process.env.USER_AVATAR

const app = new App({
	target: document.body,
  props: {
    profilePromise: Promise.resolve({
      avatar,
      username,
      links
    }),
    domain: 'ethonline2021char.eth'
  }
});

export default app;
