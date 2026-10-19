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


/* ===== ページの切り替え。HOME 以外へ移るときに短い幕を挟む ===== */
(function () {
  var fade = document.createElement('div');
  fade.className = 'sh-fade';
  fade.setAttribute('aria-hidden', 'true');
  fade.innerHTML = '<i></i>';
  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(fade);
  });
  if (document.body) document.body.appendChild(fade);

  /* 入ってきたときは幕を上げる */
  addEventListener('pageshow', function () { fade.classList.remove('is-on'); });

  /* サイト内のページへ移るときだけ幕を下ろす */
  function internal(a) {
    if (!a || !a.getAttribute) return false;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || /^(mailto|tel|javascript):/i.test(href)) return false;
    if (a.target && a.target !== '_self') return false;
    try { return new URL(a.href, location.href).origin === location.origin; }
    catch (e) { return false; }
  }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!internal(a)) return;
    var here = location.href.split('#')[0];
    if (a.href.split('#')[0] === here) return;      /* 同じページなら何もしない */
    e.preventDefault();
    fade.classList.add('is-on');
    setTimeout(function () { location.href = a.href; }, 210);
  });
})();
