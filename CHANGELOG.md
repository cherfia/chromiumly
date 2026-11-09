# Changelog

## [7.0.0](https://github.com/cherfia/chromiumly/compare/6.0.0...7.0.0) (2026-11-09)

### ⚠ BREAKING CHANGES

- **chromium:** generateDocumentOutline and generateTaggedPdf become
  nativeBookmarks and nativeTaggedPdf; properties.nativePageRanges
  becomes properties.nativePages; emulatedMediaFeatures takes an object
  such as { 'prefers-color-scheme': 'dark' } instead of a list of
  { name, value }. Screenshot quality ranges from 1 to 100. The
  post-processing options pdfFormat, pdfUA, metadata, split, userPassword,
  ownerPassword, allow*, flatten, embeds, embedsMetadata, watermark,
  stamp, rotate and facturx are removed: add the matching stage instead.
- Node.js 18, 20 before 20.19, 21 and 22 before 22.12
  are no longer supported.
- **libre-office:** pdfa and pdfUA become nativePdfa and nativePdfua
  ('PDF/UA-1'); quality, losslessImageCompression, reduceImageResolution
  and maxImageResolution take the `native` prefix; properties.singlePageSheets,
  exportBookmarks and nativePageRanges become singlePage, nativeBookmarks
  and nativePages. initialView, magnification and pageLayout take strings
  instead of numbers. nativeWatermarkColor takes [#rrggbb](https://github.com/cherfia/chromiumly/issues/rrggbb);
  nativeWatermarkFontHeight, nativeWatermarkFontName and
  nativeWatermarkRotateAngle become nativeWatermarkFontSize,
  nativeWatermarkFont and nativeWatermarkRotation, in degrees.
  firstPageOnLeft is removed. merge, metadata, split, flatten,
  userPassword, ownerPassword, allow*, embeds, embedsMetadata, watermark,
  stamp, rotate and facturx are removed: add the matching stage instead.
- **pdf:** PDFEngines is removed. Use PDF: merge(), split({ every
  | ranges }), select(), flattenForm(), remediate() for the former
  convert() and facturX(), setMetadata(), setBookmarks() (bookmarks take
  pageNumber), encrypt(), attach(), stampText()/stampImage()/stampPdf()
  and rotate(). readMetadata() and readBookmarks() become metadata() and
  bookmarks(), and resolve to parsed JSON instead of a Buffer.
  Chromiumly.PDF_ENGINES_PATH and PDF_ENGINE_ROUTES become PDF_PATH and
  PDF_ROUTES.
- **system:** System.getPrometheusMetrics() and
  Chromiumly.SYSTEM_ROUTES.prometheusMetrics are removed.
- **common:** the PdfFormat enum and the PdfEngineRotate,
  PdfEngineStamp and PdfEngineWatermark types are removed: use the
  PdfaProfile and ConformanceProfiles unions and the stage types.
  DownloadFromEntry loses `embedded` and `field`: name a downloaded file
  in a stage with { name } instead.
- **common:** WebhookOptions requires webhookUrl and
  webhookEventsUrl; webhookErrorUrl and webhookErrorMethod are removed.

### Features

- **chromium:** support Gotenberg 9 conversions and screenshots ([708b954](https://github.com/cherfia/chromiumly/commit/708b954d2fa719661a5cb8dd58356338add871c7))
- **common:** add typed stages and request inputs ([8176d0c](https://github.com/cherfia/chromiumly/commit/8176d0cd3b87e1240e11d4ec6036ce38344fe11c))
- **common:** require the webhook events URL ([5602840](https://github.com/cherfia/chromiumly/commit/56028402814158fbab2769974df61dae8fe2c679))
- **libre-office:** support Gotenberg 9 conversions ([f1238ec](https://github.com/cherfia/chromiumly/commit/f1238ece588fb1312c738641ba4b2500c4041a90)), references [#rrggbb](https://github.com/cherfia/chromiumly/issues/rrggbb)
- **pdf:** name input PDFs with { file, name } ([d81c203](https://github.com/cherfia/chromiumly/commit/d81c203d21efcc3ba846ede21dec1875c30b17a1))
- **pdf:** replace PDFEngines with PDF for the /forms/pdf routes ([d3c42ea](https://github.com/cherfia/chromiumly/commit/d3c42ea2966d93583505b2711f5360061b551cdb))
- **system:** drop the Prometheus metrics route ([dd9715d](https://github.com/cherfia/chromiumly/commit/dd9715d6f6fa24fd948bdd5018c6b92b8f589b42))

### Bug Fixes

- **chromium:** reject a screenshot quality of 0 ([bea3cf3](https://github.com/cherfia/chromiumly/commit/bea3cf3435187e1b3518b204b4574c15c6312975))
- **common:** name compose sources and refuse clashing stage files ([58a305a](https://github.com/cherfia/chromiumly/commit/58a305a0f5d9fe87f10578215f7779e5151645d1))
- **common:** refuse requests that upload two files under one name ([8dc147f](https://github.com/cherfia/chromiumly/commit/8dc147fe0c082aaa471a992cffd22c44315d2ce6))
- **common:** suggest { name } when an upload name is taken ([e7528f8](https://github.com/cherfia/chromiumly/commit/e7528f8734f1e46ed08605fe3b5f5f2ce8906fc9))
- export the request input types and complete the migration notes ([510d117](https://github.com/cherfia/chromiumly/commit/510d117ff2369f9c972dae4dc2dd840739a8c27d))
- pass Buffers to Blob as Uint8Array views ([0ebd61e](https://github.com/cherfia/chromiumly/commit/0ebd61ee8403e2704bc2157b2f2bdca5607c40e4))

### Documentation

- document the Gotenberg 9 API ([64a8aee](https://github.com/cherfia/chromiumly/commit/64a8aee29ef9a23b5180cbe08474356d95e4f60f))
- keep install guidance package-manager neutral ([d7ae21a](https://github.com/cherfia/chromiumly/commit/d7ae21abb8e0f4bd0ceddc9b38e712b313bc103a))
- say which Chromiumly major to use with each Gotenberg ([3176c9c](https://github.com/cherfia/chromiumly/commit/3176c9c591e20f93d3a0a60ec4809f13ecc641dd))

### Styles

- apply prettier formatting ([523079a](https://github.com/cherfia/chromiumly/commit/523079a3d6e3a72dc37794b546f1d7c60d8376f6))

### Code Refactoring

- **common:** remove the Gotenberg 8 post-processing helpers ([99b7f4d](https://github.com/cherfia/chromiumly/commit/99b7f4d50465bb6a607031508ef52230df620c5a))

### Tests

- **gotenberg:** cover suppression of config WARNING messages ([5aca8ce](https://github.com/cherfia/chromiumly/commit/5aca8ceb5b13bd06cbe6315798e46f0f0a05fd35))

### Build System

- require Node.js ^20.19.0 || >=22.12.0 ([3652b2c](https://github.com/cherfia/chromiumly/commit/3652b2c9ff36f57420abf8273e4c94edb9f682b9))

### Continuous Integration

- lint every commit of a pull request ([2a8416a](https://github.com/cherfia/chromiumly/commit/2a8416a113f43c255d30508353f7add239671b57))

### Chores

- **deps:** update babel monorepo to v8.0.7 ([#914](https://github.com/cherfia/chromiumly/issues/914)) ([46b607b](https://github.com/cherfia/chromiumly/commit/46b607b4185d6f309d1e717981d206db469b2116))
- **deps:** update commitlint monorepo to v21.2.2 ([#877](https://github.com/cherfia/chromiumly/issues/877)) ([e7870e5](https://github.com/cherfia/chromiumly/commit/e7870e548ce4cf1ed0b8e4654c9d452a8acb5c6c))
- **deps:** update commitlint monorepo to v21.2.3 ([#903](https://github.com/cherfia/chromiumly/issues/903)) ([6f87ba2](https://github.com/cherfia/chromiumly/commit/6f87ba29557b62bcdb4502e68443a23bcb33a547))
- **deps:** update commitlint monorepo to v21.2.4 ([#923](https://github.com/cherfia/chromiumly/issues/923)) ([2de118c](https://github.com/cherfia/chromiumly/commit/2de118c9c1f85dced3df4e52cd5f4750caf1e4d6))
- **deps:** update dependency @babel/core to v8.0.5 ([#893](https://github.com/cherfia/chromiumly/issues/893)) ([0ca7f48](https://github.com/cherfia/chromiumly/commit/0ca7f48d4e10b752cd2edc03b797ee25f02527f4))
- **deps:** update dependency @babel/core to v8.0.6 ([#900](https://github.com/cherfia/chromiumly/issues/900)) ([69f22df](https://github.com/cherfia/chromiumly/commit/69f22df2f7118cc112f13e31f4c58fd519693e5a))
- **deps:** update dependency @babel/core to v8.0.9 ([#924](https://github.com/cherfia/chromiumly/issues/924)) ([2d3de5a](https://github.com/cherfia/chromiumly/commit/2d3de5ad224989d097ecf10a0024ec0f31962444))
- **deps:** update dependency @babel/core to v8.1.0 ([#931](https://github.com/cherfia/chromiumly/issues/931)) ([6d22ef4](https://github.com/cherfia/chromiumly/commit/6d22ef43929a805b81216b60571197f162fabd56))
- **deps:** update dependency @eslint/eslintrc to v3.3.7 ([#887](https://github.com/cherfia/chromiumly/issues/887)) ([afdd670](https://github.com/cherfia/chromiumly/commit/afdd670f244d8cd5ca5545c3aeb5852e04719e07))
- **deps:** update dependency @release-it/conventional-changelog to v12 ([5f3a037](https://github.com/cherfia/chromiumly/commit/5f3a037ab37d57e519f81c3939b8e75e30888706))
- **deps:** update dependency @release-it/conventional-changelog to v12.0.2 ([#895](https://github.com/cherfia/chromiumly/issues/895)) ([8eccf39](https://github.com/cherfia/chromiumly/commit/8eccf39241b7054f10bde910ac8a2286d3f52137))
- **deps:** update dependency @types/node to v24.13.6 ([#897](https://github.com/cherfia/chromiumly/issues/897)) ([7e952fa](https://github.com/cherfia/chromiumly/commit/7e952fabdce1b1f3eed9db436d5c757d88efbff0))
- **deps:** update dependency @types/node to v24.19.0 ([#906](https://github.com/cherfia/chromiumly/issues/906)) ([f64d15e](https://github.com/cherfia/chromiumly/commit/f64d15effac5f78abe2d1dda7fd96d207615fe9a))
- **deps:** update dependency @types/node to v24.19.1 ([#910](https://github.com/cherfia/chromiumly/issues/910)) ([a883267](https://github.com/cherfia/chromiumly/commit/a883267c06d60968a7a21bb7cb6febb4760b3150))
- **deps:** update dependency @types/node to v24.19.2 ([#915](https://github.com/cherfia/chromiumly/issues/915)) ([071c05a](https://github.com/cherfia/chromiumly/commit/071c05a512ade013fed3beed42c7983a3752d1da))
- **deps:** update dependency config to v5 ([71ef127](https://github.com/cherfia/chromiumly/commit/71ef127aa72b862d8922dbfa4334e134190b006f))
- **deps:** update dependency conventional-changelog-conventionalcommits to v10.3.0 ([#878](https://github.com/cherfia/chromiumly/issues/878)) ([071c5f1](https://github.com/cherfia/chromiumly/commit/071c5f1f6ff17745833960b81e7f36f7143ac25f))
- **deps:** update dependency conventional-changelog-conventionalcommits to v10.4.0 ([#881](https://github.com/cherfia/chromiumly/issues/881)) ([d231679](https://github.com/cherfia/chromiumly/commit/d231679769c134a7c3b119e88026b312d9c3f0a4))
- **deps:** update dependency conventional-changelog-conventionalcommits to v10.4.1 ([#912](https://github.com/cherfia/chromiumly/issues/912)) ([98d3ab8](https://github.com/cherfia/chromiumly/commit/98d3ab8bb50bcf347a61c6d5b1220e50e00d801e))
- **deps:** update dependency dotenv to v18 ([0e5ec82](https://github.com/cherfia/chromiumly/commit/0e5ec829a1f9526c1f265b52de5533eecb28c861))
- **deps:** update dependency dotenv to v18.0.8 ([#921](https://github.com/cherfia/chromiumly/issues/921)) ([58e48a5](https://github.com/cherfia/chromiumly/commit/58e48a5cfa4e0a95a437bb2bbbbf9198b8fd3945))
- **deps:** update dependency dotenv to v18.0.9 ([#926](https://github.com/cherfia/chromiumly/issues/926)) ([8f038ea](https://github.com/cherfia/chromiumly/commit/8f038ea72ce0d69fc02a75b8b5f072009cd4d902))
- **deps:** update dependency globals to v17.11.0 ([#879](https://github.com/cherfia/chromiumly/issues/879)) ([2cd1a15](https://github.com/cherfia/chromiumly/commit/2cd1a158d8aec0a956f4ba20bf8a74a3d543fb1c))
- **deps:** update dependency globals to v17.12.0 ([#890](https://github.com/cherfia/chromiumly/issues/890)) ([c2988d9](https://github.com/cherfia/chromiumly/commit/c2988d90331cee503166054c47ea98bf32a8dcbe))
- **deps:** update dependency globals to v17.13.0 ([#911](https://github.com/cherfia/chromiumly/issues/911)) ([569ea2c](https://github.com/cherfia/chromiumly/commit/569ea2c1bdc049653a248ada15edcd1bc0961c3a))
- **deps:** update dependency globals to v17.14.0 ([#932](https://github.com/cherfia/chromiumly/issues/932)) ([e5d4a9c](https://github.com/cherfia/chromiumly/commit/e5d4a9c233e763d5ab1b2e05c9345a05857ff08f))
- **deps:** update dependency globals to v17.9.0 ([#873](https://github.com/cherfia/chromiumly/issues/873)) ([0e019a5](https://github.com/cherfia/chromiumly/commit/0e019a51d54d1f2ad8a74b945426964c745de4aa))
- **deps:** update dependency jest to v30.5.0 ([#884](https://github.com/cherfia/chromiumly/issues/884)) ([eaf0247](https://github.com/cherfia/chromiumly/commit/eaf0247e91189dae7689dbe5e4dfd454acae823e))
- **deps:** update dependency jest to v30.5.1 ([#888](https://github.com/cherfia/chromiumly/issues/888)) ([bdfe194](https://github.com/cherfia/chromiumly/commit/bdfe1946160fc84bf43d68a00bfc73a888b8ce22))
- **deps:** update dependency jest to v30.5.2 ([#901](https://github.com/cherfia/chromiumly/issues/901)) ([b1dd76f](https://github.com/cherfia/chromiumly/commit/b1dd76fd944af96849a183a87ff4697c1c80f865))
- **deps:** update dependency lint-staged to v17.3.0 ([#872](https://github.com/cherfia/chromiumly/issues/872)) ([c735e07](https://github.com/cherfia/chromiumly/commit/c735e07dae697abc50195d48ef23b9d04182ab3c))
- **deps:** update dependency lint-staged to v17.4.1 ([#885](https://github.com/cherfia/chromiumly/issues/885)) ([ca485ea](https://github.com/cherfia/chromiumly/commit/ca485ea26bed10e1567ddf3b6f368197fdf32858))
- **deps:** update dependency lint-staged to v17.5.0 ([#891](https://github.com/cherfia/chromiumly/issues/891)) ([f40a957](https://github.com/cherfia/chromiumly/commit/f40a9575015ac16f5d3a2b7a751145262898fe5a))
- **deps:** update dependency lint-staged to v17.5.1 ([#894](https://github.com/cherfia/chromiumly/issues/894)) ([ae37e3b](https://github.com/cherfia/chromiumly/commit/ae37e3ba7a7eff2fadee74089ad89420ffb86200))
- **deps:** update dependency lint-staged to v17.6.0 ([#908](https://github.com/cherfia/chromiumly/issues/908)) ([f284e78](https://github.com/cherfia/chromiumly/commit/f284e78592c21c1ca5ffbbd26de7f65c4d8f3373))
- **deps:** update dependency prettier to v3.9.10 ([#918](https://github.com/cherfia/chromiumly/issues/918)) ([087ff73](https://github.com/cherfia/chromiumly/commit/087ff738df1656f6f00087181c320dcc9328d9fb))
- **deps:** update dependency prettier to v3.9.9 ([#898](https://github.com/cherfia/chromiumly/issues/898)) ([bd16cc4](https://github.com/cherfia/chromiumly/commit/bd16cc450918a9acd879140282796d3a8bdf640e))
- **deps:** update dependency release-it to v21 ([84b2dbe](https://github.com/cherfia/chromiumly/commit/84b2dbe1657f35fff2f3adfc6c837f752af141c1))
- **deps:** update dependency release-it to v21.0.3 ([#896](https://github.com/cherfia/chromiumly/issues/896)) ([c88e75c](https://github.com/cherfia/chromiumly/commit/c88e75c54fda5c2be944f6eafeda1bbab3effc43))
- **deps:** update dependency release-it to v21.1.0 ([#902](https://github.com/cherfia/chromiumly/issues/902)) ([ed963a3](https://github.com/cherfia/chromiumly/commit/ed963a3f886a3544cbf23e1f848d345edcec7d3c))
- **deps:** update dependency release-it to v21.1.1 ([#916](https://github.com/cherfia/chromiumly/issues/916)) ([6ecd777](https://github.com/cherfia/chromiumly/commit/6ecd7779599b5d49d1a660009d97622a889b1ad7))
- **deps:** update dependency release-it to v21.1.2 ([#930](https://github.com/cherfia/chromiumly/issues/930)) ([e05a109](https://github.com/cherfia/chromiumly/commit/e05a10932b81063a748f19a088e7239ea490cb37))
- **deps:** update dependency ts-jest to v29.4.14 ([#905](https://github.com/cherfia/chromiumly/issues/905)) ([a833e24](https://github.com/cherfia/chromiumly/commit/a833e24f437b2641d40729996df744f70e04ba9e))
- **deps:** update dependency ts-jest to v29.4.15 ([#919](https://github.com/cherfia/chromiumly/issues/919)) ([bf60b32](https://github.com/cherfia/chromiumly/commit/bf60b32f749d9a70a943153dc02f8e2efd36e819))
- **deps:** update dependency tslib to v2.9.1 ([#933](https://github.com/cherfia/chromiumly/issues/933)) ([0c0780d](https://github.com/cherfia/chromiumly/commit/0c0780d778ea2086cb8aff475ac6e34a993952b2))
- **deps:** update node.js to v24.19.0 ([#874](https://github.com/cherfia/chromiumly/issues/874)) ([00be47f](https://github.com/cherfia/chromiumly/commit/00be47fc66bfdfddeb7919bac626409b60e0bf52))
- **deps:** update node.js to v24.20.0 ([#883](https://github.com/cherfia/chromiumly/issues/883)) ([861c046](https://github.com/cherfia/chromiumly/commit/861c046eea4b7e7c1e271420b9ce5af686f6bb01))
- **deps:** update node.js to v24.21.0 ([#892](https://github.com/cherfia/chromiumly/issues/892)) ([ae444ba](https://github.com/cherfia/chromiumly/commit/ae444bab6f8ac5beb7dca0a34763fea19479c391))
- **deps:** update node.js to v24.22.0 ([#920](https://github.com/cherfia/chromiumly/issues/920)) ([798c909](https://github.com/cherfia/chromiumly/commit/798c90902775ebdfe55a3ab858de4cf662fd44f7))
- **deps:** update node.js to v24.22.1 ([#925](https://github.com/cherfia/chromiumly/issues/925)) ([721d3be](https://github.com/cherfia/chromiumly/commit/721d3be3ed57c151b0cd4e25040f5c3016621c06))
- **deps:** update node.js to v24.22.2 ([#929](https://github.com/cherfia/chromiumly/issues/929)) ([4c4fa89](https://github.com/cherfia/chromiumly/commit/4c4fa89331d075d644399e40cde18961aa66b680))
- **deps:** update node.js to v26 ([0c9edbe](https://github.com/cherfia/chromiumly/commit/0c9edbe22bb9d53a2f4b60ac9768829b084aa59d))
- **deps:** update typescript-eslint monorepo to v8.66.0 ([#876](https://github.com/cherfia/chromiumly/issues/876)) ([27d5013](https://github.com/cherfia/chromiumly/commit/27d50132057c61c257b347db83a1ad7d5bf112d2))
- **deps:** update typescript-eslint monorepo to v8.67.0 ([#880](https://github.com/cherfia/chromiumly/issues/880)) ([9a1e550](https://github.com/cherfia/chromiumly/commit/9a1e55062879735bacd1e38879995878c336494d))
- **deps:** update typescript-eslint monorepo to v8.68.0 ([#882](https://github.com/cherfia/chromiumly/issues/882)) ([f17745d](https://github.com/cherfia/chromiumly/commit/f17745dca3baea1bb7af28b4462761256424c260))
- **deps:** update typescript-eslint monorepo to v8.69.0 ([#886](https://github.com/cherfia/chromiumly/issues/886)) ([c7b2d8b](https://github.com/cherfia/chromiumly/commit/c7b2d8be82759d45352e80c9179badad1dc78bef))
- **deps:** update typescript-eslint monorepo to v8.70.0 ([#889](https://github.com/cherfia/chromiumly/issues/889)) ([912041b](https://github.com/cherfia/chromiumly/commit/912041b47fda2495491101b808eef1221e5f4f3c))
- **deps:** update typescript-eslint monorepo to v8.70.1 ([#904](https://github.com/cherfia/chromiumly/issues/904)) ([24de695](https://github.com/cherfia/chromiumly/commit/24de69562e7f5db0348f1b852e695f71bd3acab7))
- **deps:** update typescript-eslint monorepo to v8.71.0 ([#909](https://github.com/cherfia/chromiumly/issues/909)) ([6b8f04e](https://github.com/cherfia/chromiumly/commit/6b8f04e276d1cd578e6f8bef3b917c4ff1e6aac6))
- **deps:** update typescript-eslint monorepo to v8.71.1 ([#913](https://github.com/cherfia/chromiumly/issues/913)) ([8b61770](https://github.com/cherfia/chromiumly/commit/8b6177075c15f25673392a27df4402791c244ca0))
- **deps:** update typescript-eslint monorepo to v8.71.2 ([#917](https://github.com/cherfia/chromiumly/issues/917)) ([9db5844](https://github.com/cherfia/chromiumly/commit/9db58448df9621bc4d8c0e2038b7dff674e6b56a))
- **deps:** update typescript-eslint monorepo to v8.72.0 ([#922](https://github.com/cherfia/chromiumly/issues/922)) ([210f425](https://github.com/cherfia/chromiumly/commit/210f4252a64dcb3cc70271b93c8a726634a92d9f))
- **deps:** update typescript-eslint monorepo to v8.72.1 ([#927](https://github.com/cherfia/chromiumly/issues/927)) ([005009d](https://github.com/cherfia/chromiumly/commit/005009d0bd4bd7b613feb688fd2f5b9b0897fd07))
- **deps:** update yarn to v4.18.1 ([#907](https://github.com/cherfia/chromiumly/issues/907)) ([f8ada0e](https://github.com/cherfia/chromiumly/commit/f8ada0ee82885c9c57f91e8f42d06c2ba8965b64))
- ignore the local reference docs clone ([f4ca24c](https://github.com/cherfia/chromiumly/commit/f4ca24c3cd56f694bb2d030da6234cebed177d5f))

## [6.0.0](https://github.com/cherfia/chromiumly/compare/5.2.1...6.0.0) (2026-08-01)

## [5.2.1](https://github.com/cherfia/chromiumly/compare/5.2.0...5.2.1) (2026-04-07)

### Bug Fixes

- **pdf-engines:** append pdfua instead of pdfUA ([a3a1a13](https://github.com/cherfia/chromiumly/commit/a3a1a13f6bdde614caf4e0c28b214d6987de1037))

### Chores

- **deps:** update dependency @commitlint/cz-commitlint to v20.5.1 ([#790](https://github.com/cherfia/chromiumly/issues/790)) ([499d2bb](https://github.com/cherfia/chromiumly/commit/499d2bb4dae7fbcb1c0c1ef10cac33edaef979ce))
- **deps:** update dependency @types/node to v24.12.2 ([#794](https://github.com/cherfia/chromiumly/issues/794)) ([8de9546](https://github.com/cherfia/chromiumly/commit/8de9546d4c6d0e8eca24ac8d06b32c46561ad661))
- **deps:** update dependency dotenv to v17.4.0 ([#793](https://github.com/cherfia/chromiumly/issues/793)) ([1896509](https://github.com/cherfia/chromiumly/commit/1896509180fe22c709d972679d12a44af34fda44))
- **deps:** update dependency dotenv to v17.4.1 ([#795](https://github.com/cherfia/chromiumly/issues/795)) ([1d50b9f](https://github.com/cherfia/chromiumly/commit/1d50b9f577df35615598c1d71e344060869560c3))
- **deps:** update dependency ts-jest to v29.4.9 ([#792](https://github.com/cherfia/chromiumly/issues/792)) ([af4e13f](https://github.com/cherfia/chromiumly/commit/af4e13ffc439fb56069331d0e7210480fa610da6))
- **deps:** update typescript-eslint monorepo to v8.58.0 ([#791](https://github.com/cherfia/chromiumly/issues/791)) ([e604c92](https://github.com/cherfia/chromiumly/commit/e604c92afe8ede21c6e98795b862fbadf352ba92))

## [5.2.0](https://github.com/cherfia/chromiumly/compare/5.1.0...5.2.0) (2026-04-01)

### Features

- **chromium:** add webhook support ([f105e81](https://github.com/cherfia/chromiumly/commit/f105e81741c6da2def2219a544f77752f553dd79))
- **libre-office:** add webhook support ([17e9682](https://github.com/cherfia/chromiumly/commit/17e96829f1350f72a4cc04296f6729ffc8d1cb8e))
- **pdf-engines:** add read and write bookmarks routes support ([8fe612b](https://github.com/cherfia/chromiumly/commit/8fe612bd2f532c06283c0e3437ef4115ab39fccc))
- **system:** add system routes support ([150242b](https://github.com/cherfia/chromiumly/commit/150242bb66785be2bba5f3478b7da1e5303c0b20))

### Documentation

- update README.md ([ae272ee](https://github.com/cherfia/chromiumly/commit/ae272ee4b1b31110b56aae7804d64269f76c5767))

### Tests

- update unit tests ([a0c17fe](https://github.com/cherfia/chromiumly/commit/a0c17fea2b0f18993df8f61140b232b02162d280))

### Chores

- **deps:** update dependency conventional-changelog-conventionalcommits to v9.3.1 ([#789](https://github.com/cherfia/chromiumly/issues/789)) ([aff1301](https://github.com/cherfia/chromiumly/commit/aff1301c1323b44a2160eb5c955645f0e27322de))

## [5.1.0](https://github.com/cherfia/chromiumly/compare/4.5.0...5.1.0) (2026-03-30)

### Features

- add api key support for authentication ([f880e90](https://github.com/cherfia/chromiumly/commit/f880e9052674c6f533cd6f1b7d642dc62f6e673e))
- **chromium:** add skipNetworkAlmostIdleEvent support ([f8a9790](https://github.com/cherfia/chromiumly/commit/f8a97900da9d16e751f336f7adc2e106b4dc296c))
- **libre-office:** add pdf viewer preferences support ([41c8c03](https://github.com/cherfia/chromiumly/commit/41c8c035ef8273632bbaa56e396e011193083c06))
- **templates:** implement template generation ([a22adcc](https://github.com/cherfia/chromiumly/commit/a22adcc86ec3df9d7557c542474d09a277ab4560))

### Documentation

- update README.md ([cd8575f](https://github.com/cherfia/chromiumly/commit/cd8575f53f00a278aae1f61320e3b69a75acc33f))
- update README.md ([ff1c62c](https://github.com/cherfia/chromiumly/commit/ff1c62c2713e76060c1ea9236fa201626d929e54))
- update README.md with api key authentication details for hosted API ([99603a2](https://github.com/cherfia/chromiumly/commit/99603a2cb5f9ceb6fa032b7d57c17196ad1e6df3))

### Continuous Integration

- update release-it command to specify version 5.0.0 ([c9d642b](https://github.com/cherfia/chromiumly/commit/c9d642b23057d488168e1303e504a57d65cab351))

### Chores

- **deps:** update codecov/codecov-action action to v6 ([0ea7147](https://github.com/cherfia/chromiumly/commit/0ea71479652bc260793117f064127842f70b1de1))
- **deps:** update dependency typescript to v6 ([7697c21](https://github.com/cherfia/chromiumly/commit/7697c21b91822f6a7ea21b245b7dff7e3b265a81))
- **deps:** update node.js to v24.14.1 ([#787](https://github.com/cherfia/chromiumly/issues/787)) ([e6b000c](https://github.com/cherfia/chromiumly/commit/e6b000c25491839f58902fe1164c2b5abafe458c))
- **deps:** update typescript-eslint monorepo to v8.57.2 ([#786](https://github.com/cherfia/chromiumly/issues/786)) ([8ff6443](https://github.com/cherfia/chromiumly/commit/8ff6443656b517510b111dd803ada8ba314ccf48))
- release v5.0.0 ([19c267f](https://github.com/cherfia/chromiumly/commit/19c267fab0ea992daaa1413b4851e47a11a9520d))
- release v5.0.0 with hosted API support ([1155480](https://github.com/cherfia/chromiumly/commit/11554808780645648e52ecb4a2dc3b017698e246))

## [5.0.0](https://github.com/cherfia/chromiumly/compare/4.5.0...5.0.0) (2026-03-22)

### Features

- add api key support for authentication ([f880e90](https://github.com/cherfia/chromiumly/commit/f880e9052674c6f533cd6f1b7d642dc62f6e673e))
- **templates:** implement template generation ([a22adcc](https://github.com/cherfia/chromiumly/commit/a22adcc86ec3df9d7557c542474d09a277ab4560))

### Documentation

- update README.md with api key authentication details for hosted API ([99603a2](https://github.com/cherfia/chromiumly/commit/99603a2cb5f9ceb6fa032b7d57c17196ad1e6df3))

### Continuous Integration

- update release-it command to specify version 5.0.0 ([c9d642b](https://github.com/cherfia/chromiumly/commit/c9d642b23057d488168e1303e504a57d65cab351))

### Chores

- release v5.0.0 with hosted API support ([1155480](https://github.com/cherfia/chromiumly/commit/11554808780645648e52ecb4a2dc3b017698e246))

## [4.5.0](https://github.com/cherfia/chromiumly/compare/4.4.1...4.5.0) (2026-03-22)

### Features

- **chromium:** add rotate support ([7321f5a](https://github.com/cherfia/chromiumly/commit/7321f5acb748620bc4b08ae5690d4adad3d0621c))
- **libre-office:** add rotate support ([187d569](https://github.com/cherfia/chromiumly/commit/187d5690bf195b0e4808c481a3b4030860fb6b3d))
- **pdf-engines:** add rotate support ([526f941](https://github.com/cherfia/chromiumly/commit/526f941b8f29800a4a3f25f52872ad87d7a76705))

### Documentation

- update README to include PDF rotation feature ([094894c](https://github.com/cherfia/chromiumly/commit/094894c3351a17fc0e586bcd407ab8ed6570788b))

### Tests

- add unit tests for rotate ([377478a](https://github.com/cherfia/chromiumly/commit/377478ad2dc4fa0212716c712380581480ed0e3b))

## [4.4.1](https://github.com/cherfia/chromiumly/compare/4.4.0...4.4.1) (2026-03-21)

### Bug Fixes

- pass watermark and stamp to converters ([fa3cac1](https://github.com/cherfia/chromiumly/commit/fa3cac147f759a3bb03676fada25886e21458fe0))

## [4.4.0](https://github.com/cherfia/chromiumly/compare/4.3.0...4.4.0) (2026-03-21)

### Features

- add routes for watermark and stamp ([936d41f](https://github.com/cherfia/chromiumly/commit/936d41ff0a38e2b9a910954ca3b2fc0ef7611038))
- add utils and types for watermark and stamp functionality ([0a5c1bc](https://github.com/cherfia/chromiumly/commit/0a5c1bc5a667f3a25cef42233ecba43c10a2a8ba))
- **chromium:** add watermark and stamp support ([90b941f](https://github.com/cherfia/chromiumly/commit/90b941f5f3d385e753e5ce8b8a66bcbc19a26bc1))
- **libre-office:** add watermark and stamp support ([c8ecb49](https://github.com/cherfia/chromiumly/commit/c8ecb49f54c8568749ab6b5d7ac2a2e68bec8a48))
- **pdf-engines:** add watermark and stamp support ([ab37bfb](https://github.com/cherfia/chromiumly/commit/ab37bfb4e293bb054d9c65f19265f343f77951b9))

### Documentation

- update README to include watermark and stamp ([456cc12](https://github.com/cherfia/chromiumly/commit/456cc12082825ae130bf57145a5985d104377f91))

### Tests

- **chromium:** add unit tests for watermark and stamp ([56ecbef](https://github.com/cherfia/chromiumly/commit/56ecbefe73d58a24ea1cbc70d1884fc7578706a7))
- **libre-office:** add unit tests for watermark and stamp ([4af4c3e](https://github.com/cherfia/chromiumly/commit/4af4c3ea1eeb8eade6261ed9d6317431bd85b877))
- **pdf-engines:** add unit tests for watermark and stamp ([c9d4e47](https://github.com/cherfia/chromiumly/commit/c9d4e47f05fa89d9732d56edc66bc4ec0b298b0b))

### Chores

- **deps:** update commitlint monorepo to v20.4.3 ([#771](https://github.com/cherfia/chromiumly/issues/771)) ([e58eb43](https://github.com/cherfia/chromiumly/commit/e58eb433f80a0bb4350895e2525716366045f75f))
- **deps:** update commitlint monorepo to v20.4.4 ([#777](https://github.com/cherfia/chromiumly/issues/777)) ([1e73cbf](https://github.com/cherfia/chromiumly/commit/1e73cbff98de9e7018f39946992b76156793025a))
- **deps:** update commitlint monorepo to v20.5.0 ([#780](https://github.com/cherfia/chromiumly/issues/780)) ([0f7344b](https://github.com/cherfia/chromiumly/commit/0f7344b90e23b22e7dba63fbd371a796767372fa))
- **deps:** update dependency @release-it/conventional-changelog to v10.0.6 ([#778](https://github.com/cherfia/chromiumly/issues/778)) ([d322636](https://github.com/cherfia/chromiumly/commit/d3226366d96596e5242069611c3e70bff621c94a))
- **deps:** update dependency @types/config to v4 ([f77d1e7](https://github.com/cherfia/chromiumly/commit/f77d1e713479f6c2cd9a8940c8718a5cc0b72556))
- **deps:** update dependency @types/node to v24.12.0 ([#773](https://github.com/cherfia/chromiumly/issues/773)) ([f42a319](https://github.com/cherfia/chromiumly/commit/f42a31925af83bdc962b2d1feaba393a3c5df2c1))
- **deps:** update dependency config to v4.4.0 ([#765](https://github.com/cherfia/chromiumly/issues/765)) ([ed2c4ab](https://github.com/cherfia/chromiumly/commit/ed2c4ab3a2a25bffef89d07d418d26b051fb5e85))
- **deps:** update dependency config to v4.4.1 ([#766](https://github.com/cherfia/chromiumly/issues/766)) ([42f2306](https://github.com/cherfia/chromiumly/commit/42f230691432cb32547bc94f4fd544977502782c))
- **deps:** update dependency conventional-changelog-conventionalcommits to v9.2.0 ([#768](https://github.com/cherfia/chromiumly/issues/768)) ([37d1a0e](https://github.com/cherfia/chromiumly/commit/37d1a0eef721734d5db54fd145358a2be6274ccf))
- **deps:** update dependency conventional-changelog-conventionalcommits to v9.3.0 ([#772](https://github.com/cherfia/chromiumly/issues/772)) ([93f5422](https://github.com/cherfia/chromiumly/commit/93f5422e83fd387f4cd7b80cd6ad017a21db59a6))
- **deps:** update dependency jest to v30.3.0 ([#776](https://github.com/cherfia/chromiumly/issues/776)) ([e01f0d8](https://github.com/cherfia/chromiumly/commit/e01f0d8e23d67d061e1087b7e4948252cfc88a3a))
- **deps:** update dependency lint-staged to v16.3.1 ([#769](https://github.com/cherfia/chromiumly/issues/769)) ([1435869](https://github.com/cherfia/chromiumly/commit/14358697c02f3e65780f6cd3af77aaf09ac6b1c6))
- **deps:** update dependency lint-staged to v16.3.2 ([#770](https://github.com/cherfia/chromiumly/issues/770)) ([80206c7](https://github.com/cherfia/chromiumly/commit/80206c70c345bff2eed3c1098fb5265f99a6726c))
- **deps:** update dependency lint-staged to v16.3.3 ([#775](https://github.com/cherfia/chromiumly/issues/775)) ([4c67bf2](https://github.com/cherfia/chromiumly/commit/4c67bf2b13ac6ec2778969046eb08381ac282e42))
- **deps:** update dependency lint-staged to v16.4.0 ([#779](https://github.com/cherfia/chromiumly/issues/779)) ([bcb718c](https://github.com/cherfia/chromiumly/commit/bcb718c84348a24bd68c49b8b2007c9ae4b9307c))
- **deps:** update node.js to v24.14.0 ([#767](https://github.com/cherfia/chromiumly/issues/767)) ([7c52844](https://github.com/cherfia/chromiumly/commit/7c528449d39e4df3c2754a6dffc409329cd189f5))
- **deps:** update typescript-eslint monorepo to v8.56.1 ([#764](https://github.com/cherfia/chromiumly/issues/764)) ([42d9f38](https://github.com/cherfia/chromiumly/commit/42d9f3877e668b14fa04b5eb963fb974d883e134))
- **deps:** update typescript-eslint monorepo to v8.57.0 ([#774](https://github.com/cherfia/chromiumly/issues/774)) ([94d1f8e](https://github.com/cherfia/chromiumly/commit/94d1f8e21cd2f2c8f0d07a420be35d9d36efc7f3))
- **deps:** update typescript-eslint monorepo to v8.57.1 ([#781](https://github.com/cherfia/chromiumly/issues/781)) ([1883c42](https://github.com/cherfia/chromiumly/commit/1883c427edceb6ccbe78ed828bf96fc8655d0e0c))
- **deps:** update yarn to v4.13.0 ([#783](https://github.com/cherfia/chromiumly/issues/783)) ([a16db11](https://github.com/cherfia/chromiumly/commit/a16db118faba76edcd67ee4a2a44d0e58b8497c4))

## [4.3.0](https://github.com/cherfia/chromiumly/compare/4.2.4...4.3.0) (2026-02-23)

### Features

- **chromium:** add emulated media features support ([88c205b](https://github.com/cherfia/chromiumly/commit/88c205b0669e6a98d96d584d4c950892f3985228))

### Documentation

- update README.md ([e7cb87a](https://github.com/cherfia/chromiumly/commit/e7cb87a24dc7c54b6048381e961c25f19b0bf801))

### Tests

- **chromium:** add tests for emulated media features ([f25af46](https://github.com/cherfia/chromiumly/commit/f25af466042d7385e7df3cd73149c31439e50971))

### Chores

- **ci:** set fetch-depth to 0 in publish workflow for full history ([55a3ccf](https://github.com/cherfia/chromiumly/commit/55a3ccf646183b1d1dacfe4b06720b7537b4b9e5))
- **deps:** update commitlint monorepo to v20.4.2 ([#763](https://github.com/cherfia/chromiumly/issues/763)) ([442bbbc](https://github.com/cherfia/chromiumly/commit/442bbbc5882bb7cc7ec42989e4177a8018e50bb1))
- **deps:** update dependency @release-it/conventional-changelog to v10.0.5 ([#754](https://github.com/cherfia/chromiumly/issues/754)) ([db1221b](https://github.com/cherfia/chromiumly/commit/db1221be9fb3a4bb13459b460aac638a22acadd2))
- **deps:** update dependency @types/node to v24.10.11 ([#753](https://github.com/cherfia/chromiumly/issues/753)) ([7951e8a](https://github.com/cherfia/chromiumly/commit/7951e8a3e26da07c04548583e29e0df33bbc08ec))
- **deps:** update dependency @types/node to v24.10.12 ([#756](https://github.com/cherfia/chromiumly/issues/756)) ([bf925f6](https://github.com/cherfia/chromiumly/commit/bf925f6f1e1ca991ca9bd94e5f3516b1d4d96a23))
- **deps:** update dependency config to v4.2.1 ([9877f51](https://github.com/cherfia/chromiumly/commit/9877f51822fb60e47c2be23746ef38fa7526cccb))
- **deps:** update dependency config to v4.3.0 ([#760](https://github.com/cherfia/chromiumly/issues/760)) ([d9b5815](https://github.com/cherfia/chromiumly/commit/d9b5815ff6b6a68c98b5c654bcc929511001b550))
- **deps:** update dependency dotenv to v17.2.4 ([#755](https://github.com/cherfia/chromiumly/issues/755)) ([24e2c5a](https://github.com/cherfia/chromiumly/commit/24e2c5a7f766272c8c69ea7de5a1e953a92121b4))
- **deps:** update dependency dotenv to v17.3.1 ([#761](https://github.com/cherfia/chromiumly/issues/761)) ([b552a0e](https://github.com/cherfia/chromiumly/commit/b552a0e2140354913b6158c92781a0b35a168ef1))
- **deps:** update node.js to v24.13.1 ([7780af2](https://github.com/cherfia/chromiumly/commit/7780af2507df453dca19c68963a69e68fc8b70b3))
- **deps:** update typescript-eslint monorepo to v8.55.0 ([#757](https://github.com/cherfia/chromiumly/issues/757)) ([b7f031c](https://github.com/cherfia/chromiumly/commit/b7f031c0dd97105cebd77ce346135ca6fc6de2e0))
- **deps:** update typescript-eslint monorepo to v8.56.0 ([#762](https://github.com/cherfia/chromiumly/issues/762)) ([a5c1cc0](https://github.com/cherfia/chromiumly/commit/a5c1cc0c115f1bcb94ff2cb28f79169a01440024))

## 4.2.4 (2026-02-05)

### Documentation

- update README.md ([f4147d5](https://github.com/cherfia/chromiumly/commit/f4147d572d30cce6fdaa3e0f848b742b7a84d5fb))

## 4.2.3 (2026-01-28)

### Documentation

- update README.md ([6221f96](https://github.com/cherfia/chromiumly/commit/6221f96988097d5c541bb5239f37d4b6142130ca))

## 4.2.2 (2026-01-28)

### Chores

- bump version to 4.2.1 ([d79fdbc](https://github.com/cherfia/chromiumly/commit/d79fdbc3db6d60b9c8f27d1d97d6a021eba9e75b))

## [4.2.0](///compare/v4.1.6...v4.2.0) (2025-11-21)

### Features

- **chromium:** add embeds option for each route ce247e7
- **chromium:** add encrypt for each route 674ef4d
- **libre-office:** add embeds option 5d017e8
- **libre-office:** add user and owner password options for PDF encryption 1c90b15
- **pdf-engines:** add PDF embedding functionality 3c7ebc1
- **pdf-engines:** add PDF encryption functionality fc025fd

## <small>4.1.6 (2025-11-10)</small>

- chore(tsconfig): remove unused TypeScript compiler options ([4880cca](https://github.com/cherfia/chromiumly/commit/4880cca))

##

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

Generated by [`auto-changelog`](https://github.com/CookPete/auto-changelog).

#### [v4.1.6](https://github.com/cherfia/chromiumly/compare/v4.1.5...v4.1.6)

- chore(tsconfig): remove unused TypeScript compiler options [`4880cca`](https://github.com/cherfia/chromiumly/commit/4880cca616e3137605b696d669a343ef97243794)

#### [v4.1.5](https://github.com/cherfia/chromiumly/compare/v4.1.4...v4.1.5)

> 10 November 2025

- chore(deps): update commitlint monorepo to v20 [`#678`](https://github.com/cherfia/chromiumly/pull/678)
- chore(deps): update actions/setup-node action to v6 [`#692`](https://github.com/cherfia/chromiumly/pull/692)
- chore(deps): update node.js to v24 [`#700`](https://github.com/cherfia/chromiumly/pull/700)
- chore(deps): update dependency release-it to v19.0.6 [`#705`](https://github.com/cherfia/chromiumly/pull/705)
- chore(deps): update typescript-eslint monorepo to v8.46.3 [`#704`](https://github.com/cherfia/chromiumly/pull/704)
- chore(deps): update dependency @types/node to v22.19.0 [`#703`](https://github.com/cherfia/chromiumly/pull/703)
- chore(deps): update node.js to v22.21.1 [`#702`](https://github.com/cherfia/chromiumly/pull/702)
- chore(deps): update dependency @babel/preset-typescript to v7.28.5 [`#699`](https://github.com/cherfia/chromiumly/pull/699)
- chore(deps): update dependency lint-staged to v16.2.6 [`#698`](https://github.com/cherfia/chromiumly/pull/698)
- chore(deps): update node.js to v22.21.0 [`#697`](https://github.com/cherfia/chromiumly/pull/697)
- chore(deps): update typescript-eslint monorepo to v8.46.2 [`#696`](https://github.com/cherfia/chromiumly/pull/696)
- chore(deps): update dependency lint-staged to v16.2.5 [`#695`](https://github.com/cherfia/chromiumly/pull/695)
- chore(deps): update dependency @types/node to v22.18.11 [`#694`](https://github.com/cherfia/chromiumly/pull/694)
- chore(deps): update typescript-eslint monorepo to v8.46.1 [`#693`](https://github.com/cherfia/chromiumly/pull/693)
- chore(deps): update dependency @types/node to v22.18.10 [`#691`](https://github.com/cherfia/chromiumly/pull/691)
- chore(deps): update dependency lint-staged to v16.2.4 [`#690`](https://github.com/cherfia/chromiumly/pull/690)
- chore(deps): update dependency ts-jest to v29.4.5 [`#689`](https://github.com/cherfia/chromiumly/pull/689)
- chore(deps): update dependency @types/node to v22.18.9 [`#688`](https://github.com/cherfia/chromiumly/pull/688)
- chore: release v4.1.5 [`9a8b9e8`](https://github.com/cherfia/chromiumly/commit/9a8b9e821d3589472c48336e3d94ff598357cc2b)
- chore(tsconfig): update TypeScript target and lib to ES2022 [`a50eb39`](https://github.com/cherfia/chromiumly/commit/a50eb39ea2cb1196c2eaacff244ce302c486cf0d)

#### [v4.1.4](https://github.com/cherfia/chromiumly/compare/v4.1.3...v4.1.4)

> 8 October 2025

- chore(deps): update typescript-eslint monorepo to v8.46.0 [`#687`](https://github.com/cherfia/chromiumly/pull/687)
- chore(deps): update dependency typescript to v5.9.3 [`#686`](https://github.com/cherfia/chromiumly/pull/686)
- chore(deps): update dependency dotenv to v17.2.3 [`#685`](https://github.com/cherfia/chromiumly/pull/685)
- chore(deps): update dependency @types/node to v22.18.8 [`#684`](https://github.com/cherfia/chromiumly/pull/684)
- chore(deps): update typescript-eslint monorepo to v8.45.0 [`#683`](https://github.com/cherfia/chromiumly/pull/683)
- chore(deps): update dependency jest to v30.2.0 [`#682`](https://github.com/cherfia/chromiumly/pull/682)
- chore(deps): update dependency lint-staged to v16.2.2 [`#681`](https://github.com/cherfia/chromiumly/pull/681)
- chore(deps): update dependency lint-staged to v16.2.1 [`#680`](https://github.com/cherfia/chromiumly/pull/680)
- chore(deps): update node.js to v22.20.0 [`#679`](https://github.com/cherfia/chromiumly/pull/679)
- chore(deps): update dependency lint-staged to v16.2.0 [`#677`](https://github.com/cherfia/chromiumly/pull/677)
- chore(deps): update typescript-eslint monorepo to v8.44.1 [`#676`](https://github.com/cherfia/chromiumly/pull/676)
- chore(deps): update dependency ts-jest to v29.4.4 [`#675`](https://github.com/cherfia/chromiumly/pull/675)
- chore(deps): update dependency release-it to v19.0.5 [`#674`](https://github.com/cherfia/chromiumly/pull/674)
- chore(deps): update dependency @types/node to v22.18.6 [`#673`](https://github.com/cherfia/chromiumly/pull/673)
- chore(deps): update typescript-eslint monorepo to v8.44.0 [`#672`](https://github.com/cherfia/chromiumly/pull/672)
- chore(deps): update dependency ts-jest to v29.4.2 [`#671`](https://github.com/cherfia/chromiumly/pull/671)
- chore(deps): update dependency lint-staged to v16.1.6 [`#670`](https://github.com/cherfia/chromiumly/pull/670)
- chore(deps): update dependency @types/node to v22.18.3 [`#669`](https://github.com/cherfia/chromiumly/pull/669)
- chore(deps): update typescript-eslint monorepo to v8.43.0 [`#668`](https://github.com/cherfia/chromiumly/pull/668)
- chore(deps): update dependency jest to v30.1.3 [`#667`](https://github.com/cherfia/chromiumly/pull/667)
- chore(deps): update dependency dotenv to v17.2.2 [`#666`](https://github.com/cherfia/chromiumly/pull/666)
- chore(deps): update dependency @types/node to v22.18.1 [`#665`](https://github.com/cherfia/chromiumly/pull/665)
- chore(deps): update node.js to v22.19.0 [`#663`](https://github.com/cherfia/chromiumly/pull/663)
- chore(deps): update dependency jest to v30.1.1 [`#662`](https://github.com/cherfia/chromiumly/pull/662)
- chore(deps): update typescript-eslint monorepo to v8.41.0 [`#661`](https://github.com/cherfia/chromiumly/pull/661)
- chore(deps): update dependency @types/node to v22.18.0 [`#660`](https://github.com/cherfia/chromiumly/pull/660)
- chore(deps): update typescript-eslint monorepo to v8.40.0 [`#659`](https://github.com/cherfia/chromiumly/pull/659)
- chore(deps): update actions/checkout action to v5 [`#655`](https://github.com/cherfia/chromiumly/pull/655)
- chore(deps): update dependency config to v4.1.1 [`#658`](https://github.com/cherfia/chromiumly/pull/658)
- chore(deps): update dependency @types/node to v22.17.2 [`#657`](https://github.com/cherfia/chromiumly/pull/657)
- chore(deps): update typescript-eslint monorepo to v8.39.1 [`#656`](https://github.com/cherfia/chromiumly/pull/656)
- chore(deps): update dependency lint-staged to v16.1.5 [`#654`](https://github.com/cherfia/chromiumly/pull/654)
- chore(deps): update dependency @types/node to v22.17.1 [`#653`](https://github.com/cherfia/chromiumly/pull/653)
- chore(deps): update dependency lint-staged to v16.1.4 [`#652`](https://github.com/cherfia/chromiumly/pull/652)
- chore(deps): update typescript-eslint monorepo to v8.39.0 [`#651`](https://github.com/cherfia/chromiumly/pull/651)
- chore(deps): update dependency ts-jest to v29.4.1 [`#650`](https://github.com/cherfia/chromiumly/pull/650)
- chore: release v4.1.4 [`998831a`](https://github.com/cherfia/chromiumly/commit/998831adff43010e9c4b9697d8111e37b669d766)
- docs: update maintainability badge link in README.md [`e344d6e`](https://github.com/cherfia/chromiumly/commit/e344d6e6dcdeef80562a30692154fe638cec1c14)

#### [v4.1.3](https://github.com/cherfia/chromiumly/compare/v4.1.2...v4.1.3)

> 3 August 2025

- chore(deps): update node.js to v22.18.0 [`#649`](https://github.com/cherfia/chromiumly/pull/649)
- chore(deps): update dependency typescript to v5.9.2 [`#648`](https://github.com/cherfia/chromiumly/pull/648)
- chore(deps): update dependency @types/node to v22.17.0 [`#647`](https://github.com/cherfia/chromiumly/pull/647)
- chore(deps): update dependency dotenv to v17.2.1 [`#646`](https://github.com/cherfia/chromiumly/pull/646)
- chore(deps): update dependency config to v4.1.0 [`#645`](https://github.com/cherfia/chromiumly/pull/645)
- chore(deps): update dependency jest to v30.0.5 [`#644`](https://github.com/cherfia/chromiumly/pull/644)
- chore(deps): update typescript-eslint monorepo to v8.38.0 [`#643`](https://github.com/cherfia/chromiumly/pull/643)
- chore(deps): update dependency eslint-config-prettier to v10.1.8 [`#642`](https://github.com/cherfia/chromiumly/pull/642)
- chore(deps): update dependency @types/node to v22.16.5 [`#641`](https://github.com/cherfia/chromiumly/pull/641)
- chore(deps): update dependency release-it to v19.0.4 [`#640`](https://github.com/cherfia/chromiumly/pull/640)
- chore(deps): update node.js to v22.17.1 [`#639`](https://github.com/cherfia/chromiumly/pull/639)
- chore(deps): update dependency config to v4.0.1 [`#638`](https://github.com/cherfia/chromiumly/pull/638)
- chore(deps): update typescript-eslint monorepo to v8.37.0 [`#637`](https://github.com/cherfia/chromiumly/pull/637)
- chore(deps): update dependency dotenv to v17.2.0 [`#636`](https://github.com/cherfia/chromiumly/pull/636)
- chore(deps): update dependency @types/node to v22.16.3 [`#635`](https://github.com/cherfia/chromiumly/pull/635)
- chore(deps): update dependency dotenv to v17.1.0 [`#634`](https://github.com/cherfia/chromiumly/pull/634)
- chore(deps): update typescript-eslint monorepo to v8.36.0 [`#633`](https://github.com/cherfia/chromiumly/pull/633)
- chore(deps): update dependency @types/node to v22.16.0 [`#632`](https://github.com/cherfia/chromiumly/pull/632)
- chore(deps): update dependency jest to v30.0.4 [`#631`](https://github.com/cherfia/chromiumly/pull/631)
- chore(deps): update dependency dotenv to v17.0.1 [`#630`](https://github.com/cherfia/chromiumly/pull/630)
- chore(deps): update typescript-eslint monorepo to v8.35.1 [`#629`](https://github.com/cherfia/chromiumly/pull/629)
- chore(deps): update dependency dotenv to v17 [`#626`](https://github.com/cherfia/chromiumly/pull/626)
- chore(deps): update node.js to v22.17.0 [`#628`](https://github.com/cherfia/chromiumly/pull/628)
- chore(deps): update typescript-eslint monorepo to v8.35.0 [`#627`](https://github.com/cherfia/chromiumly/pull/627)
- chore(deps): update dependency prettier to v3.6.2 [`#625`](https://github.com/cherfia/chromiumly/pull/625)
- chore(deps): update dependency jest to v30.0.3 [`#624`](https://github.com/cherfia/chromiumly/pull/624)
- chore: release v4.1.3 [`86125d8`](https://github.com/cherfia/chromiumly/commit/86125d85fb4e93755087d0d62a8a00c653eff671)

#### [v4.1.2](https://github.com/cherfia/chromiumly/compare/v4.1.1...v4.1.2)

> 25 June 2025

- chore(deps): update dependency prettier to v3.6.0 [`#623`](https://github.com/cherfia/chromiumly/pull/623)
- chore(deps): update dependency jest to v30.0.2 [`#622`](https://github.com/cherfia/chromiumly/pull/622)
- chore(deps): update typescript-eslint monorepo to v8.34.1 [`#621`](https://github.com/cherfia/chromiumly/pull/621)
- chore(deps): update dependency release-it to v19 [`#589`](https://github.com/cherfia/chromiumly/pull/589)
- chore(deps): update dependency lint-staged to v16 [`#600`](https://github.com/cherfia/chromiumly/pull/600)
- chore(deps): update dependency config to v4 [`#604`](https://github.com/cherfia/chromiumly/pull/604)
- chore(deps): update jest monorepo to v30 [`#615`](https://github.com/cherfia/chromiumly/pull/615)
- chore(deps): update dependency dotenv to v16.5.0 [`#619`](https://github.com/cherfia/chromiumly/pull/619)
- chore(deps): update dependency @types/node to v22.15.32 [`#620`](https://github.com/cherfia/chromiumly/pull/620)
- chore(deps): update dependency ts-jest to v29.4.0 [`#618`](https://github.com/cherfia/chromiumly/pull/618)
- chore(deps): update dependency @types/node to v22.15.31 [`#617`](https://github.com/cherfia/chromiumly/pull/617)
- chore(deps): update typescript-eslint monorepo to v8.34.0 [`#616`](https://github.com/cherfia/chromiumly/pull/616)
- chore(deps): update typescript-eslint monorepo to v8.33.1 [`#614`](https://github.com/cherfia/chromiumly/pull/614)
- chore(deps): update dependency @types/node to v22.15.30 [`#613`](https://github.com/cherfia/chromiumly/pull/613)
- chore(deps): update dependency @types/node to v22.15.29 [`#611`](https://github.com/cherfia/chromiumly/pull/611)
- chore(deps): update typescript-eslint monorepo to v8.33.0 [`#610`](https://github.com/cherfia/chromiumly/pull/610)
- chore(deps): update node.js to v22.16.0 [`#609`](https://github.com/cherfia/chromiumly/pull/609)
- chore(deps): update dependency @types/node to v22.15.19 [`#608`](https://github.com/cherfia/chromiumly/pull/608)
- chore(deps): update dependency ts-jest to v29.3.4 [`#607`](https://github.com/cherfia/chromiumly/pull/607)
- chore(deps): update node.js to v22.15.1 [`#606`](https://github.com/cherfia/chromiumly/pull/606)
- chore(deps): update dependency ts-jest to v29.3.3 [`#605`](https://github.com/cherfia/chromiumly/pull/605)
- chore(deps): update typescript-eslint monorepo to v8.32.1 [`#603`](https://github.com/cherfia/chromiumly/pull/603)
- chore(deps): update dependency eslint-config-prettier to v10.1.5 [`#602`](https://github.com/cherfia/chromiumly/pull/602)
- chore(deps): update commitlint monorepo to v19.8.1 [`#601`](https://github.com/cherfia/chromiumly/pull/601)
- chore(deps): update dependency @types/node to v22.15.17 [`#599`](https://github.com/cherfia/chromiumly/pull/599)
- chore(deps): update dependency eslint-config-prettier to v10.1.3 [`#598`](https://github.com/cherfia/chromiumly/pull/598)
- chore(deps): update dependency lint-staged to v15.5.2 [`#597`](https://github.com/cherfia/chromiumly/pull/597)
- chore(deps): update typescript-eslint monorepo to v8.32.0 [`#596`](https://github.com/cherfia/chromiumly/pull/596)
- chore(deps): update dependency @babel/preset-typescript to v7.27.1 [`#595`](https://github.com/cherfia/chromiumly/pull/595)
- chore(deps): update typescript-eslint monorepo to v8.31.1 [`#594`](https://github.com/cherfia/chromiumly/pull/594)
- chore(deps): update dependency @types/node to v22.15.3 [`#593`](https://github.com/cherfia/chromiumly/pull/593)
- chore(deps): update node.js to v22.15.0 [`#592`](https://github.com/cherfia/chromiumly/pull/592)
- chore(deps): update typescript-eslint monorepo to v8.31.0 [`#591`](https://github.com/cherfia/chromiumly/pull/591)
- chore(deps): update dependency @release-it/conventional-changelog to v10.0.1 [`#590`](https://github.com/cherfia/chromiumly/pull/590)
- chore(deps): update typescript-eslint monorepo to v8.30.1 [`#588`](https://github.com/cherfia/chromiumly/pull/588)
- chore(deps): update dependency ts-jest to v29.3.2 [`#587`](https://github.com/cherfia/chromiumly/pull/587)
- chore(deps): update dependency @types/node to v22.14.1 [`#586`](https://github.com/cherfia/chromiumly/pull/586)
- chore(deps): update dependency lint-staged to v15.5.1 [`#585`](https://github.com/cherfia/chromiumly/pull/585)
- chore(deps): update dependency eslint-config-prettier to v10.1.2 [`#584`](https://github.com/cherfia/chromiumly/pull/584)
- chore(deps): update typescript-eslint monorepo to v8.29.1 [`#583`](https://github.com/cherfia/chromiumly/pull/583)
- chore(deps): update dependency typescript to v5.8.3 [`#582`](https://github.com/cherfia/chromiumly/pull/582)
- chore(deps): update dependency @types/node to v22.14.0 [`#581`](https://github.com/cherfia/chromiumly/pull/581)
- chore(deps): update typescript-eslint monorepo to v8.29.0 [`#580`](https://github.com/cherfia/chromiumly/pull/580)
- chore(deps): update dependency ts-jest to v29.3.1 [`#579`](https://github.com/cherfia/chromiumly/pull/579)
- chore(deps): update dependency @types/node to v22.13.14 [`#578`](https://github.com/cherfia/chromiumly/pull/578)
- chore(deps): update typescript-eslint monorepo to v8.28.0 [`#577`](https://github.com/cherfia/chromiumly/pull/577)
- chore(deps): update dependency @babel/preset-typescript to v7.27.0 [`#576`](https://github.com/cherfia/chromiumly/pull/576)
- chore(deps): update dependency @types/node to v22.13.13 [`#575`](https://github.com/cherfia/chromiumly/pull/575)
- chore(deps): update dependency ts-jest to v29.3.0 [`#574`](https://github.com/cherfia/chromiumly/pull/574)
- chore(deps): update dependency @types/node to v22.13.11 [`#573`](https://github.com/cherfia/chromiumly/pull/573)
- chore(deps): update typescript-eslint monorepo to v8.27.0 [`#572`](https://github.com/cherfia/chromiumly/pull/572)
- chore: release v4.1.2 [`6325853`](https://github.com/cherfia/chromiumly/commit/63258532ceecc0b467ba2c051517cd8d33a76b32)

#### [v4.1.1](https://github.com/cherfia/chromiumly/compare/v4.1.0...v4.1.1)

> 17 March 2025

- chore(deps): update dependency lint-staged to v15.5.0 [`#571`](https://github.com/cherfia/chromiumly/pull/571)
- chore(deps): update node.js to v22 [`#569`](https://github.com/cherfia/chromiumly/pull/569)
- chore: release v4.1.1 [`c90eb60`](https://github.com/cherfia/chromiumly/commit/c90eb6046f58c655e159f85a626c40667a99002a)
- docs: update README.md [`6ae581a`](https://github.com/cherfia/chromiumly/commit/6ae581ab95a22b96d6301d1fa20a2b1503138c7d)
- fix(pdf-engines): correct form data append structure for file uploads [`a3e73ba`](https://github.com/cherfia/chromiumly/commit/a3e73ba55b833e3e59b7830b1e1ec378464b609b)

#### [v4.1.0](https://github.com/cherfia/chromiumly/compare/v4.0.0...v4.1.0)

> 13 March 2025

- chore(deps): update typescript-eslint monorepo to v8.26.1 [`#568`](https://github.com/cherfia/chromiumly/pull/568)
- chore(deps): update commitlint monorepo to v19.8.0 [`#567`](https://github.com/cherfia/chromiumly/pull/567)
- chore(deps): update dependency @types/node to v22.13.10 [`#566`](https://github.com/cherfia/chromiumly/pull/566)
- chore(deps): update dependency eslint-config-prettier to v10.1.1 [`#565`](https://github.com/cherfia/chromiumly/pull/565)
- chore(deps): update typescript-eslint monorepo to v8.26.0 [`#564`](https://github.com/cherfia/chromiumly/pull/564)
- chore(deps): update dependency @types/node to v22.13.9 [`#563`](https://github.com/cherfia/chromiumly/pull/563)
- chore(deps): update dependency prettier to v3.5.3 [`#562`](https://github.com/cherfia/chromiumly/pull/562)
- chore(deps): update dependency @types/node to v22.13.8 [`#561`](https://github.com/cherfia/chromiumly/pull/561)
- chore(deps): update dependency typescript to v5.8.2 [`#560`](https://github.com/cherfia/chromiumly/pull/560)
- chore(deps): update typescript-eslint monorepo to v8.25.0 [`#558`](https://github.com/cherfia/chromiumly/pull/558)
- chore(deps): update dependency eslint-config-prettier to v10.0.2 [`#559`](https://github.com/cherfia/chromiumly/pull/559)
- chore(deps): update dependency ts-jest to v29.2.6 [`#556`](https://github.com/cherfia/chromiumly/pull/556)
- chore(deps): update dependency prettier to v3.5.2 [`#555`](https://github.com/cherfia/chromiumly/pull/555)
- chore(deps): update dependency @types/node to v22.13.5 [`#554`](https://github.com/cherfia/chromiumly/pull/554)
- chore(deps): update typescript-eslint monorepo to v8.24.1 [`#552`](https://github.com/cherfia/chromiumly/pull/552)
- chore(deps): update dependency @types/node to v22.13.4 [`#551`](https://github.com/cherfia/chromiumly/pull/551)
- chore(deps): update dependency prettier to v3.5.1 [`#550`](https://github.com/cherfia/chromiumly/pull/550)
- chore(deps): update typescript-eslint monorepo to v8.24.0 [`#549`](https://github.com/cherfia/chromiumly/pull/549)
- chore(deps): update dependency prettier to v3.5.0 [`#548`](https://github.com/cherfia/chromiumly/pull/548)
- chore(deps): update dependency @types/node to v22.13.1 [`#547`](https://github.com/cherfia/chromiumly/pull/547)
- chore(deps): update typescript-eslint monorepo to v8.23.0 [`#546`](https://github.com/cherfia/chromiumly/pull/546)
- chore(deps): update commitlint monorepo to v19.7.1 [`#545`](https://github.com/cherfia/chromiumly/pull/545)
- chore(deps): update dependency @types/node to v22.13.0 [`#544`](https://github.com/cherfia/chromiumly/pull/544)
- chore: release v4.1.0 [`d607390`](https://github.com/cherfia/chromiumly/commit/d607390ae23590d242540798b6dac337442a02c0)
- feat(pdf-engines): add flatten route [`36d9767`](https://github.com/cherfia/chromiumly/commit/36d9767dee6291bb22710c4af50ab054ffaa6fa8)
- feat(libre-translate): add flatten property [`e6272c1`](https://github.com/cherfia/chromiumly/commit/e6272c1e7567bd0f5b63aa688980011aae78aebd)

### [v4.0.0](https://github.com/cherfia/chromiumly/compare/v3.11.0...v4.0.0)

> 30 January 2025

- chore(deps): update typescript-eslint monorepo to v8.22.0 [`#543`](https://github.com/cherfia/chromiumly/pull/543)
- chore(deps): update dependency @types/node to v22.12.0 [`#542`](https://github.com/cherfia/chromiumly/pull/542)
- chore(deps): update dependency lint-staged to v15.4.3 [`#541`](https://github.com/cherfia/chromiumly/pull/541)
- chore(deps): update dependency release-it to v18.1.2 [`#540`](https://github.com/cherfia/chromiumly/pull/540)
- chore(deps): update dependency @types/node to v22.10.10 [`#539`](https://github.com/cherfia/chromiumly/pull/539)
- chore(deps): update dependency lint-staged to v15.4.2 [`#538`](https://github.com/cherfia/chromiumly/pull/538)
- chore(deps): update typescript-eslint monorepo to v8.21.0 [`#536`](https://github.com/cherfia/chromiumly/pull/536)
- chore(deps): update dependency lint-staged to v15.4.1 [`#535`](https://github.com/cherfia/chromiumly/pull/535)
- chore(deps): update dependency @types/node to v22.10.7 [`#534`](https://github.com/cherfia/chromiumly/pull/534)
- chore(deps): update dependency eslint-config-prettier to v10 [`#531`](https://github.com/cherfia/chromiumly/pull/531)
- chore(deps): update typescript-eslint monorepo to v8.20.0 [`#533`](https://github.com/cherfia/chromiumly/pull/533)
- chore(deps): update dependency @types/node to v22.10.6 [`#532`](https://github.com/cherfia/chromiumly/pull/532)
- chore(deps): update typescript-eslint monorepo to v8.19.1 [`#530`](https://github.com/cherfia/chromiumly/pull/530)
- chore(deps): update dependency typescript to v5.7.3 [`#529`](https://github.com/cherfia/chromiumly/pull/529)
- chore(deps): bump cross-spawn from 7.0.3 to 7.0.6 [`#528`](https://github.com/cherfia/chromiumly/pull/528)
- test: update unit tests [`ebc3976`](https://github.com/cherfia/chromiumly/commit/ebc39766fc3b7645d86a7ec8c1ff944b3cd04cd2)
- refactor!: use built-in fetch and form-data [`f943fce`](https://github.com/cherfia/chromiumly/commit/f943fcedebb2c2b291e4da19bd16be476cb063e6)
- chore: release v4.0.0 [`b6b34ba`](https://github.com/cherfia/chromiumly/commit/b6b34baf0e84a5440c218118fbcc35dcec2a3ab9)

#### [v3.11.0](https://github.com/cherfia/chromiumly/compare/v3.10.1...v3.11.0)

> 9 January 2025

- chore(deps): update dependency @types/node to v22.10.5 [`#525`](https://github.com/cherfia/chromiumly/pull/525)
- chore(deps): update dependency @types/node to v22.10.3 [`#524`](https://github.com/cherfia/chromiumly/pull/524)
- chore(deps): update typescript-eslint monorepo to v8.19.0 [`#523`](https://github.com/cherfia/chromiumly/pull/523)
- chore(deps): update dependency lint-staged to v15.3.0 [`#522`](https://github.com/cherfia/chromiumly/pull/522)
- chore(deps): update typescript-eslint monorepo to v8.18.2 [`#521`](https://github.com/cherfia/chromiumly/pull/521)
- chore(deps): update dependency release-it to v17.11.0 [`#520`](https://github.com/cherfia/chromiumly/pull/520)
- chore(deps): update dependency @release-it/conventional-changelog to v9.0.4 [`#519`](https://github.com/cherfia/chromiumly/pull/519)
- chore(deps): update typescript-eslint monorepo to v8.18.1 [`#518`](https://github.com/cherfia/chromiumly/pull/518)
- chore(deps): update commitlint monorepo to v19.6.1 [`#517`](https://github.com/cherfia/chromiumly/pull/517)
- chore(deps): update dependency lint-staged to v15.2.11 [`#516`](https://github.com/cherfia/chromiumly/pull/516)
- chore(deps): update dependency @types/node to v22.10.2 [`#515`](https://github.com/cherfia/chromiumly/pull/515)
- chore(deps): update dependency release-it to v18 [`17cda23`](https://github.com/cherfia/chromiumly/commit/17cda23ec7cf8b4279b36b7c497d45bc16b0d0e5)
- docs: update README [`0240e0c`](https://github.com/cherfia/chromiumly/commit/0240e0cfd502819577c4150da1c2a93a96d87c33)
- chore: release v3.11.0 [`5f31747`](https://github.com/cherfia/chromiumly/commit/5f31747dcf2f3ee111181639450a7644b9454eb5)

#### [v3.10.1](https://github.com/cherfia/chromiumly/compare/v3.10.0...v3.10.1)

> 12 December 2024

- chore: release v3.10.1 [`d9c53b4`](https://github.com/cherfia/chromiumly/commit/d9c53b476214430870b6a7415161a25248ae6099)
- fix(libre-office): correct file naming to preserve order [`b4bb45f`](https://github.com/cherfia/chromiumly/commit/b4bb45f72db154d823983370fa8db73c5a6afc0c)
- fix(pdf-engines): correct file naming to preserve order [`fa8261d`](https://github.com/cherfia/chromiumly/commit/fa8261de949f1da37639e658f0ed1f8387929fc8)

#### [v3.10.0](https://github.com/cherfia/chromiumly/compare/v3.9.0...v3.10.0)

> 11 December 2024

- feat: add custom http headers support [`#512`](https://github.com/cherfia/chromiumly/pull/512)
- chore(deps): update typescript-eslint monorepo to v8.18.0 [`#514`](https://github.com/cherfia/chromiumly/pull/514)
- chore(deps): update dependency prettier to v3.4.2 [`#513`](https://github.com/cherfia/chromiumly/pull/513)
- chore(deps): update dependency dotenv to v16.4.7 [`#511`](https://github.com/cherfia/chromiumly/pull/511)
- chore(deps): update typescript-eslint monorepo to v8.17.0 [`#510`](https://github.com/cherfia/chromiumly/pull/510)
- chore(deps): update dependency @types/node to v22.10.1 [`#509`](https://github.com/cherfia/chromiumly/pull/509)
- chore(deps): update dependency prettier to v3.4.1 [`#508`](https://github.com/cherfia/chromiumly/pull/508)
- chore(deps): update dependency @types/node to v22.10.0 [`#507`](https://github.com/cherfia/chromiumly/pull/507)
- chore(deps): update typescript-eslint monorepo to v8.16.0 [`#506`](https://github.com/cherfia/chromiumly/pull/506)
- chore(deps): update dependency @types/node to v22.9.3 [`#504`](https://github.com/cherfia/chromiumly/pull/504)
- chore(deps): update dependency typescript to v5.7.2 [`#503`](https://github.com/cherfia/chromiumly/pull/503)
- chore(deps): update commitlint monorepo to v19.6.0 [`#502`](https://github.com/cherfia/chromiumly/pull/502)
- chore(deps): update dependency @types/node to v22.9.1 [`#501`](https://github.com/cherfia/chromiumly/pull/501)
- chore(deps): update typescript-eslint monorepo to v8.15.0 [`#500`](https://github.com/cherfia/chromiumly/pull/500)
- chore(deps): update dependency husky to v9.1.7 [`#499`](https://github.com/cherfia/chromiumly/pull/499)
- chore: release v3.10.0 [`93faa76`](https://github.com/cherfia/chromiumly/commit/93faa7697bba01b541b4100bbca8adfca14f610e)

#### [v3.9.0](https://github.com/cherfia/chromiumly/compare/v3.8.2...v3.9.0)

> 18 November 2024

- chore(deps): update codecov/codecov-action action to v5 [`#498`](https://github.com/cherfia/chromiumly/pull/498)
- chore(deps): update typescript-eslint monorepo to v8.14.0 [`#496`](https://github.com/cherfia/chromiumly/pull/496)
- chore(deps): update dependency @release-it/conventional-changelog to v9.0.3 [`#497`](https://github.com/cherfia/chromiumly/pull/497)
- chore(deps): update dependency @types/node-fetch to v2.6.12 [`#495`](https://github.com/cherfia/chromiumly/pull/495)
- chore(deps): update dependency @types/node to v22 [`#486`](https://github.com/cherfia/chromiumly/pull/486)
- chore(deps): update dependency @types/form-data to v2.5.2 [`#482`](https://github.com/cherfia/chromiumly/pull/482)
- chore(deps): update dependency release-it to v17.10.0 [`#473`](https://github.com/cherfia/chromiumly/pull/473)
- chore(deps): update dependency tslib to v2.8.0 [`#474`](https://github.com/cherfia/chromiumly/pull/474)
- chore(deps): update dependency @release-it/conventional-changelog to v9 [`#470`](https://github.com/cherfia/chromiumly/pull/470)
- chore(deps): update dependency @babel/preset-typescript to v7.25.9 [`97f2e6a`](https://github.com/cherfia/chromiumly/commit/97f2e6aa079e079ffa8e043ed62487693f895d8e)
- chore(deps): update typescript-eslint monorepo to v8.13.0 [`79d6350`](https://github.com/cherfia/chromiumly/commit/79d6350dbbbfc47f4230a9577b3887c171ef4a25)
- chore(deps): update typescript-eslint monorepo to v8.12.2 [`9ab42d1`](https://github.com/cherfia/chromiumly/commit/9ab42d1444d760a6941cda1fdd6958242eb1dee8)

#### [v3.8.2](https://github.com/cherfia/chromiumly/compare/v3.8.1...v3.8.2)

> 13 October 2024

- chore(deps): update dependency @release-it/conventional-changelog to v9 [`#468`](https://github.com/cherfia/chromiumly/pull/468)
- chore(deps): update dependency release-it to v17.8.2 [`#469`](https://github.com/cherfia/chromiumly/pull/469)
- chore(deps): update dependency typescript to v5.6.3 [`#466`](https://github.com/cherfia/chromiumly/pull/466)
- fix(deps): update dependency form-data to v4.0.1 [`#467`](https://github.com/cherfia/chromiumly/pull/467)
- chore(deps): update typescript-eslint monorepo to v8.8.1 [`#464`](https://github.com/cherfia/chromiumly/pull/464)
- Revert "chore(deps): update dependency @release-it/conventional-changelog to v9" [`f35f9ce`](https://github.com/cherfia/chromiumly/commit/f35f9ce61b0eda8fb3e057ff53f67f29ab9c199a)
- chore(deps): update dependency release-it to v17.7.0 [`5c6da67`](https://github.com/cherfia/chromiumly/commit/5c6da67a6780ea488942e893a605b194770ec815)
- chore: release v3.8.2 [`fb26785`](https://github.com/cherfia/chromiumly/commit/fb26785fc633db453f0363e14104129c9aafdbf1)

#### [v3.8.1](https://github.com/cherfia/chromiumly/compare/v3.8.0...v3.8.1)

> 4 October 2024

- chore(deps): update dependency @babel/preset-typescript to v7.25.7 [`a35ee78`](https://github.com/cherfia/chromiumly/commit/a35ee786843d038fd81949a147032e14bf6c8602)
- chore(deps): update typescript-eslint monorepo to v8.8.0 [`818d3d2`](https://github.com/cherfia/chromiumly/commit/818d3d29b8e7c079e50706101fb4ecdf9cae9a73)
- chore(pdf-engines): assert at least pdfa or pdfUA is provided [`bf13769`](https://github.com/cherfia/chromiumly/commit/bf137697eac4ec9cc021acae8bb9614733e54797)

#### [v3.8.0](https://github.com/cherfia/chromiumly/compare/v3.7.0...v3.8.0)

> 1 October 2024

- feat: update skipNetworkIdleEvent default value [`9f5a53d`](https://github.com/cherfia/chromiumly/commit/9f5a53d0fa3db5a333b52ae724bb5c9fbce389f8)
- chore(deps): update dependency commitizen to v4.3.1 [`25ef1a0`](https://github.com/cherfia/chromiumly/commit/25ef1a09fa008e5ee36f11c6bfb1c716907e4464)
- chore: release v3.8.0 [`0e40ece`](https://github.com/cherfia/chromiumly/commit/0e40ece3a5865320e3453f60989a6ac610bfc748)

#### [v3.7.0](https://github.com/cherfia/chromiumly/compare/v3.6.2...v3.7.0)

> 24 September 2024

- chore(deps): update dependency typescript to v5.6.2 [`#456`](https://github.com/cherfia/chromiumly/pull/456)
- chore(deps): update commitlint monorepo to v19.5.0 [`7b83743`](https://github.com/cherfia/chromiumly/commit/7b8374368d1d9e95be824fe6f7aea4529a5c3411)
- chore(deps): update @typescript-eslint dependencies [`c83a457`](https://github.com/cherfia/chromiumly/commit/c83a457c616a0d743a6d5499508e0c244e2b4069)
- feat(chromium): add downloadFrom property to routes [`dba3ff1`](https://github.com/cherfia/chromiumly/commit/dba3ff1ad0d632bc05533c17c5ef574a8a42a898)

#### [v3.6.2](https://github.com/cherfia/chromiumly/compare/v3.6.1...v3.6.2)

> 9 September 2024

- chore: add missing option cookie to URL screenshot [`#449`](https://github.com/cherfia/chromiumly/pull/449)
- chore(screenshots): remove unsupported parameters [`787b344`](https://github.com/cherfia/chromiumly/commit/787b344c53cfdaaf4ff986f4079b3b232c0f3b2e)
- chore(deps): update commitlint monorepo to v19.4.1 [`74e61de`](https://github.com/cherfia/chromiumly/commit/74e61de2b072bdea99d1a2c2f7109c6f3cd66f93)
- chore(deps): update dependency ts-jest to v29.2.5 [`f48822c`](https://github.com/cherfia/chromiumly/commit/f48822cf5d9dac2362d4e534e6e88830bd3bb9dc)

#### [v3.6.1](https://github.com/cherfia/chromiumly/compare/v3.6.0...v3.6.1)

> 20 August 2024

- chore(deps): update dependency ts-jest to v29.2.2 [`#418`](https://github.com/cherfia/chromiumly/pull/418)
- chore(deps): update dependency lint-staged to v15.2.8 [`b2ab059`](https://github.com/cherfia/chromiumly/commit/b2ab0599b8f880f36de4a74ed036bb62d9fc806e)
- chore(deps): update dependency release-it to v17.6.0 [`f1ab400`](https://github.com/cherfia/chromiumly/commit/f1ab400e84cda88d9b5e9c27c6da7137c6a55f8a)
- chore(deps): update typescript-eslint monorepo to v7.18.0 [`2d08de8`](https://github.com/cherfia/chromiumly/commit/2d08de802b8438102df7c16585816808555bf882)

#### [v3.6.0](https://github.com/cherfia/chromiumly/compare/v3.5.0...v3.6.0)

> 11 July 2024

- chore(deps): update typescript-eslint monorepo to v7.16.0 [`38cecfb`](https://github.com/cherfia/chromiumly/commit/38cecfb5d956e7e1e98b131eec537dc7cf25140b)
- test(libre-office): update unit tests [`b22e984`](https://github.com/cherfia/chromiumly/commit/b22e984e8294c0c72168faa39007c237a29902e8)
- feat(libre-office): add support to quality and maxImageResolution properties [`a2384e0`](https://github.com/cherfia/chromiumly/commit/a2384e0d26f7effbac1b2697c03a0c7a039816a6)

#### [v3.5.0](https://github.com/cherfia/chromiumly/compare/v3.4.0...v3.5.0)

> 4 July 2024

- chore(deps): update dependency release-it to v17.4.1 [`#409`](https://github.com/cherfia/chromiumly/pull/409)
- feat(libre-office): add support to new page properties [`bb5e890`](https://github.com/cherfia/chromiumly/commit/bb5e890933360194e7c9c7b13e64b766bf335f50)
- chore(deps): update typescript-eslint monorepo to v7.15.0 [`e95051e`](https://github.com/cherfia/chromiumly/commit/e95051e82b4b239a272ae1c4661f007c8997ad3f)
- chore: suppress config warnings [`88da5ae`](https://github.com/cherfia/chromiumly/commit/88da5ae6ddb50e38d5af23e490a309e728e6a806)

#### [v3.4.0](https://github.com/cherfia/chromiumly/compare/v3.3.4...v3.4.0)

> 28 June 2024

- feat(libre-office): add losslessImageCompression and reduceImageResolution properties [`1b07f8d`](https://github.com/cherfia/chromiumly/commit/1b07f8db84b36de3cc02c1627b75a2244d605ed4)
- chore(deps): update typescript-eslint monorepo to v7.14.1 [`d748559`](https://github.com/cherfia/chromiumly/commit/d748559b3cdb7a1bc8ce1ed86c958e708323fa15)
- chore(deps): update typescript-eslint monorepo to v7.13.1 [`43fe613`](https://github.com/cherfia/chromiumly/commit/43fe613ac59da0e5aa9ff1212c9ff55e8c482afc)

#### [v3.3.4](https://github.com/cherfia/chromiumly/compare/v3.3.3...v3.3.4)

> 14 June 2024

- chore(deps): move config and dotenv to dependencies [`e2b4d89`](https://github.com/cherfia/chromiumly/commit/e2b4d89d96885f681c755cf4b7d4836b858f730d)
- chore: release v3.3.4 [`c894748`](https://github.com/cherfia/chromiumly/commit/c894748b0b923cabe7d3e05a38c087e7f4ff70b0)

#### [v3.3.3](https://github.com/cherfia/chromiumly/compare/v3.3.2...v3.3.3)

> 13 June 2024

- chore: release v3.3.3 [`09d895f`](https://github.com/cherfia/chromiumly/commit/09d895f3dfe7a582c002247872839042e8a870e1)
- chore(deps): make peer dependencies optional [`6311213`](https://github.com/cherfia/chromiumly/commit/6311213e4a96c0acea20caed68e891b58333d9cb)

#### [v3.3.2](https://github.com/cherfia/chromiumly/compare/v3.3.1...v3.3.2)

> 13 June 2024

- chore(deps): update dependency @babel/preset-typescript to v7.24.7 [`250ec4c`](https://github.com/cherfia/chromiumly/commit/250ec4c99f7e2d67b128d44b26cdb4dd784cab10)
- chore(deps): update typescript-eslint monorepo to v7.13.0 [`ba32de9`](https://github.com/cherfia/chromiumly/commit/ba32de993a2da65093a1ca8e0fe4cfae11ec38f1)
- chore: release v3.3.2 [`e3b182e`](https://github.com/cherfia/chromiumly/commit/e3b182e294c64c954f5355186997799d276a7182)

#### [v3.3.1](https://github.com/cherfia/chromiumly/compare/v3.3.0...v3.3.1)

> 6 June 2024

- chore(deps): update typescript-eslint monorepo to v7.12.0 [`beec84a`](https://github.com/cherfia/chromiumly/commit/beec84a2ed49e68c7c7806cc6f852f63661c86b5)
- chore(pdf-engines): optimize addFiles method [`ce7ceaf`](https://github.com/cherfia/chromiumly/commit/ce7ceaf7aec5a15b0f08e9c409791d24cd8f0622)
- chore: release v3.3.1 [`177a705`](https://github.com/cherfia/chromiumly/commit/177a7057144762daef428e880d4391344d7a5783)

#### [v3.3.0](https://github.com/cherfia/chromiumly/compare/v3.2.1...v3.3.0)

> 3 June 2024

- feat: add chromiumly configuration via code [`fdbde2c`](https://github.com/cherfia/chromiumly/commit/fdbde2c0255664800af49e937c0593e17ededcaf)
- test: update jest configuration [`5f45d20`](https://github.com/cherfia/chromiumly/commit/5f45d20ab1a11c9560e71953f28f36a047ce6c91)
- docs: update README.md [`c259187`](https://github.com/cherfia/chromiumly/commit/c25918706307bc7fb4cff18e3e9280c62ea6f60f)

#### [v3.2.1](https://github.com/cherfia/chromiumly/compare/v3.2.0...v3.2.1)

> 29 May 2024

- chore(deps): update dependency @babel/preset-typescript to v7.24.6 [`3af3135`](https://github.com/cherfia/chromiumly/commit/3af31354a30423e37a1dc92dc61a87dfb7863c0c)
- chore(deps): update typescript-eslint monorepo to v7.9.0 [`187f5d7`](https://github.com/cherfia/chromiumly/commit/187f5d74eb77f4e57db1dd247748862d99bb4c3f)
- chore(deps): update dependency release-it to v17.3.0 [`db17a5f`](https://github.com/cherfia/chromiumly/commit/db17a5ff3fbb432b0cb823282561e8fc6d1ef5dd)

#### [v3.2.0](https://github.com/cherfia/chromiumly/compare/v3.1.0...v3.2.0)

> 27 April 2024

- chore(deps): update dependency release-it to v17.2.0 [`#370`](https://github.com/cherfia/chromiumly/pull/370)
- chore(deps): update typescript-eslint monorepo to v7.7.1 [`3f739e4`](https://github.com/cherfia/chromiumly/commit/3f739e40cb198a8265c4484542accd72b4dfd31c)
- chore(deps): update typescript-eslint monorepo to v7.7.0 [`95d13a0`](https://github.com/cherfia/chromiumly/commit/95d13a009830eb21251fc08a2f4ed11b8eb6ca4a)
- test(chromium): update unit tests [`2c7b230`](https://github.com/cherfia/chromiumly/commit/2c7b230d4a9137de80f081e454106d28da88463b)

#### [v3.1.0](https://github.com/cherfia/chromiumly/compare/v3.0.1...v3.1.0)

> 12 April 2024

- chore(deps): update dependency typescript to v5.4.5 [`#369`](https://github.com/cherfia/chromiumly/pull/369)
- chore(deps): update typescript-eslint monorepo to v7.6.0 [`b31672a`](https://github.com/cherfia/chromiumly/commit/b31672a12cd953d355cf9bfc3253fe2c08400124)
- feat(chromium): add cookies support [`91e487d`](https://github.com/cherfia/chromiumly/commit/91e487d3102c6cb9dd819e30e56739991ff20162)
- feat: add basic authentication support [`43db77c`](https://github.com/cherfia/chromiumly/commit/43db77cbe6926e16385da7a1d350a14668b29c46)

#### [v3.0.1](https://github.com/cherfia/chromiumly/compare/v3.0.0...v3.0.1)

> 9 April 2024

- refactor(libre-office): improve documents support [`a077110`](https://github.com/cherfia/chromiumly/commit/a0771109e5350dd736d2ff6207a94fd9541d1fed)
- chore: remove file-type dependency [`15d93bc`](https://github.com/cherfia/chromiumly/commit/15d93bc6beaf45b0853c6355b32771b50910f797)
- chore: release v3.0.1 [`a103ba6`](https://github.com/cherfia/chromiumly/commit/a103ba645f697894373f410be78357c20e4f3696)

### [v3.0.0](https://github.com/cherfia/chromiumly/compare/v2.10.0...v3.0.0)

> 8 April 2024

- feat(libre-office): add LibreOffice convert route [`0adba11`](https://github.com/cherfia/chromiumly/commit/0adba11595de7342296feece83d4a9535e252915)
- refactor(pdf-engines)!: separate pdf-engines from LibreOffice [`439f7f9`](https://github.com/cherfia/chromiumly/commit/439f7f91f165bd68b96e8aade2190086e46388b0)
- docs: update README.md [`94cbc0e`](https://github.com/cherfia/chromiumly/commit/94cbc0e7c06422573155281004ee2a7622bfb39b)

#### [v2.10.0](https://github.com/cherfia/chromiumly/compare/v2.9.0...v2.10.0)

> 5 April 2024

- feat(libre-office): add newly supported extensions [`f58fcbb`](https://github.com/cherfia/chromiumly/commit/f58fcbb84d785e308fb1667db6c97048e84e6e4c)
- chore(deps): update typescript-eslint monorepo to v7.5.0 [`d59c1e5`](https://github.com/cherfia/chromiumly/commit/d59c1e58e90729387dc9740001cb73cd1bdcf250)
- chore(deps): update typescript-eslint monorepo to v7.4.0 [`e575c57`](https://github.com/cherfia/chromiumly/commit/e575c57153c20f3a226803564ed5e0a76a6381d2)

#### [v2.9.0](https://github.com/cherfia/chromiumly/compare/v2.8.0...v2.9.0)

> 23 March 2024

- chore(deps): update dependency @babel/preset-typescript to v7.24.1 [`4497f5d`](https://github.com/cherfia/chromiumly/commit/4497f5d021a380e5e5a5fd9a9456760a74b50ee1)
- chore(deps): update commitlint monorepo to v19.1.0 [`48aef9c`](https://github.com/cherfia/chromiumly/commit/48aef9cdd0fe733d86665a8dc3fe628c2627248b)
- chore(deps): update typescript-eslint monorepo to v7.3.1 [`e258783`](https://github.com/cherfia/chromiumly/commit/e258783a1491816e5de2bbf1abf052fc2f1aaf34)

#### [v2.8.0](https://github.com/cherfia/chromiumly/compare/v2.7.0...v2.8.0)

> 6 March 2024

- test(chromium): add screenshots unit tests [`2f36ccc`](https://github.com/cherfia/chromiumly/commit/2f36ccceead02f688ada47b2d99bea6063173e37)
- feat(chromium): add screenshots support [`d56e656`](https://github.com/cherfia/chromiumly/commit/d56e6568337d94905b612917ff19e8fef872e82f)
- chore(deps): update typescript-eslint monorepo to v7.1.1 [`915a905`](https://github.com/cherfia/chromiumly/commit/915a90549ed759997d73366886d492913e6fed03)

#### [v2.7.0](https://github.com/cherfia/chromiumly/compare/v2.6.0...v2.7.0)

> 29 February 2024

- chore(deps): update typescript-eslint monorepo to v7.1.0 [`#341`](https://github.com/cherfia/chromiumly/pull/341)
- refactor(chromium): move addFile to common utils [`edc284d`](https://github.com/cherfia/chromiumly/commit/edc284d66be8ec890c3861e1e6a99b3b2f4fce49)
- chore: format code [`fdbcbdb`](https://github.com/cherfia/chromiumly/commit/fdbcbdbd826a866b206c8ee73f51c49c88ae4227)
- chore(deps): update commitlint monorepo to v19.0.3 [`f762d5d`](https://github.com/cherfia/chromiumly/commit/f762d5d949905bde469701412975f020d86fc05a)

#### [v2.6.0](https://github.com/cherfia/chromiumly/compare/v2.5.1...v2.6.0)

> 19 February 2024

- chore(deps): update codecov/codecov-action action to v4 [`#320`](https://github.com/cherfia/chromiumly/pull/320)
- feat: support assets for html conversion [`#332`](https://github.com/cherfia/chromiumly/pull/332)
- chore(deps): update typescript-eslint monorepo to v7 (major) [`#329`](https://github.com/cherfia/chromiumly/pull/329)
- chore(deps): update dependency husky to v9 [`#314`](https://github.com/cherfia/chromiumly/pull/314)
- chore(deps): update dependency @types/node to v20.10.5 [`#294`](https://github.com/cherfia/chromiumly/pull/294)
- chore(deps): update dependency release-it to v17.0.3 [`e9a3552`](https://github.com/cherfia/chromiumly/commit/e9a355223a7a98677dc7f275d5304a9e7c4e6718)
- chore(deps): update typescript-eslint monorepo to v6.16.0 [`6723226`](https://github.com/cherfia/chromiumly/commit/6723226bb18b37d7a652e314130288d5d573feea)
- chore(deps): update dependency release-it to v17.0.5 [`12e0618`](https://github.com/cherfia/chromiumly/commit/12e0618f16d9306bbfc400e2cf4ef979644f901a)

#### [v2.5.1](https://github.com/cherfia/chromiumly/compare/v2.5.0...v2.5.1)

> 11 December 2023

- docs: add JSDoc comments [`daa7783`](https://github.com/cherfia/chromiumly/commit/daa7783294e9b45217ceee1a3fa478ea311f8c47)
- chore: determine file type from buffer and read stream [`d345e4c`](https://github.com/cherfia/chromiumly/commit/d345e4c4d1c36c03d04b6af78925a3018ed98973)
- docs: update modules section in README.md [`be9e0dc`](https://github.com/cherfia/chromiumly/commit/be9e0dc185212dc5ed846e9cde2c7b60548b1fed)

#### [v2.5.0](https://github.com/cherfia/chromiumly/compare/v2.4.0...v2.5.0)

> 10 December 2023

- chore(deps): update dependency @types/jest to v29.5.11 [`#287`](https://github.com/cherfia/chromiumly/pull/287)
- chore(deps): update dependency @types/node to v20.10.4 [`#288`](https://github.com/cherfia/chromiumly/pull/288)
- chore(deps): update dependency typescript to v5.3.3 [`#289`](https://github.com/cherfia/chromiumly/pull/289)
- chore: format code [`211c6e1`](https://github.com/cherfia/chromiumly/commit/211c6e1f46d58bb16327cb0a9d78787aa5adac0f)
- feat(chromium): add ReadStream support [`1c45580`](https://github.com/cherfia/chromiumly/commit/1c4558063a9711230225c6406f9e6790f0540fdc)
- test(chromium): update converter utils unit tests [`0ca55dd`](https://github.com/cherfia/chromiumly/commit/0ca55dd2cb9aa4231b03b0b543963d0b6bf2fc77)

#### [v2.4.0](https://github.com/cherfia/chromiumly/compare/v2.3.1...v2.4.0)

> 5 December 2023

- feat(chromium): add buffer support [`f7bfaa0`](https://github.com/cherfia/chromiumly/commit/f7bfaa019427c2a52162d568c7adb30fd3bf8642)
- chore: release v2.4.0 [`74d410f`](https://github.com/cherfia/chromiumly/commit/74d410f3a76528ae71ecf3e93ef2f61314151202)

#### [v2.3.1](https://github.com/cherfia/chromiumly/compare/v2.3.0...v2.3.1)

> 4 December 2023

- chore: release v2.3.1 [`72a0057`](https://github.com/cherfia/chromiumly/commit/72a00570fc2f1b73e702cd52ba292123a9c73d85)
- fix(ci): build package before release [`16e852a`](https://github.com/cherfia/chromiumly/commit/16e852a4392bdf46fbb876e43ca6e1a4a7bd061d)

#### [v2.3.0](https://github.com/cherfia/chromiumly/compare/v2.2.2...v2.3.0)

> 3 December 2023

- chore(deps): update dependency release-it to v17 [`#276`](https://github.com/cherfia/chromiumly/pull/276)
- chore(deps): update dependency @types/node to v20.10.1 [`#274`](https://github.com/cherfia/chromiumly/pull/274)
- chore(deps): update typescript-eslint monorepo to v6.13.1 [`#275`](https://github.com/cherfia/chromiumly/pull/275)
- chore(chromium): add costomize function [`8b6e401`](https://github.com/cherfia/chromiumly/commit/8b6e4019e948afee538a6e98ec02a910e504cefa)
- refactor(chromium): use customize to append common properties [`87c51bc`](https://github.com/cherfia/chromiumly/commit/87c51bc2cb5099293b2d369f4a6d29cba44c96aa)
- feat: add PDF/Universal Accessibility property [`ed4ca4b`](https://github.com/cherfia/chromiumly/commit/ed4ca4bc0cee09acd2a8f07f063eddb820a28348)

#### [v2.2.2](https://github.com/cherfia/chromiumly/compare/v2.2.0...v2.2.2)

> 30 November 2023

- chore(deps): update dependency inquirer to v9 [`#272`](https://github.com/cherfia/chromiumly/pull/272)
- chore: add release-it [`c28463a`](https://github.com/cherfia/chromiumly/commit/c28463a0f074ebdd276833546c897c8e06b3ff5e)
- chore: add commitlint [`a5e8271`](https://github.com/cherfia/chromiumly/commit/a5e8271d99c4ec57d62ac326132fa669a1edda62)
- chore: release v2.2.1 [`66ec31c`](https://github.com/cherfia/chromiumly/commit/66ec31c1a87ee696c9214a359716737f63e537c5)

#### [v2.2.0](https://github.com/cherfia/chromiumly/compare/v2.1.0...v2.2.0)

> 4 November 2023

- chore(deps): bump @babel/traverse from 7.17.3 to 7.23.2 [`#254`](https://github.com/cherfia/chromiumly/pull/254)
- [Snyk] Upgrade node-fetch from 2.6.13 to 2.7.0 [`#225`](https://github.com/cherfia/chromiumly/pull/225)
- chore(deps): update dependency @types/jest to v29.5.7 [`#251`](https://github.com/cherfia/chromiumly/pull/251)
- chore(deps): update dependency @types/node-fetch to v2.6.8 [`#252`](https://github.com/cherfia/chromiumly/pull/252)
- chore(deps): update dependency @types/node to v20 [`#248`](https://github.com/cherfia/chromiumly/pull/248)
- chore(deps): update actions/setup-node action to v4 [`#247`](https://github.com/cherfia/chromiumly/pull/247)
- chore(deps): update actions/checkout action to v4 [`#211`](https://github.com/cherfia/chromiumly/pull/211)
- [Snyk] Upgrade node-fetch from 2.6.12 to 2.6.13 [`#215`](https://github.com/cherfia/chromiumly/pull/215)
- chore(deps): update jest monorepo [`#146`](https://github.com/cherfia/chromiumly/pull/146)
- chore(deps): update typescript-eslint monorepo to v6 (major) [`#186`](https://github.com/cherfia/chromiumly/pull/186)
- [Snyk] Upgrade node-fetch from 2.6.11 to 2.6.12 [`#189`](https://github.com/cherfia/chromiumly/pull/189)
- [Snyk] Upgrade node-fetch from 2.6.10 to 2.6.11 [`#185`](https://github.com/cherfia/chromiumly/pull/185)
- [Snyk] Upgrade node-fetch from 2.6.9 to 2.6.10 [`#165`](https://github.com/cherfia/chromiumly/pull/165)
- chore(deps): update dependency jest to v29.6.3 [`045396d`](https://github.com/cherfia/chromiumly/commit/045396dba06561f02ba03f29e2a7b4f919e0e668)
- chore(deps): update dependency jest to v29.7.0 [`c874967`](https://github.com/cherfia/chromiumly/commit/c87496770373316149e8f0c780c14fea89ce2a3f)
- chore(deps): update dependency jest to v29.6.4 [`84323ac`](https://github.com/cherfia/chromiumly/commit/84323ac0aaa1b5bd2a3f07dd2e6dc87a59411c7f)

#### [v2.1.0](https://github.com/cherfia/chromiumly/compare/v2.0.8...v2.1.0)

> 7 July 2023

- [Snyk] Upgrade node-fetch from 2.6.8 to 2.6.9 [`#147`](https://github.com/cherfia/chromiumly/pull/147)
- chore(deps): update dependency @babel/preset-typescript to v7.22.5 [`845b1eb`](https://github.com/cherfia/chromiumly/commit/845b1eb6530016904586070f848be9f678ad3ecd)
- chore(deps): update typescript-eslint monorepo to v5.61.0 [`b14781f`](https://github.com/cherfia/chromiumly/commit/b14781f3b3509950d716ac08ef808adec4036b3f)
- chore(deps): update typescript-eslint monorepo to v5.60.1 [`ce3aaab`](https://github.com/cherfia/chromiumly/commit/ce3aaab535ac52053ec211417a68c4defb14e221)

#### [v2.0.8](https://github.com/cherfia/chromiumly/compare/v2.0.7...v2.0.8)

> 30 April 2023

- chore(deps): bump json5 from 2.2.1 to 2.2.3 [`#144`](https://github.com/cherfia/chromiumly/pull/144)
- chore(deps): update dependency jest-junit to v16 [`#135`](https://github.com/cherfia/chromiumly/pull/135)
- chore(deps): update dependency typescript to v5 [`#121`](https://github.com/cherfia/chromiumly/pull/121)
- [Snyk] Upgrade node-fetch from 2.6.7 to 2.6.8 [`#102`](https://github.com/cherfia/chromiumly/pull/102)
- chore(deps): update dependency @babel/preset-typescript to v7.21.0 [`3e5566f`](https://github.com/cherfia/chromiumly/commit/3e5566fcfd4269bd9622d3658c9fe05e884878c5)
- chore(deps): update dependency @babel/preset-typescript to v7.21.5 [`ecc4a81`](https://github.com/cherfia/chromiumly/commit/ecc4a8165c2d7763a6a3710acd204a4e88ec383d)
- chore(deps): update typescript-eslint monorepo to v5.55.0 [`be21076`](https://github.com/cherfia/chromiumly/commit/be21076d22952e3e2de0017669d04e4f17fcd591)

#### [v2.0.7](https://github.com/cherfia/chromiumly/compare/v2.0.6...v2.0.7)

> 1 February 2023

- chore(deps): update dependency jest-junit to v15 [`#65`](https://github.com/cherfia/chromiumly/pull/65)
- feat: update dependencies [`f7cba87`](https://github.com/cherfia/chromiumly/commit/f7cba8704cf432258feec818877e10a1028c10a3)
- chore(deps): update jest monorepo to v29.2.0 [`d5775c1`](https://github.com/cherfia/chromiumly/commit/d5775c12a0078b5980cf6267f045fda98d672e8c)
- chore(deps): update dependency jest to v29.3.1 [`c123594`](https://github.com/cherfia/chromiumly/commit/c123594a0e8423619dfb304a6cb5641a1dab2d9c)

#### [v2.0.6](https://github.com/cherfia/chromiumly/compare/v2.0.5...v2.0.6)

> 21 September 2022

- chore(deps): update dependency ts-jest to v29.0.1 [`e667a7d`](https://github.com/cherfia/chromiumly/commit/e667a7d09bef5d2a51093ca9d5cf38f6e0eaede0)
- chore(deps): update dependency ts-jest to v29.0.1 [`d390678`](https://github.com/cherfia/chromiumly/commit/d390678ecf8aaad1b65ca670c04644cd96e92173)
- chore(deps): update dependency @types/jest to v29.0.3 [`834c983`](https://github.com/cherfia/chromiumly/commit/834c983a8acc08e93121fdadef5db0be3aab4cbd)

#### [v2.0.5](https://github.com/cherfia/chromiumly/compare/v2.0.4...v2.0.5)

> 11 September 2022

- [Snyk] Upgrade dotenv from 16.0.0 to 16.0.1 [`#27`](https://github.com/cherfia/chromiumly/pull/27)
- chore(deps): update dependency @types/config to v3 [`#33`](https://github.com/cherfia/chromiumly/pull/33)
- chore(deps): update jest monorepo to v29 (major) [`#32`](https://github.com/cherfia/chromiumly/pull/32)
- chore(deps): update dependency ts-jest to v28.0.8 [`#31`](https://github.com/cherfia/chromiumly/pull/31)
- chore(deps): update dependency jest-junit to v14 [`#29`](https://github.com/cherfia/chromiumly/pull/29)
- chore(deps): update dependency @types/node-fetch to v2.6.2 [`#28`](https://github.com/cherfia/chromiumly/pull/28)
- chore(deps): update dependency typescript to v4.8.3 [`#26`](https://github.com/cherfia/chromiumly/pull/26)
- chore(deps): update dependency ts-node to v10.9.1 [`#25`](https://github.com/cherfia/chromiumly/pull/25)
- chore(deps): update dependency @babel/preset-typescript to v7.18.6 [`#23`](https://github.com/cherfia/chromiumly/pull/23)
- chore(deps): update dependency eslint to v8.23.0 [`#22`](https://github.com/cherfia/chromiumly/pull/22)
- chore(deps): update jest monorepo [`#21`](https://github.com/cherfia/chromiumly/pull/21)
- chore(deps): update typescript-eslint monorepo to v5.36.2 [`#20`](https://github.com/cherfia/chromiumly/pull/20)
- chore(deps): update jest monorepo to v28 (major) [`#18`](https://github.com/cherfia/chromiumly/pull/18)
- chore(deps): update dependency typescript to v4.6.4 [`#19`](https://github.com/cherfia/chromiumly/pull/19)
- chore(deps): update dependency jest-junit to v13.2.0 [`#16`](https://github.com/cherfia/chromiumly/pull/16)
- chore(deps): update dependency eslint to v8.14.0 [`#17`](https://github.com/cherfia/chromiumly/pull/17)
- chore(deps): update typescript-eslint monorepo to v5.21.0 [`#15`](https://github.com/cherfia/chromiumly/pull/15)
- chore(deps): update dependency jest-junit to v13.1.0 [`#13`](https://github.com/cherfia/chromiumly/pull/13)
- chore(deps): update codecov/codecov-action action to v3 [`#12`](https://github.com/cherfia/chromiumly/pull/12)
- chore(deps): update typescript-eslint monorepo to v5.19.0 [`#11`](https://github.com/cherfia/chromiumly/pull/11)
- chore(deps): update dependency eslint to v8.13.0 [`#14`](https://github.com/cherfia/chromiumly/pull/14)
- chore(deps): pin dependencies [`#2`](https://github.com/cherfia/chromiumly/pull/2)
- chore(deps): update actions/checkout action to v3 [`#7`](https://github.com/cherfia/chromiumly/pull/7)
- chore(deps): update actions/setup-node action to v3 [`#8`](https://github.com/cherfia/chromiumly/pull/8)
- chore(deps): update typescript-eslint monorepo to v5.17.0 [`#6`](https://github.com/cherfia/chromiumly/pull/6)
- chore(deps): update dependency eslint to v8.12.0 [`#5`](https://github.com/cherfia/chromiumly/pull/5)
- chore(deps): update jest monorepo to v28 [`60ecc86`](https://github.com/cherfia/chromiumly/commit/60ecc86c316db336661be4cda7969ec2956fb802)
- chore(deps): update jest monorepo to v29 [`9aaf2d1`](https://github.com/cherfia/chromiumly/commit/9aaf2d1aefbea8b8196d429a629cb9014b9e8cf0)
- feat: update renovate config [`6614cd0`](https://github.com/cherfia/chromiumly/commit/6614cd0e68e0863308be3156f5530d133c473476)

#### [v2.0.4](https://github.com/cherfia/chromiumly/compare/v2.0.3...v2.0.4)

> 2 April 2022

- fix(readme): fix description typo [`bd98092`](https://github.com/cherfia/chromiumly/commit/bd98092bcfe731bf297c73befd726c2026088320)

#### [v2.0.3](https://github.com/cherfia/chromiumly/compare/v2.0.2...v2.0.3)

> 2 April 2022

- chore(deps): update dependency typescript to v4.6.3 [`#3`](https://github.com/cherfia/chromiumly/pull/3)
- Configure Renovate [`#1`](https://github.com/cherfia/chromiumly/pull/1)
- feat: add build workflow [`64c1879`](https://github.com/cherfia/chromiumly/commit/64c18798dfe226371783f9e2ba7239a6b3f59e5a)
- feat: add codecov steps [`f873152`](https://github.com/cherfia/chromiumly/commit/f87315212cbc4b39a65af4638161f109fafedd04)
- feat: update badges style [`35533e9`](https://github.com/cherfia/chromiumly/commit/35533e957d9fcf3bfc2f86f22c267191bfd072e0)

#### [v2.0.2](https://github.com/cherfia/chromiumly/compare/v2.0.1...v2.0.2)

> 1 April 2022

- feat: add ts-jest dependency [`9625072`](https://github.com/cherfia/chromiumly/commit/9625072805fac1135690d3920d90ed562da17e9f)
- feat: add unit tests [`1513c8e`](https://github.com/cherfia/chromiumly/commit/1513c8e555dbce8279c95acad754298c17ef388d)
- fix(pdf-engines): check file extension [`b9b4397`](https://github.com/cherfia/chromiumly/commit/b9b43979714d1d121d6a552bbdf8c6107dc04993)

#### [v2.0.1](https://github.com/cherfia/chromiumly/compare/v2.0.0...v2.0.1)

> 28 March 2022

- feat: add installation steps to README [`a0bb726`](https://github.com/cherfia/chromiumly/commit/a0bb726ea12fbf3d7788baa39f7cb92513cb5ed1)
- feat: add LibreOffice to keywords [`c781cee`](https://github.com/cherfia/chromiumly/commit/c781cee8547a0aed70c5c22f7462d3740b28b1d8)

### [v2.0.0](https://github.com/cherfia/chromiumly/compare/v1.0.4...v2.0.0)

> 28 March 2022

- chore(converters): move converters to chromium module [`c29bdf4`](https://github.com/cherfia/chromiumly/commit/c29bdf43e8acd488b964de5c2448373cb2d0cadc)
- feat(libre-office): add LibreOffice utility class [`7894d88`](https://github.com/cherfia/chromiumly/commit/7894d88529755c858aed6dbf8ba30bc1bb0002d5)
- feat(pdf-engines): add PDF Engines module [`bffa17b`](https://github.com/cherfia/chromiumly/commit/bffa17b954e8d9660fb48b8ab0a8211a2d42ffb5)

#### v1.0.4

> 28 March 2022

- feat: init typescript project [`82a3579`](https://github.com/cherfia/chromiumly/commit/82a35794040c1ca82c5b887c10793c6a9ad7cb28)
- chore: update package.json [`604bf19`](https://github.com/cherfia/chromiumly/commit/604bf19c2150e68a04d9bca9bcf5bb68ec867aa7)
- Initial commit [`781ea41`](https://github.com/cherfia/chromiumly/commit/781ea41c33cb0f99870c3e1d11e07268666f4f52)
