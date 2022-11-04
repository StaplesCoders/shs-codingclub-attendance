import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, update, get, set } from 'firebase/database';
import { PUBLIC_FIREBASE_API } from '$env/static/public';
import { allAttendance, user, userAttendance, allUserData } from './stores';

const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_API,
	authDomain: 'shscc-attend.firebaseapp.com',
	databaseURL: 'https://shscc-attend-default-rtdb.firebaseio.com',
	projectId: 'shscc-attend',
	storageBucket: 'shscc-attend.appspot.com',
	messagingSenderId: '1061368772432',
	appId: '1:1061368772432:web:d3f89a1eb86b5bc8b45e55'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getDatabase(app);

onAuthStateChanged(auth, (u) => {
	user.set(u);
	if (u) {
		onValue(ref(db, `attendance/${u.uid}`), (snapshot) => {
			userAttendance.set(snapshot.val());
		});

		set(ref(db, `userdata/${u.uid}`), { name: u.displayName, pfp: u.photoURL });
	} else {
		userAttendance.set(null);
	}
});

export const signIn = async () => signInWithPopup(auth, provider);
export const signOut = async () => auth.signOut();

export const isAdmin = async () => {
	if (!auth.currentUser) {
		return false;
	}

	const { uid } = auth.currentUser;

	return await (await get(ref(db, `${uid}/admin`))).val();
};

export const adminSubAllAttendance = () => {
	return [
		onValue(ref(db, 'attendance'), (snapshot) => {
			allAttendance.set(snapshot.val());
		}),

		onValue(ref(db, 'userdata'), (snapshot) => {
			allUserData.set(snapshot.val());
		})
	];
};

export const logAttendance = async () => {
	if (!auth.currentUser) throw new Error('Not signed in.');

	const { uid } = auth.currentUser;
	const date = Date.now();
	const r = ref(db, `attendance/${uid}`);
	try {
		await update(r, {
			[date]: date,
			last_write: date
		});
	} catch {
		return false;
	}

	return true;
};
