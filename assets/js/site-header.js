/* 全5ページ共通のヘッダー：ハンバーガーの開閉 */
(function(){
  var btn=document.getElementById('sh-btn'),menu=document.getElementById('sh-menu');
  if(!btn||!menu)return;
  var last=null;
  function open(){
    last=document.activeElement;
    menu.hidden=false;
    /* 次の描画で開く。これで出入りがつながる */
    requestAnimationFrame(function(){ menu.classList.add('is-open'); });
    btn.setAttribute('aria-expanded','true');
    btn.setAttribute('aria-label','メニューを閉じる');
    document.documentElement.style.overflow='hidden';
    /* 最初のリンクへ焦点を当てると枠が出るので、メニューそのものへ当てる */
    menu.setAttribute('tabindex','-1');
    menu.focus({preventScroll:true});
  }
  function close(){
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-label','メニューを開く');
    document.documentElement.style.overflow='';
    /* 消えきってから隠す */
    setTimeout(function(){ if(!menu.classList.contains('is-open')) menu.hidden=true; },210);
    if(last&&last.focus)last.focus({preventScroll:true});
  }
  btn.addEventListener('click',function(){menu.hidden?open():close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden)close();});
  /* 画面が広がったら閉じる（ハンバーガーが消えるため） */
  matchMedia('(max-width:760px)').addEventListener('change',function(e){if(!e.matches&&!menu.hidden)close();});
})();

/* 最上部では透過、下へスクロールしたら紙の地を出す。戻れば透過に返す */
(function () {
  var hdr = document.querySelector('.sh');
  if (!hdr) return;
  var ON = 10, OFF = 4, tick = false;     /* 境目で点滅しないよう少しずらす */
  /* FAQ のように、文書ではなく中の入れ物が動くページがある */
  var box = document.querySelector("[data-sh-scroll]");
  function upd() {
    tick = false;
    var y = Math.max(window.pageYOffset || document.documentElement.scrollTop || 0,
                     box ? box.scrollTop : 0);
    var on = hdr.classList.contains('sh--solid');
    if (!on && y > ON) hdr.classList.add('sh--solid');
    else if (on && y < OFF) hdr.classList.remove('sh--solid');
  }
  /* 入れ物の中のスクロールも拾えるよう、捕捉段階で見る */
  document.addEventListener('scroll', function () {
    if (!tick) { tick = true; requestAnimationFrame(upd); }
  }, { passive: true, capture: true });
  addEventListener('resize', upd);
  upd();                                   /* 途中から読み込まれた場合に備える */
})();

/* 濃い面に重なっている間だけヘッダーを紙色にする。
   対象は [data-sh-dark] を付けた要素（いまは HOME の実績だけ） */
(function () {
  var hdr = document.querySelector('.sh');
  var darks = [].slice.call(document.querySelectorAll('[data-sh-dark]'));
  if (!hdr || !darks.length || !('IntersectionObserver' in window)) return;
  var io = null;
  function arm() {
    if (io) io.disconnect();
    var band = hdr.offsetHeight || 62;
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.__shOver = e.isIntersecting; });
      hdr.classList.toggle('sh--on-dark', darks.some(function (d) { return d.__shOver; }));
    }, { rootMargin: '0px 0px ' + (-(window.innerHeight - band)) + 'px 0px' });
    darks.forEach(function (d) { io.observe(d); });
  }
  arm();
  window.addEventListener('resize', arm);
})();


/* ===== ページの切り替え。行き先の名前を出し、人が歩いて横切る ===== */
(function () {
  var WAIT = 1150;                      /* 幕を見せている時間 */
  var de = document.documentElement;
  /* 去り際の場面を引き継ぐための覚え書き（行き先・人・始めた時刻） */
  var saved = null;
  try { var raw = de.getAttribute('data-sh-nav'); if (raw) saved = JSON.parse(raw); } catch (e) {}
  /* 全身が描かれていて、横から見ても形が分かる人を選んである */
  var CAST = ['fig-b-10','fig-b-09','fig-b-13','fig-b-08',
              'fig-b-11','fig-b-24','fig-a-05','fig-b-14'];
  /* ページの場所から素材までの道のり。下の階層なら1つ上がる */
  var UP = /\/(works|faq|about|contact)\//.test(location.pathname) ? '../' : '';

  function pick(n) {
    var pool = CAST.slice(), out = [];
    while (out.length < n && pool.length) {
      out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    return out;
  }
  /* 行き先。英字と日本語を組にする（メニューと同じ言い方に揃える） */
  var NAMES = {
    HOME: 'トップ', WORKS: '作品', FAQ: 'ご依頼について',
    ABOUT: '大高直人について', CONTACT: 'お問い合わせ'
  };
  function label(href) {
    try {
      var p = new URL(href, location.href).pathname;
      if (/\/works\//.test(p)) return 'WORKS';
      if (/\/faq\//.test(p)) return 'FAQ';
      if (/\/about\//.test(p)) return 'ABOUT';
      if (/\/contact\//.test(p)) return 'CONTACT';
      return 'HOME';
    } catch (e) { return 'HOME'; }
  }

  var fade = document.createElement('div');
  fade.className = 'sh-fade';
  fade.setAttribute('aria-hidden', 'true');
  var ghost = document.createElement('span');
  ghost.className = 'sh-fade__ghost';
  var mid = document.createElement('div');
  mid.className = 'sh-fade__mid';
  var name = document.createElement('p');
  name.className = 'sh-fade__name';
  var jp = document.createElement('p');
  jp.className = 'sh-fade__jp';
  mid.appendChild(name);
  mid.appendChild(jp);
  var ground = document.createElement('i');
  ground.className = 'sh-fade__ground';
  var walk = document.createElement('div');
  walk.className = 'sh-fade__walk';
  /* 引き継ぎなら去り際と同じ人。そうでなければ選び直す */
  var cast = (saved && saved.f && saved.f.length === 5) ? saved.f : pick(5);
  cast.forEach(function (f) {
    /* 横へ運ぶ箱・上下する絵・足元の影、で役割を分ける */
    var box = document.createElement('span');
    box.className = 'sh-fade__p';
    var sh = document.createElement('i');
    var im = document.createElement('img');
    im.src = UP + 'naoto-works/figures-solid/' + f + '@160w.webp';
    im.alt = '';
    im.decoding = 'async';
    box.appendChild(sh);
    box.appendChild(im);
    walk.appendChild(box);
  });
  fade.appendChild(ghost);
  fade.appendChild(mid);
  fade.appendChild(ground);
  fade.appendChild(walk);

  function attach() { if (document.body && !fade.parentNode) document.body.appendChild(fade); }

  /* 引き継ぎで入れた「動きの送り」を消して、はじめから歩かせる。
     残したままだと、次に幕を出したとき進みすぎた位置から始まってしまう */
  function resetWalk() {
    var ps = fade.querySelectorAll('.sh-fade__p');
    for (var i = 0; i < ps.length; i++) {
      ps[i].style.animationDelay = '';
      var im = ps[i].querySelector('img'), sh = ps[i].querySelector('i');
      if (im) im.style.animationDelay = '';
      if (sh) sh.style.animationDelay = '';
    }
  }
  if (document.body) attach(); else document.addEventListener('DOMContentLoaded', attach);

  /* 入ってきたら幕を上げる（戻る・進むで戻ってきたときも） */
  addEventListener('pageshow', function () {
    if (!fade.classList.contains('is-cont')) fade.classList.remove('is-on');
  });

  /* ===== 着いた先。去り際の場面をそのまま続けて、ぜんたいを一度に引く ===== */
  if (saved && de.classList.contains('sh-arrive')) {
    ghost.textContent = saved.k;
    name.textContent = saved.k;
    jp.textContent = saved.j || '';
    attach();
    /* 出入りの動きは使わない。すでに出ている状態から始める */
    fade.classList.add('is-on', 'is-cont');
    /* 人は去り際の続きから歩く。経った時間ぶんだけ動きを先へ送る */
    var el = (Date.now() - (saved.t || 0)) / 1000;
    if (el > 0 && el < 30) {
      var ps = fade.querySelectorAll('.sh-fade__p');
      for (var i = 0; i < ps.length; i++) {
        var d0 = parseFloat(getComputedStyle(ps[i]).animationDelay) || 0;
        ps[i].style.animationDelay = (d0 - el) + 's';
        var im2 = ps[i].querySelector('img'), sh2 = ps[i].querySelector('i');
        if (im2) im2.style.animationDelay = (-el) + 's';
        if (sh2) sh2.style.animationDelay = (-el) + 's';
      }
    }
    /* CSS の当て布はもう要らない。人のいる幕が同じ地で下にある */
    de.classList.remove('sh-arrive');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { fade.classList.add('is-leave'); });
    });
    setTimeout(function () {
      fade.classList.remove('is-on', 'is-cont', 'is-leave');
      resetWalk();
      de.removeAttribute('data-sh-nav');
    }, 900);
  }
  /* 引き継げなかったときは、当て布だけで引く */
  if (de.classList.contains('sh-arrive')) {
    var clear = function () { de.classList.remove('sh-arrive'); };
    de.addEventListener('animationend', function (e) {
      if (e.animationName === 'shArrive') clear();
    });
    setTimeout(clear, 3000);
  }

  function internal(a) {
    if (!a || !a.getAttribute) return false;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || /^(mailto|tel|javascript):/i.test(href)) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('download')) return false;
    try { return new URL(a.href, location.href).origin === location.origin; }
    catch (e) { return false; }
  }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!internal(a)) return;
    if (a.href.split('#')[0] === location.href.split('#')[0]) return;   /* 同じページ */
    var key = label(a.href);
    if (key === 'HOME') return;     /* トップへ戻るときは幕を出さない */
    e.preventDefault();
    ghost.textContent = key;
    name.textContent = key;
    jp.textContent = NAMES[key] || '';
    attach();
    /* いったん消してから付け直して、2回目以降も最初から動かす */
    fade.classList.remove('is-on', 'is-cont', 'is-leave');
    resetWalk();
    void fade.offsetWidth;
    fade.classList.add('is-on');
    var started = Date.now();
    /* 次のページを先に取りに行く。渡したときすぐ描けるように */
    try {
      var pf = document.createElement('link');
      pf.rel = 'prefetch';
      pf.href = a.href;
      document.head.appendChild(pf);
    } catch (e) {}
    setTimeout(function () {
      /* 着いた先で場面を続けられるよう、行き先・人・始めた時刻を持たせて渡す */
      try {
        sessionStorage.setItem('sh-nav', JSON.stringify(
          { k: key, j: NAMES[key] || '', f: cast, t: started }));
      } catch (e) {}
      location.href = a.href;
    }, WAIT);
  });
})();
