/* 全5ページ共通のヘッダー：ハンバーガーの開閉 */
(function(){
  var btn=document.getElementById('sh-btn'),menu=document.getElementById('sh-menu');
  if(!btn||!menu)return;
  var last=null;
  function open(){
    last=document.activeElement;
    menu.hidden=false;btn.setAttribute('aria-expanded','true');
    btn.setAttribute('aria-label','メニューを閉じる');
    document.documentElement.style.overflow='hidden';
    var a=menu.querySelector('a');if(a)a.focus();
  }
  function close(){
    menu.hidden=true;btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-label','メニューを開く');
    document.documentElement.style.overflow='';
    if(last&&last.focus)last.focus();
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
  function upd() {
    tick = false;
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var on = hdr.classList.contains('sh--solid');
    if (!on && y > ON) hdr.classList.add('sh--solid');
    else if (on && y < OFF) hdr.classList.remove('sh--solid');
  }
  addEventListener('scroll', function () {
    if (!tick) { tick = true; requestAnimationFrame(upd); }
  }, { passive: true });
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
