import App from './UserApp.svelte';

const app = new App({
	target: document.body,
  props: {
    subdomain: process.env.USER_SUBDOMAIN
  }
});

export default app;
