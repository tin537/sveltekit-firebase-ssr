import firebaseAdmin from 'firebase-admin';
import { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } from './constants';
import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
const { credential, auth, firestore } = firebaseAdmin;
const privateKey = FIREBASE_PRIVATE_KEY;
const clientEmail = FIREBASE_CLIENT_EMAIL;
const projectId = FIREBASE_PROJECT_ID;

let initialized = false;
function initializeFirebase() {
	if (initialized) return;
	initialized = true;
	firebaseAdmin.initializeApp({
		credential: credential.cert({
			privateKey: privateKey,
			clientEmail,
			projectId
		}),
		databaseURL: `https://${projectId}.firebaseio.com`
	});
}

export async function decodeToken(token: string): Promise<DecodedIdToken | null> {
	if (!token) return null;
	try {
		initializeFirebase();
		return await auth().verifyIdToken(token);
	} catch (err) {
		return null;
	}
}

export async function getDocuments<T>(collectionPath: string, uid: string): Promise<Array<T>> {
	if (!uid) return [];
	initializeFirebase();
	const db = firestore();
	const querySnapshot = await db.collection(collectionPath).where('uid', '==', uid).get();
	let list = [];
	querySnapshot.forEach((doc) => {
		const document = doc.data();
		document.id = doc.id;
		list.push(document);
	});
	return list;
}

export async function createDocument<T>(collectionPath: string, uid: string): Promise<T> {
	if (!uid) return null;
	initializeFirebase();
	const db = firebaseAdmin.firestore();
	const doc = await (await db.collection(collectionPath).add({ uid })).get();

	let document = null;
	document = doc.data();
	document.id = doc.id;
	return document;
}