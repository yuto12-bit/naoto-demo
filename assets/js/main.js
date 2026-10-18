/* ==========================================================================
   NAOTO OTAKA — main.js
   動きは5つだけ（3.10章）：ローディング / 皿のコンベア / 人物の登場 /
   作品のホバー(CSS) / ページ遷移
   全要素のスクロールフェードイン・背景のパララックス・カーソル追従・
   カウントアップ・タイプライター風の表示は入れない。
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobile = window.matchMedia('(max-width: 760px)');

  /* --------------------------------------------- 3.9 ローディング（HOMEのみ）
     皿が流れてきて署名が書かれる。3.65秒で明ける。
     「毎回見せられると邪魔」（3.10章）なので、同じセッションでは1回だけ出す。 */
  function initLoader() {
    var el = document.documentElement;
    var loader = document.querySelector('.loader');
    if (!loader) return;

    var seen = false;
    try { seen = sessionStorage.getItem('naoto.intro') === '1'; } catch (e) {}

    if (seen || reduce.matches) {          /* 2回目以降と、動きを減らす設定では出さない */
      loader.parentNode.removeChild(loader);
      el.classList.add('ready');
      return;
    }
    try { sessionStorage.setItem('naoto.intro', '1'); } catch (e) {}

    el.classList.add('loading');
    var done = false;
    function go() {
      if (done) return;
      done = true;
      el.classList.remove('loading');
      el.classList.add('ready');
    }
    var t = window.setTimeout(go, 3650);
    window.addEventListener('load', function () {
      window.clearTimeout(t);
      window.setTimeout(go, 3500);
    });
  }

  /* ------------------------------------------------------ 全画面メニュー */
  function initMenu() {
    var btn = document.querySelector('[data-menu-open]');
    var menu = document.getElementById('menu');
    if (!btn || !menu) return;
    var closeBtn = menu.querySelector('[data-menu-close]');
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
      (closeBtn || menu).focus();
    }
    function close() {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    btn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    menu.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    mobile.addEventListener('change', function (e) { if (!e.matches && !menu.hidden) close(); });
  }

  /* ------------------------------------- 3.9 人物と言葉がスクロールで登場する
     出方は1種類に統一。1回だけ発火して unobserve。出たら消えない。
     傾き・影・呼吸するアニメーションは入れない。フェードと視差だけ。 */
  function initFigures() {
    var figs = [].slice.call(document.querySelectorAll('.fg'));
    var says = [].slice.call(document.querySelectorAll('.say'));
    var all = figs.concat(says);
    if (!all.length) return;

    if (reduce.matches || !('IntersectionObserver' in window)) {
      all.forEach(function (el) { el.classList.add('on'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('on');
        io.unobserve(en.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -12% 0px' });
    all.forEach(function (el) { io.observe(el); });

    initParallax(figs);
  }

  /* 視差は人物だけ。背景（街）は fixed で動かさない（3.10章の「背景のパララックス」は入れない）
     振れ幅は体の高さから出す。大きい＝手前の体ほど速く動く */
  function initParallax(figs) {
    var garden = document.getElementById('garden');
    if (!garden || !figs.length || reduce.matches) return;

    var meta = figs.map(function (el) {
      var h = parseFloat(getComputedStyle(el).getPropertyValue('--h')) || 220;
      return { el: el, k: (h - 170) / 140 * 26 + 6 };   /* 6〜32px */
    });
    var ticking = false;

    function update() {
      ticking = false;
      var r = garden.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom < -200 || r.top > vh + 200) return;
      meta.forEach(function (m) {
        var b = m.el.getBoundingClientRect();
        var t = (b.top + b.height / 2 - vh / 2) / vh;   /* -1〜1 */
        m.el.style.setProperty('--px', (-t * m.k).toFixed(1) + 'px');
      });
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------------------------------------------- 3.8A 皿のコンベア【主役】
     皿は真横から見た手書き画像。3D回転させず translateX で真横に流す。
     操作は3通り：ホイール / ドラッグ / 自動ドリフト。 */
  function initConveyor() {
    var lane = document.getElementById('lane');
    if (!lane) return;

    var x = 0, half = 0, raf = null, down = false, startX = 0, startPos = 0;

    function measure() { half = lane.scrollWidth / 2; }
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);   // 画像読み込み後に幅が変わる

    function apply() {
      if (half) x = ((x % half) + half) % half;   // 2周分並べて無限ループ
      lane.style.transform = 'translateX(' + (-x) + 'px)';
    }

    /* ホイール：縦横どちらの回転も受ける。ページのスクロールは止めない */
    window.addEventListener('wheel', function (e) {
      var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      x += d * 0.35;
      if (!raf) raf = requestAnimationFrame(function () { raf = null; apply(); });
    }, { passive: true });

    /* ドラッグ */
    lane.addEventListener('pointerdown', function (e) {
      down = true; startX = e.clientX; startPos = x;
      try { lane.setPointerCapture(e.pointerId); } catch (err) {}
    });
    lane.addEventListener('pointermove', function (e) {
      if (!down) return;
      x = startPos - (e.clientX - startX);
      apply();
    });
    function up() { down = false; }
    lane.addEventListener('pointerup', up);
    lane.addEventListener('pointercancel', up);
    window.addEventListener('pointerup', up);     // レーンの外で離した場合
    window.addEventListener('pointercancel', up);

    /* 自動ドリフト。ドラッグ中は止める。reduce のときは動かさない */
    if (!reduce.matches) {
      (function drift() {
        if (!down) { x += 0.25; apply(); }
        requestAnimationFrame(drift);
      })();
    }
    apply();
  }

  /* --------------------------------- 3.10 ページ遷移（朱色の帯・0.4秒以内） */
  function initWipe() {
    if (reduce.matches) return;
    var wipe = document.querySelector('.wipe');
    if (!wipe) return;
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || a.target === '_blank') return;
      if (a.hostname && a.hostname !== location.hostname) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      wipe.classList.add('is-on');
      window.setTimeout(function () { location.href = a.href; }, 340);
    });
  }

  /* ------------------------------------------------------ ページトップへ */
  function initTop() {
    var link = document.querySelector('[data-top]');
    if (!link) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------- CONTACT フォーム */
  var ENDPOINT = ''; // TODO: GASのデプロイURL

  function initForm() {
    var form = document.querySelector('[data-contact]');
    if (!form) return;

    var states = {
      sending: form.querySelector('[data-state="sending"]'),
      ok: form.querySelector('[data-state="ok"]'),
      err: form.querySelector('[data-state="err"]')
    };
    var errText = form.querySelector('[data-err-text]');
    var submit = form.querySelector('.submit');

    function show(name, msg) {
      Object.keys(states).forEach(function (k) {
        if (states[k]) states[k].hidden = (k !== name);
      });
      if (name === 'err' && errText) {
        errText.textContent = msg || '送信できませんでした。時間をおいて試すか、メールでご連絡ください。';
      }
    }
    function clearState() {
      Object.keys(states).forEach(function (k) { if (states[k]) states[k].hidden = true; });
    }
    function fieldError(el, msg) {
      var box = form.querySelector('[data-err-for="' + el.name + '"]');
      if (box) box.textContent = msg || '';
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    }
    function validate() {
      var ok = true, first = null;
      ['name', 'email', 'message'].forEach(function (key) {
        var el = form.elements[key];
        if (!el) return;
        var v = el.value.trim(), msg = '';
        if (!v) msg = '入力してください。';
        else if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'メールアドレスの形式を確認してください。';
        fieldError(el, msg);
        if (msg) { ok = false; if (!first) first = el; }
      });
      if (first) first.focus();
      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // ハニーポット：ボットが埋めたら黙って中止する
      if (form.elements['_hp'] && form.elements['_hp'].value) return;

      clearState();
      if (!validate()) { show('err', '未入力または形式に誤りのある項目があります。'); return; }

      var data = {};
      new FormData(form).forEach(function (v, k) { if (k !== '_hp') data[k] = v; });
      data.page = location.href;
      data.sentAt = new Date().toISOString();

      show('sending');
      if (submit) submit.disabled = true;

      // GAS 未接続。Content-Type: text/plain でプリフライトを回避する雛形（8-4章）
      if (!ENDPOINT) {
        window.setTimeout(function () {
          if (submit) submit.disabled = false;
          show('ok');
          console.info('[NAOTO] ENDPOINT 未設定のため送信していません。送信予定の内容:', data);
        }, 900);
        return;
      }

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      }).then(function () {
        if (submit) submit.disabled = false;
        show('ok'); form.reset();
      }).catch(function (err) {
        if (submit) submit.disabled = false;
        show('err');
        console.error('[NAOTO] 送信に失敗しました', err);
      });
    });

    form.addEventListener('input', function (e) {
      var el = e.target;
      if (el.name && el.getAttribute('aria-invalid') === 'true') fieldError(el, '');
    });
  }

  function boot() { initLoader(); initMenu(); initFigures(); initConveyor(); initWipe(); initTop(); initForm(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
