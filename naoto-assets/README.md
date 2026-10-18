# NAOTO OTAKA — 素材一覧

| ファイル | サイズ | 種別 |
|---|---|---|
| `edge/paper-edge-bottom` | 2095x291 | 透過PNG |
| `edge/paper-edge-top` | 2096x285 | 透過PNG |
| `fixing/masking-tape` | 1927x275 | 透過PNG |
| `fixing/paperclip` | 249x833 | 透過PNG |
| `fixing/push-pin` | 524x521 | 透過PNG |
| `fixing/staple` | 858x388 | 透過PNG |
| `ink/ink-01` | 398x382 | 透過PNG・インク |
| `ink/ink-02` | 368x377 | 透過PNG・インク |
| `ink/ink-03` | 643x246 | 透過PNG・インク |
| `ink/ink-04` | 483x258 | 透過PNG・インク |
| `ink/ink-05` | 236x439 | 透過PNG・インク |
| `ink/ink-06` | 290x330 | 透過PNG・インク |
| `ink/ink-07` | 618x276 | 透過PNG・インク |
| `ink/ink-08` | 344x252 | 透過PNG・インク |
| `ink/ink-09` | 320x326 | 透過PNG・インク |
| `ink/ink-10` | 276x286 | 透過PNG・インク |
| `overlay/photocopy-grain` | 1536x1024 | 透過PNG・全面オーバーレイ |
| `paper/paper-crumpled` | 1221x957 | 透過PNG |
| `paper/paper-fold-single` | 953x1173 | 透過PNG |
| `photo/street-buildings-up` | 1536x1024 | 不透過・コラージュ用 |
| `photo/street-crosswalk-oblique` | 1536x1024 | 不透過・コラージュ用 |
| `photo/street-crosswalk-overhead` | 1536x1024 | 不透過・コラージュ用 |
| `photo/street-night-window` | 1536x1024 | 不透過・コラージュ用 |
| `photo/street-railing-shadow` | 1536x1024 | 不透過・コラージュ用 |
| `photo/street-silhouette` | 1536x1024 | 不透過・コラージュ用 |
| `tile/grid` | 1254x1254 | シームレス・背景用 |
| `tile/paper-cream` | 1254x1254 | シームレス・背景用 |
| `tile/paper-kraft` | 1254x1254 | シームレス・背景用 |
| `tile/paper-white` | 1254x1254 | シームレス・背景用 |
| `torn/torn-paper-all-sides` | 1204x762 | 透過PNG |
| `torn/torn-paper-scrap-small` | 716x551 | 透過PNG |
| `torn/torn-paper-straight-left` | 1079x864 | 透過PNG |
| `torn/torn-paper-strip-narrow` | 1835x277 | 透過PNG |

## 除外
- 旧・街スナップ（低コントラスト）
- 方眼B（タイリング破綻）

## 使い方
- `tile/` は `background-repeat: repeat` で敷く。抜き無し
- `ink/` `torn/` `edge/` `fixing/` `paper/` は透過PNG。そのまま重ねられる
- `@1600w.webp` などは表示幅に応じて `srcset` で出し分ける
