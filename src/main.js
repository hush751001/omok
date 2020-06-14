import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: '오목'
	}
});

export default app;