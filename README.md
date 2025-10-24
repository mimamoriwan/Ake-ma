# 🎁 あけマ (Ake-ma)

**デジタルコンテンツに「開封のワクワク感」をプラスするWebサービス**

テキスト、画像、URLを、インタラクティブな「手で剥がしていく」体験（スクラッチカードのような）でラッピングし、専用URLとして送れるサービスです。

---

## 📋 目次

- [コンセプト](#コンセプト)
- [フェーズ1 (MVP) の機能](#フェーズ1-mvp-の機能)
- [技術スタック](#技術スタック)
- [セットアップ手順](#セットアップ手順)
- [ファイル構成](#ファイル構成)
- [開発ロードマップ](#開発ロードマップ)

---

## 💡 コンセプト

「あけマ」は、デジタルギフトに**開封体験**を加えることで、送り手と受け手の間により深い感情的なつながりを生み出します。

### 対象ユースケース（フェーズ1）

✅ **OK例**:
- 自作の「肩たたき券」「今度ご飯おごる券」
- サロンや飲食店で使える「割引クーポン」
- イベントの招待状URL
- ZoomのURL
- ジョーク画像やメッセージ

⚠️ **NG例（フェーズ2以降で検討）**:
- Amazonギフト券のコード
- その他金銭的価値のあるコード

---

## ⚡ フェーズ1 (MVP) の機能

### 送り主 (Sender) の機能
1. **種別選択**: テキスト / 画像 / URLから選択
2. **内容入力**:
   - テキスト: 最大500文字
   - 画像: 最大5MBの画像ファイル
   - URL: 任意のWebページURL
3. **URL生成**: ユニークなギフトURLを発行
4. **共有**: LINEやメールで簡単に共有

### 受け取り主 (Recipient) の機能
1. **URLアクセス**: ブラウザで開くだけ（アプリ不要）
2. **スクラッチ体験**: 指やマウスで画面をこすって開封
3. **進捗表示**: 削れた割合をリアルタイム表示
4. **自動完了**: 70%以上削れると自動的に完全表示

---

## 🛠️ 技術スタック

- **フロントエンド**:
  - HTML5, CSS3, Vanilla JavaScript
  - HTML Canvas（スクラッチカード機能）

- **バックエンド**:
  - Firebase Firestore（データ保存）
  - Firebase Storage（画像保存）
  - Firebase Hosting（ホスティング）

- **特徴**:
  - フレームワーク不要のシンプルな構成
  - PWA対応可能
  - サーバー管理不要

---

## 🚀 セットアップ手順

### 1. 前提条件

- Node.js（v14以上）
- Googleアカウント
- Git

### 2. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: `akema-mvp`）
4. Google アナリティクスは任意（不要ならスキップ）
5. プロジェクトを作成

### 3. Firebase設定の取得

1. Firebase Consoleで、プロジェクトの設定（歯車アイコン）を開く
2. 「マイアプリ」セクションで「ウェブアプリを追加」を選択
3. アプリのニックネーム（例: `Ake-ma Web`）を入力
4. 「アプリを登録」をクリック
5. 表示される設定情報（`firebaseConfig`）をコピー

### 4. プロジェクトのクローンと設定

```bash
# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/Ake-ma.git
cd Ake-ma

# Firebase CLIをインストール（初回のみ）
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# Firebaseプロジェクトを選択
firebase use --add
# プロンプトでプロジェクトIDを選択し、エイリアスを "default" に設定
```

### 5. 設定ファイルの更新

#### a. `.firebaserc` を更新

```json
{
  "projects": {
    "default": "あなたのプロジェクトID"
  }
}
```

#### b. `public/js/firebase-config.js` を更新

ステップ3で取得した設定情報を貼り付けます：

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

### 6. Firestoreの有効化

1. Firebase Consoleで「Firestore Database」を選択
2. 「データベースを作成」をクリック
3. **本番環境モード**を選択（セキュリティルールは後で設定）
4. ロケーションを選択（推奨: `asia-northeast1` - 東京）

### 7. Firebase Storageの有効化

1. Firebase Consoleで「Storage」を選択
2. 「始める」をクリック
3. セキュリティルールはデフォルトでOK（後でデプロイ時に上書き）
4. ロケーションを選択（Firestoreと同じ）

### 8. セキュリティルールのデプロイ

```bash
# Firestoreとストレージのルールをデプロイ
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### 9. ローカルで動作確認

```bash
# ローカルサーバーを起動
firebase serve

# ブラウザで http://localhost:5000 にアクセス
```

### 10. 本番環境へデプロイ

```bash
# すべてをデプロイ
firebase deploy

# デプロイ後、表示されるURLでアクセス可能
# 例: https://あなたのプロジェクトID.web.app
```

---

## 📁 ファイル構成

```
Ake-ma/
├── public/                      # Firebase Hosting用のルート
│   ├── index.html               # トップページ（送信者用）
│   ├── gift.html                # ギフト開封ページ（受信者用）
│   ├── css/
│   │   └── style.css            # スタイル
│   ├── js/
│   │   ├── create.js            # ギフト作成ロジック
│   │   ├── scratch.js           # スクラッチカード機能
│   │   └── firebase-config.js   # Firebase設定
│   └── images/
│       └── (将来的に画像素材を配置)
├── firebase.json                # Firebase設定
├── .firebaserc                  # Firebaseプロジェクト情報
├── firestore.rules              # Firestoreセキュリティルール
├── firestore.indexes.json       # Firestoreインデックス
├── storage.rules                # Storageセキュリティルール
├── .gitignore                   # Git無視ファイル
└── README.md                    # このファイル
```

---

## 🎨 主要機能の実装詳細

### スクラッチカード機能

`public/js/scratch.js` で実装されています。

- **HTML5 Canvas**を使用
- **タッチ＆マウス**の両方に対応
- **進捗率の計算**: ピクセル単位で削れた部分を計算
- **自動完了**: 70%以上削れると自動的に全体表示

### セキュリティ

#### Firestoreルール (`firestore.rules`)
- ギフトの作成: 誰でも可能（データ検証あり）
- ギフトの読み取り: 誰でも可能
- 更新・削除: 禁止

#### Storageルール (`storage.rules`)
- 画像アップロード: 5MB以下、画像形式のみ
- 画像読み取り: 誰でも可能
- 更新・削除: 禁止

---

## 🗺️ 開発ロードマップ

### ✅ フェーズ1: MVP（現在）
- [x] 基本的なギフト作成・開封機能
- [x] スクラッチカード体験
- [x] テキスト/画像/URL対応
- [ ] ローカルでの動作確認
- [ ] 初回デプロイ

### 🔄 フェーズ1.5: 改善
- [ ] PWA対応（Service Worker）
- [ ] ギフトの有効期限設定
- [ ] アクセス解析の追加
- [ ] ギフトデザインのカスタマイズ
- [ ] スクラッチ面のテクスチャ選択

### 🚀 フェーズ2: 機能拡張
- [ ] ユーザー認証（送信履歴管理）
- [ ] ギフトのプレビュー機能
- [ ] 複数のスクラッチパターン
- [ ] 音声メッセージ対応
- [ ] アニメーション効果の追加

### 💎 フェーズ3: 収益化
- [ ] プレミアム機能（カスタムデザイン等）
- [ ] Amazonギフト券などの対応（アプリ化）
- [ ] 企業向けAPI提供

---

## 🤝 貢献

このプロジェクトはMVPフェーズです。バグ報告や機能提案は Issues にお願いします。

---

## 📄 ライセンス

MIT License

---

## 📧 お問い合わせ

質問や提案がある場合は、Issues またはメールでご連絡ください。

---

**🎁 あけマで、デジタルギフトに感動を！**
