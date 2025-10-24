// Firebase設定
// TODO: Firebase Consoleで取得した設定情報に置き換えてください
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase初期化
firebase.initializeApp(firebaseConfig);

// Firestoreインスタンス
const db = firebase.firestore();

// Storageインスタンス
const storage = firebase.storage();

// コレクション名
const GIFTS_COLLECTION = 'gifts';
