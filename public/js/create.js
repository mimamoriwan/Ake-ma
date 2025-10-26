// Firebase参照
const db = firebase.firestore();
const storage = firebase.storage();
const GIFTS_COLLECTION = 'gifts';

// ギフト作成ページのロジック

// 状態管理
let selectedType = null;
let uploadedImage = null;

// DOM要素
const elements = {
    // ステップ
    step1: document.getElementById('step1'),
    step2: document.getElementById('step2'),
    step3: document.getElementById('step3'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),

    // 入力エリア
    inputText: document.getElementById('input-text'),
    inputImage: document.getElementById('input-image'),
    inputUrl: document.getElementById('input-url'),

    // フォーム要素
    textContent: document.getElementById('textContent'),
    imageFile: document.getElementById('imageFile'),
    urlContent: document.getElementById('urlContent'),
    uploadBox: document.getElementById('uploadBox'),
    imagePreview: document.getElementById('imagePreview'),
    previewImg: document.getElementById('previewImg'),

    // ボタン
    btnBack: document.getElementById('btnBack'),
    btnWrap: document.getElementById('btnWrap'),
    btnCopy: document.getElementById('btnCopy'),
    btnShareLine: document.getElementById('btnShareLine'),
    btnShareMail: document.getElementById('btnShareMail'),
    btnCreateNew: document.getElementById('btnCreateNew'),
    removeImage: document.getElementById('removeImage'),
    btnDismissError: document.getElementById('btnDismissError'),

    // 結果
    giftUrl: document.getElementById('giftUrl'),
    errorMessage: document.querySelector('.error-message')
};

// =====================================
// ステップ1: タイプ選択
// =====================================
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        selectedType = btn.dataset.type;

        // アクティブ状態を更新
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // ステップ2へ進む
        showStep2();
    });
});

function showStep2() {
    elements.step1.classList.add('hidden');
    elements.step2.classList.remove('hidden');

    // 入力エリアを切り替え
    elements.inputText.classList.add('hidden');
    elements.inputImage.classList.add('hidden');
    elements.inputUrl.classList.add('hidden');

    if (selectedType === 'text') {
        elements.inputText.classList.remove('hidden');
        elements.textContent.focus();
    } else if (selectedType === 'image') {
        elements.inputImage.classList.remove('hidden');
    } else if (selectedType === 'url') {
        elements.inputUrl.classList.remove('hidden');
        elements.urlContent.focus();
    }

    validateInput();
}

// =====================================
// ステップ2: 入力とバリデーション
// =====================================

// テキスト入力の文字数カウント
elements.textContent.addEventListener('input', () => {
    const length = elements.textContent.value.length;
    document.querySelector('.char-count').textContent = `${length} / 500文字`;
    validateInput();
});

// 画像アップロード
elements.imageFile.addEventListener('change', handleImageUpload);

// ドラッグ&ドロップ
elements.uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.uploadBox.style.borderColor = 'var(--primary-color)';
});

elements.uploadBox.addEventListener('dragleave', () => {
    elements.uploadBox.style.borderColor = 'var(--border-color)';
});

elements.uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.uploadBox.style.borderColor = 'var(--border-color)';

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        elements.imageFile.files = e.dataTransfer.files;
        handleImageUpload();
    }
});

function handleImageUpload() {
    const file = elements.imageFile.files[0];
    if (!file) return;

    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
        showError('画像ファイルは5MB以下にしてください');
        return;
    }

    // プレビュー表示
    const reader = new FileReader();
    reader.onload = (e) => {
        elements.previewImg.src = e.target.result;
        elements.uploadBox.classList.add('hidden');
        elements.imagePreview.classList.remove('hidden');
        uploadedImage = file;
        validateInput();
    };
    reader.readAsDataURL(file);
}

// 画像削除
elements.removeImage.addEventListener('click', () => {
    elements.imageFile.value = '';
    elements.uploadBox.classList.remove('hidden');
    elements.imagePreview.classList.add('hidden');
    uploadedImage = null;
    validateInput();
});

// URL入力
elements.urlContent.addEventListener('input', validateInput);

// 入力バリデーション
function validateInput() {
    let isValid = false;

    if (selectedType === 'text') {
        isValid = elements.textContent.value.trim().length > 0;
    } else if (selectedType === 'image') {
        isValid = uploadedImage !== null;
    } else if (selectedType === 'url') {
        const urlPattern = /^https?:\/\/.+/;
        isValid = urlPattern.test(elements.urlContent.value.trim());
    }

    elements.btnWrap.disabled = !isValid;
}

// 戻るボタン
elements.btnBack.addEventListener('click', () => {
    elements.step2.classList.add('hidden');
    elements.step1.classList.remove('hidden');
    resetForm();
});

function resetForm() {
    elements.textContent.value = '';
    elements.urlContent.value = '';
    elements.imageFile.value = '';
    uploadedImage = null;
    elements.uploadBox.classList.remove('hidden');
    elements.imagePreview.classList.add('hidden');
    document.querySelector('.char-count').textContent = '0 / 500文字';
}

// =====================================
// ステップ3: ギフト作成
// =====================================
elements.btnWrap.addEventListener('click', createGift);

async function createGift() {
    try {
        // ローディング表示
        elements.step2.classList.add('hidden');
        elements.loading.classList.remove('hidden');

        let giftData = {
            type: selectedType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            opened: false
        };

        // タイプ別のデータ処理
        if (selectedType === 'text') {
            giftData.content = elements.textContent.value.trim();
        } else if (selectedType === 'image') {
            // 画像をStorageにアップロード
            const imageUrl = await uploadImage(uploadedImage);
            giftData.imageUrl = imageUrl;
        } else if (selectedType === 'url') {
            giftData.url = elements.urlContent.value.trim();
        }

        // Firestoreに保存
        const docRef = await db.collection(GIFTS_COLLECTION).add(giftData);

        // URLを生成
        const giftUrl = `${window.location.origin}/gift.html?id=${docRef.id}`;
        elements.giftUrl.value = giftUrl;

        // ステップ3を表示
        elements.loading.classList.add('hidden');
        elements.step3.classList.remove('hidden');

    } catch (error) {
        console.error('Error creating gift:', error);
        showError('ギフトの作成に失敗しました。もう一度お試しください。');
    }
}

// 画像をStorageにアップロード
async function uploadImage(file) {
    const timestamp = Date.now();
    const filename = `images/${timestamp}_${file.name}`;
    const storageRef = storage.ref(filename);

    await storageRef.put(file);
    const downloadUrl = await storageRef.getDownloadURL();

    return downloadUrl;
}

// =====================================
// 結果画面のアクション
// =====================================

// URLコピー
elements.btnCopy.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(elements.giftUrl.value);
        elements.btnCopy.textContent = '✓ コピーしました';
        setTimeout(() => {
            elements.btnCopy.textContent = 'コピー';
        }, 2000);
    } catch (error) {
        // フォールバック
        elements.giftUrl.select();
        document.execCommand('copy');
        elements.btnCopy.textContent = '✓ コピーしました';
        setTimeout(() => {
            elements.btnCopy.textContent = 'コピー';
        }, 2000);
    }
});

// LINE共有
elements.btnShareLine.addEventListener('click', () => {
    const text = 'ギフトが届いています！';
    const url = elements.giftUrl.value;
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text + '\n' + url)}`, '_blank');
});

// メール共有
elements.btnShareMail.addEventListener('click', () => {
    const subject = 'ギフトが届いています';
    const body = `あなたへのギフトです！\n\n${elements.giftUrl.value}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

// 新しいギフトを作る
elements.btnCreateNew.addEventListener('click', () => {
    elements.step3.classList.add('hidden');
    elements.step1.classList.remove('hidden');
    selectedType = null;
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    resetForm();
});

// =====================================
// エラー処理
// =====================================
function showError(message) {
    elements.loading.classList.add('hidden');
    elements.step2.classList.add('hidden');
    elements.errorMessage.textContent = message;
    elements.error.classList.remove('hidden');
}

elements.btnDismissError.addEventListener('click', () => {
    elements.error.classList.add('hidden');
    elements.step2.classList.remove('hidden');
});