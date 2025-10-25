// スクラッチカード機能
(function() {
  'use strict';

  console.log('[Scratch] スクリプト読み込み開始');

  // DOM読み込み完了後に実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('[Scratch] DOMContentLoaded イベント発火');

    // Canvas要素を取得
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) {
      console.error('[Scratch] Canvas要素が見つかりません');
      return;
    }
    console.log('[Scratch] Canvas要素を取得:', canvas);

    // 2Dコンテキストを取得
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('[Scratch] 2Dコンテキストを取得できません');
      return;
    }
    console.log('[Scratch] 2Dコンテキストを取得');

    // スクラッチカードの状態
    let isScratching = false;
    let scratchedPixels = 0;
    let totalPixels = 0;

    // Canvasのサイズを設定
    function setupCanvas() {
      const container = canvas.parentElement;
      if (!container) {
        console.error('[Scratch] 親要素が見つかりません');
        return;
      }

      // 親要素のサイズを取得
      const rect = container.getBoundingClientRect();
      console.log('[Scratch] 親要素のサイズ:', rect.width, 'x', rect.height);

      // Canvasのサイズを設定（デバイスピクセル比を考慮）
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // CSS上のサイズも設定
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';

      // コンテキストをスケーリング
      ctx.scale(dpr, dpr);

      console.log('[Scratch] Canvasサイズ設定完了:', canvas.width, 'x', canvas.height);
      console.log('[Scratch] CSSサイズ:', rect.width, 'x', rect.height);
      console.log('[Scratch] デバイスピクセル比:', dpr);

      // 総ピクセル数を計算
      totalPixels = canvas.width * canvas.height;
      console.log('[Scratch] 総ピクセル数:', totalPixels);
    }

    // グレーの四角形を描画してスクラッチ面を作成
    function drawScratchSurface() {
      console.log('[Scratch] スクラッチ面を描画開始');

      const rect = canvas.getBoundingClientRect();

      // グレーの四角形を描画
      ctx.fillStyle = '#999999';
      ctx.fillRect(0, 0, rect.width, rect.height);

      console.log('[Scratch] グレーの四角形を描画:', rect.width, 'x', rect.height);

      // テキストを描画（オプション）
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('削ってね！', rect.width / 2, rect.height / 2);

      console.log('[Scratch] テキストを描画');
    }

    // スクラッチ処理
    function scratch(x, y) {
      // destination-outで削除
      ctx.globalCompositeOperation = 'destination-out';

      // 円形で削る
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();

      // 元に戻す
      ctx.globalCompositeOperation = 'source-over';
    }

    // 削られた割合を計算
    function calculateScratchedPercentage() {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      let transparentPixels = 0;

      // アルファ値が0のピクセルをカウント
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
          transparentPixels++;
        }
      }

      const percentage = (transparentPixels / totalPixels) * 100;
      return percentage;
    }

    // 全部削る
    function revealAll() {
      console.log('[Scratch] 全体を表示');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.pointerEvents = 'none';
    }

    // マウスイベント
    canvas.addEventListener('mousedown', function(e) {
      isScratching = true;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      scratch(x, y);
    });

    canvas.addEventListener('mousemove', function(e) {
      if (!isScratching) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      scratch(x, y);
    });

    canvas.addEventListener('mouseup', function() {
      if (!isScratching) return;
      isScratching = false;

      // 削られた割合をチェック
      const percentage = calculateScratchedPercentage();
      console.log('[Scratch] 削られた割合:', percentage.toFixed(2) + '%');

      if (percentage > 50) {
        revealAll();
      }
    });

    // タッチイベント
    canvas.addEventListener('touchstart', function(e) {
      e.preventDefault();
      isScratching = true;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      scratch(x, y);
    });

    canvas.addEventListener('touchmove', function(e) {
      e.preventDefault();
      if (!isScratching) return;

      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      scratch(x, y);
    });

    canvas.addEventListener('touchend', function(e) {
      e.preventDefault();
      if (!isScratching) return;
      isScratching = false;

      // 削られた割合をチェック
      const percentage = calculateScratchedPercentage();
      console.log('[Scratch] 削られた割合:', percentage.toFixed(2) + '%');

      if (percentage > 50) {
        revealAll();
      }
    });

    // 初期化
    setupCanvas();
    drawScratchSurface();

    console.log('[Scratch] 初期化完了');

    // リサイズ時に再描画
    window.addEventListener('resize', function() {
      console.log('[Scratch] ウィンドウリサイズ');
      setupCanvas();
      drawScratchSurface();
    });
  });

  console.log('[Scratch] スクリプト読み込み完了');
})();
