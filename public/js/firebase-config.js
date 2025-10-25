// Firebase設定
// TODO: Firebase Consoleで取得した設定情報に置き換えてください
const firebaseConfig = {
    apiKey: "AIzaSyBx6426tOeEUIp_2Ppg-un-N87IjSqHt3Q",
    authDomain: "akema-mvp.firebaseapp.com",
    projectId: "akema-mvp",
    storageBucket: "akema-mvp.firebasestorage.app",
    messagingSenderId: "716341891787",
    appId: "1:716341891787:web:37b09b1a643ec3f64f014e"
};

// Firebase初期化
firebase.initializeApp(firebaseConfig);

// Firestoreインスタンス
const db = firebase.firestore();

// Storageインスタンス
const storage = firebase.storage();

// コレクション名
const GIFTS_COLLECTION = 'gifts';
