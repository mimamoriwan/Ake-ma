// スクラッチカード機能

// DOM要素
const elements = {
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    errorMessage: document.querySelector('.error-message'),
    scratchContainer: document.getElementById('scratchContainer'),
    openedContainer: document.getElementById('openedContainer'),
    canvas: document.getElementById('scratchCanvas'),
    giftContent: document.getElementById('giftContent'),
    finalContent: document.getElementById('finalContent'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    hint: document.getElementById('hint')
};

// Canvas設定
let ctx = null;
let isDrawing = false;
let scratchedPixels = 0;
let totalPixels = 0;
let giftData = null;

// ページ読み込み時にギフトを取得
window.addEventListener('DOMContentLoaded', loadGift);

async function loadGift() {
    try {
        // URLからギフトIDを取得
        const urlParams = new URLSearchParams(window.location.search);
        const giftId = urlParams.get('id');

        if (!giftId) {
            showError('ギフトが見つかりません');
            return;
        }

        // Firestoreからギフトデータを取得
        const docRef = db.collection(GIFTS_COLLECTION).doc(giftId);
        const doc = await docRef.get();

        if (!doc.exists) {
            showError('このギフトは存在しないか、削除されました');
            return;
        }

        giftData = doc.data();

        // ギフトの中身を表示
        displayGiftContent();

        // スクラッチカードを初期化
        initScratchCard();

        // ローディングを非表示、スクラッチ画面を表示
        elements.loading.classList.add('hidden');
        elements.scratchContainer.classList.remove('hidden');

    } catch (error) {
        console.error('Error loading gift:', error);
        showError('ギフトの読み込みに失敗しました');
    }
}

// ギフトの中身を表示
function displayGiftContent() {
    let contentHtml = '';

    if (giftData.type === 'text') {
        contentHtml = `<p>${escapeHtml(giftData.content)}</p>`;
    } else if (giftData.type === 'image') {
        contentHtml = `<img src="${giftData.imageUrl}" alt="Gift Image">`;
    } else if (giftData.type === 'url') {
        contentHtml = `<a href="${giftData.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(giftData.url)}</a>`;
    }

    elements.giftContent.innerHTML = contentHtml;
    elements.finalContent.innerHTML = contentHtml;
}

// HTMLエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =====================================
// スクラッチカード初期化
// =====================================
function initScratchCard() {
    const canvas = elements.canvas;
    const content = elements.giftContent;

    // Canvasのサイズをコンテンツに合わせる
    const rect = content.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx = canvas.getContext('2d');

    // スクラッチ面を描画
    drawScratchSurface();

    // イベントリスナーを設定
    setupEventListeners();

    // 総ピクセル数を計算
    totalPixels = canvas.width * canvas.height;
}

// スクラッチ面を描画
function drawScratchSurface() {
    // グラデーション背景
    const gradient = ctx.createLinearGradient(0, 0, elements.canvas.width, elements.canvas.height);
    gradient.addColorStop(0, '#c0c0c0');
    gradient.addColorStop(0.5, '#e8e8e8');
    gradient.addColorStop(1, '#c0c0c0');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);

    // テクスチャパターン（銀色のスクラッチカード風）
    for (let i = 0; i < 200; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
        ctx.fillRect(
            Math.random() * elements.canvas.width,
            Math.random() * elements.canvas.height,
            Math.random() * 50,
            Math.random() * 2
        );
    }

    // 中央にテキスト
    ctx.fillStyle = '#666';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎁', elements.canvas.width / 2, elements.canvas.height / 2 - 30);
    ctx.font = '18px sans-serif';
    ctx.fillText('こすって開封', elements.canvas.width / 2, elements.canvas.height / 2 + 20);
}

// =====================================
// イベントリスナー設定
// =====================================
function setupEventListeners() {
    const canvas = elements.canvas;

    // マウスイベント（PC）
    canvas.addEventListener('mousedown', startScratching);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', stopScratching);
    canvas.addEventListener('mouseleave', stopScratching);

    // タッチイベント（スマホ）
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startScratching(e);
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        scratch(e);
    });
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopScratching(e);
    });
}

function startScratching(e) {
    isDrawing = true;
    elements.hint.style.opacity = '0';
}

function stopScratching(e) {
    isDrawing = false;
}

function scratch(e) {
    if (!isDrawing) return;

    // 座標を取得
    const rect = elements.canvas.getBoundingClientRect();
    let x, y;

    if (e.type.startsWith('touch')) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }

    // スクラッチエリアを消去
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // 進捗を更新
    updateProgress();
}

// =====================================
// 進捗計算
// =====================================
function updateProgress() {
    // 画像データを取得
    const imageData = ctx.getImageData(0, 0, elements.canvas.width, elements.canvas.height);
    const pixels = imageData.data;

    // 透明なピクセル数をカウント
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
            transparent++;
        }
    }

    // 進捗率を計算
    const progress = Math.floor((transparent / totalPixels) * 100);

    // UIを更新
    elements.progressFill.style.width = `${progress}%`;
    elements.progressText.textContent = `${progress}%`;

    // 70%以上削れたら自動的に完全表示
    if (progress >= 70 && !elements.scratchContainer.classList.contains('completed')) {
        completeScratching();
    }
}

// =====================================
// スクラッチ完了
// =====================================
function completeScratching() {
    elements.scratchContainer.classList.add('completed');

    // Canvasをフェードアウト
    elements.canvas.style.transition = 'opacity 0.5s';
    elements.canvas.style.opacity = '0';

    setTimeout(() => {
        // スクラッチ画面を非表示、完了画面を表示
        elements.scratchContainer.classList.add('hidden');
        elements.openedContainer.classList.remove('hidden');
    }, 500);
}

// =====================================
// エラー表示
// =====================================
function showError(message) {
    elements.loading.classList.add('hidden');
    elements.errorMessage.textContent = message;
    elements.error.classList.remove('hidden');
}

// =====================================
// ウィンドウリサイズ対応
// =====================================
window.addEventListener('resize', () => {
    if (ctx && !elements.scratchContainer.classList.contains('hidden')) {
        // リサイズ時にCanvasを再初期化
        initScratchCard();
    }
});
