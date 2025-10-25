# 🛠️ あけマ セットアップガイド

このガイドでは、「あけマ」を初めてセットアップする方向けに、詳細な手順を説明します。

---

## 目次

1. [環境の準備](#1-環境の準備)
2. [Firebaseプロジェクトの作成](#2-firebaseプロジェクトの作成)
3. [Firebase設定の取得と適用](#3-firebase設定の取得と適用)
4. [Firestoreの設定](#4-firestoreの設定)
5. [Firebase Storageの設定](#5-firebase-storageの設定)
6. [ローカルでの動作確認](#6-ローカルでの動作確認)
7. [本番環境へのデプロイ](#7-本番環境へのデプロイ)
8. [トラブルシューティング](#8-トラブルシューティング)

---

## 1. 環境の準備

### 必要なもの

- **Node.js** (v14以上): [https://nodejs.org/](https://nodejs.org/)
- **Git**: [https://git-scm.com/](https://git-scm.com/)
- **Googleアカウント**: Firebase利用のため
- **テキストエディタ**: VS Code等

### Node.jsのインストール確認

```bash
node --version
npm --version
```

両方のコマンドでバージョンが表示されればOKです。

### Firebase CLIのインストール

```bash
npm install -g firebase-tools
```

インストール確認：

```bash
firebase --version
```

---

## 2. Firebaseプロジェクトの作成

### ステップ1: Firebase Consoleにアクセス

1. ブラウザで [https://console.firebase.google.com/](https://console.firebase.google.com/) を開く
2. Googleアカウントでログイン

### ステップ2: 新規プロジェクトを作成

1. 「プロジェクトを追加」をクリック
2. プロジェクト名を入力（例: `akema-mvp`）
   - プロジェクトIDが自動生成されます（後で使用）
3. 「続行」をクリック

### ステップ3: Google アナリティクスの設定（任意）

- MVPでは不要なので、**スキップしてOK**
- 有効化する場合は、指示に従ってください

### ステップ4: プロジェクト作成完了

「プロジェクトの準備ができました」と表示されたら成功です。

---

## 3. Firebase設定の取得と適用

### ステップ1: Webアプリを登録

1. Firebaseプロジェクトのトップページで、**Webアイコン (`</>`)** をクリック
2. アプリのニックネームを入力（例: `Ake-ma Web`）
3. 「Firebase Hostingも設定する」は**チェック**
4. 「アプリを登録」をクリック

### ステップ2: 設定情報をコピー

画面に以下のような情報が表示されます：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "akema-mvp.firebaseapp.com",
  projectId: "akema-mvp",
  storageBucket: "akema-mvp.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

この情報を**メモ帳などにコピー**しておきます。

### ステップ3: プロジェクトのクローン

```bash
# GitHubからクローン（または自分のリポジトリ）
git clone https://github.com/YOUR_USERNAME/Ake-ma.git
cd Ake-ma
```

### ステップ4: `.firebaserc` を編集

`.firebaserc` ファイルを開いて、プロジェクトIDを設定：

```json
{
  "projects": {
    "default": "akema-mvp"  ← あなたのプロジェクトIDに変更
  }
}
```

### ステップ5: `public/js/firebase-config.js` を編集

`public/js/firebase-config.js` を開いて、ステップ2でコピーした情報を貼り付け：

```javascript
const firebaseConfig = {
    apiKey: "あなたのAPIキー",
    authDomain: "あなたのプロジェクトID.firebaseapp.com",
    projectId: "あなたのプロジェクトID",
    storageBucket: "あなたのプロジェクトID.appspot.com",
    messagingSenderId: "あなたのメッセージング送信者ID",
    appId: "あなたのアプリID"
};
```

---

## 4. Firestoreの設定

### ステップ1: Firestoreの有効化

1. Firebase Consoleで「Firestore Database」を選択
2. 「データベースの作成」をクリック
3. **「本番環境モードで開始」**を選択
   - セキュリティルールは後でデプロイで上書きします
4. ロケーションを選択
   - 推奨: **`asia-northeast1`** (東京)
5. 「有効にする」をクリック

数分待つとFirestoreが有効化されます。

### ステップ2: セキュリティルールのデプロイ

ローカルのターミナルで：

```bash
# Firebaseにログイン
firebase login

# セキュリティルールをデプロイ
firebase deploy --only firestore:rules
```

成功すると、Firestoreのルールが適用されます。

---

## 5. Firebase Storageの設定

### ステップ1: Storageの有効化

1. Firebase Consoleで「Storage」を選択
2. 「始める」をクリック
3. セキュリティルールは**デフォルトのまま**でOK
   - 後でデプロイで上書きします
4. ロケーションを選択
   - **Firestoreと同じロケーション**を選択
5. 「完了」をクリック

### ステップ2: セキュリティルールのデプロイ

```bash
firebase deploy --only storage:rules
```

---

## 6. ローカルでの動作確認

### ステップ1: ローカルサーバーを起動

```bash
firebase serve
```

以下のようなメッセージが表示されます：

```
✔  hosting: Local server: http://localhost:5000
```

### ステップ2: ブラウザで確認

ブラウザで `http://localhost:5000` にアクセスします。

### ステップ3: 動作テスト

1. **ギフト作成のテスト**:
   - トップページで「テキスト」を選択
   - メッセージを入力（例: 「テスト」）
   - 「ラッピングする」をクリック
   - URLが生成されることを確認

2. **開封のテスト**:
   - 生成されたURLをコピー
   - 新しいタブで開く
   - スクラッチ機能が動作することを確認

### エラーが出る場合

- ブラウザの**開発者ツール（F12）のConsole**を確認
- Firebaseの設定が正しいか確認
- Firestoreとstorageが有効化されているか確認

---

## 7. 本番環境へのデプロイ

### ステップ1: すべてをデプロイ

```bash
firebase deploy
```

### ステップ2: デプロイ完了

成功すると、以下のようなメッセージが表示されます：

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/akema-mvp/overview
Hosting URL: https://akema-mvp.web.app
```

### ステップ3: 本番環境で確認

表示された `Hosting URL` をブラウザで開いて、動作確認します。

---

## 8. トラブルシューティング

### Q1: `firebase login` でログインできない

**解決策**:
```bash
firebase login --reauth
```

### Q2: デプロイ時に権限エラーが出る

**解決策**:
- Firebase Consoleでプロジェクトの権限を確認
- 正しいGoogleアカウントでログインしているか確認

### Q3: ギフト作成時にエラーが出る

**原因**:
- Firestoreが有効化されていない
- セキュリティルールが正しくデプロイされていない

**解決策**:
```bash
firebase deploy --only firestore:rules
```

### Q4: 画像アップロードが失敗する

**原因**:
- Storageが有効化されていない
- セキュリティルールが正しくデプロイされていない

**解決策**:
```bash
firebase deploy --only storage:rules
```

### Q5: ローカルで動作するが、デプロイ後に動かない

**原因**:
- `firebase-config.js` の設定が間違っている
- FirestoreやStorageのルールが正しくない

**解決策**:
- ブラウザの開発者ツール（Console）でエラーを確認
- Firebase Consoleでルールを確認

---

## 次のステップ

セットアップが完了したら：

1. ✅ 実際にギフトを作成して、友人に送ってみる
2. ✅ フィードバックを集める
3. ✅ 改善点をリストアップ
4. ✅ 次のフェーズの開発を計画

---

**おめでとうございます！あけマのセットアップが完了しました！** 🎉
