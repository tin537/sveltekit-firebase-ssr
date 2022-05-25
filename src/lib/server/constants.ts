import { browser } from '$app/env';
import type { FirebaseOptions } from 'firebase/app';

if (browser) {
	// Just in case. I want to know if this file spills into the client ASAP.
	throw Error('Cannot load server constants on the client');
}

export let FIREBASE_CLIENT_CONFIG: FirebaseOptions = {};
export let FIREBASE_SERVER_CONFIG = '';

if (process && process.env && process.env['VITE_FIREBASE_CLIENT_CONFIG']) {
	FIREBASE_CLIENT_CONFIG = JSON.parse(process.env['VITE_FIREBASE_CLIENT_CONFIG'] || '');
	FIREBASE_SERVER_CONFIG = process.env['VITE_FIREBASE_SERVER_CONFIG'] || '';
} else {
	FIREBASE_CLIENT_CONFIG = JSON.parse(
		(import.meta.env.VITE_FIREBASE_CLIENT_CONFIG || '').toString()
	);
	FIREBASE_SERVER_CONFIG = (import.meta.env.VITE_FIREBASE_SERVER_CONFIG || '').toString();
}
