import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyBiz_s2hx7wSddbDturqTOkqpe5dPTkBnk',
	authDomain: 'day-planner-54991.firebaseapp.com',
	projectId: 'day-planner-54991',
	storageBucket: 'day-planner-54991.appspot.com',
	messagingSenderId: '613586001308',
	appId: '1:613586001308:web:8b5e95c1f12cd1b1cefc59',
	measurementId: 'G-GXVLWWL69J',
};

class Firebase {
	constructor() {
		app.initializeApp(firebaseConfig);
		this.auth = app.auth();
		// this.db = app.database(); Later add database
	}

	/*** Authentication  ***/
	doCreateUserWithEmailAndPassword = (email, password) =>
		this.auth.createUserWithEmailAndPassword(email, password);

	doSignInWithEmailAndPassword = (email, password) =>
		this.auth.signInWithEmailAndPassword(email, password);

	doSignOut = () => this.auth.signOut();

	doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);
}

export default Firebase;
