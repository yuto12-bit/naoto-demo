# NAOTO OTAKA — SVGパーツ索引

合計 207点。全部 `currentColor` やから CSS の `color` で色が決まる。

`sprite.svg` に全部入ってる。`<use href="/sprite.svg#i-名前">` で呼べる。

## プレビュー

- `preview.html` — UI・罫線・フレーム
- `deco.html` — 誌面・街・パターン・囲み
- `deco2.html` — 大判タイポ・破れ
- `deco3.html` — フィルム・バーコード・目盛り・矢印
- `diagram/flow.html` `diagram/uses.html` — 図解

## badge — 番号・バッジ枠 (8)

`badge-burst`, `badge-ribbon`, `badge-stamp`, `badge-tag`, `num-circle`, `num-cut`, `num-solid`, `num-square`

## deco-box — 囲み・吹き出し・窓・塊 (14)

`blob-vermil`, `box-cut`, `box-dashed`, `box-double`, `box-offset`, `box-plain`, `box-tab`, `bubble-burst`, `bubble-round`, `bubble-square`, `corner-solid`, `slash-block`, `window-arch`, `window-circle`

## deco-city — ビル・電柱・横断歩道 (12)

`building-low`, `building-tall`, `crosswalk-persp`, `crosswalk`, `power-lines`, `road-marks`, `signboard`, `skyline-narrow`, `skyline-solid`, `skyline-wide`, `street-lamp`, `utility-pole`

## deco-final — フィルム・バーコード・目盛り・大判矢印 (22)

`arrow-bend-giant`, `arrow-double`, `arrow-giant-down`, `arrow-giant-hollow`, `arrow-giant-left`, `arrow-giant-offset`, `arrow-giant-right`, `barcode-narrow`, `barcode-tall`, `barcode-wide`, `film-frame-1`, `film-strip-3`, `film-strip-4`, `film-strip-vertical`, `photo-id`, `polaroid`, `qr-frame`, `qr-placeholder`, `ruler-h-fine`, `ruler-h`, `ruler-v`, `scale-marks`

## deco-paper — ダミー文字組み・段組・トンボ (12)

`caption-block`, `column-frame`, `crop-corners`, `folio-block`, `margin-marks`, `page-grid`, `stack-sheets`, `text-block-short`, `text-block`, `text-indent`, `text-two-col`, `text-with-head`

## deco-pattern — タイル可のパターン (15)

`checker`, `cross-hatch`, `dot-fine`, `dot-grid`, `dot-offset`, `grid-bold`, `grid-line`, `halftone`, `hatch`, `plus-grid`, `stripe-diag`, `stripe-h`, `stripe-thin`, `stripe-v`, `wave-row`

## deco-torn — 破れ・折れ（SVG版） (16)

`crease-cross`, `crease-h`, `cut-line`, `fold-corner-solid`, `fold-corner`, `perforation`, `ripped-hole`, `torn-edge-bottom`, `torn-edge-fine`, `torn-edge-rough`, `torn-edge-top`, `torn-scrap-a`, `torn-scrap-b`, `torn-scrap-c`, `torn-scrap-offset`, `torn-scrap-outline`

## deco-type — 大判タイポ (24)

`jp-vertical`, `num-01-hollow`, `num-01-offset`, `num-01-solid`, `num-02-hollow`, `num-03-hollow`, `num-04-hollow`, `num-05-hollow`, `num-06-hollow`, `num-07-hollow`, `num-08-hollow`, `type-arc-down`, `type-arc-up`, `type-circle`, `type-knockout`, `word-about`, `word-city`, `word-contact`, `word-fashion`, `word-otaka-solid`, `word-people`, `word-services`, `word-sketch`, `word-works`

## diagram — 図解（制作の流れ／対応用途） (4)

`flow-horizontal`, `flow-vertical`, `uses-narrow`, `uses-wide`

## editorial — 誌面の記号 (12)

`asterisk`, `caption-lead-r`, `caption-lead`, `crop-mark`, `dagger`, `em-dash`, `folio`, `index-dot`, `pilcrow`, `quote`, `register`, `section-mark`

## frame — 皿・アイコン・サムネの枠 (6)

`frame-bracket`, `frame-circle-off`, `frame-circle`, `frame-corner`, `frame-plate`, `frame-tape`

## misc — 画材・所在地・料金 (8)

`brush`, `clock`, `copic`, `pen-nib`, `pin-place`, `plate`, `sketchbook`, `yen`

## nav — ナビ・カルーセル操作（-off は版ズレ版） (28)

`arrow-down-off`, `arrow-down`, `arrow-left-off`, `arrow-left`, `arrow-right-off`, `arrow-right`, `arrow-up-off`, `arrow-up`, `bent-arrow-off`, `bent-arrow`, `chevron-left-off`, `chevron-left`, `chevron-right-off`, `chevron-right`, `close-off`, `close`, `menu-off`, `menu-tight-off`, `menu-tight`, `menu`, `scroll-down-off`, `scroll-down`, `tri-down-off`, `tri-down`, `tri-left-off`, `tri-left`, `tri-right-off`, `tri-right`

## rule — 区切り線（横に伸ばせる） (10)

`rule-belt-off`, `rule-belt`, `rule-dashed`, `rule-dotted`, `rule-double`, `rule-stitch`, `rule-taper`, `rule-ticks`, `rule-triple`, `rule-wave`

## ui — フォーム・表示切替 (16)

`alert`, `check`, `download`, `external`, `filter`, `grid-view`, `instagram`, `list-view`, `mail`, `minus`, `phone`, `plus`, `spinner`, `threads`, `top`, `zoom`

## 注意

- 文字が入ってるSVG（`diagram/` `deco-type/`）は **HTMLにインラインで貼ること**。`<img>` やと Webフォントが効かん
- まっすぐな大判文字は CSS の `-webkit-text-stroke` のほうが良い。SVGが要るのはアーチ・円形・マスク抜きだけ
- `qr-placeholder` と `barcode-*` は**ダミー**。読み取れへん。本番では本物に差し替える
- 破れのSVG版は色替え・伸縮ができるが、紙の繊維感は出えへん。前に出す紙は画像素材を使う
- 手書きの矢印・線・文字は入ってない。そこはなおとさんの直筆を使う領域
