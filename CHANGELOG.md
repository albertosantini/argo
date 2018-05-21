<a name="6.2.0"></a>
# [6.2.0](https://github.com/albertosantini/argo/compare/v6.1.0...v6.2.0) (2018-05-21)


### Bug Fixes

* **quotes:** fix sparklines ([2b63358](https://github.com/albertosantini/argo/commit/2b63358))
* **token-dialog:** clear token when dialog cancelled ([9b3e245](https://github.com/albertosantini/argo/commit/9b3e245))


### Features

* **deps:** electron 2.0.0 ([fcadce7](https://github.com/albertosantini/argo/commit/fcadce7))



<a name="6.1.0"></a>
# [6.1.0](https://github.com/albertosantini/argo/compare/v6.0.3...v6.1.0) (2018-05-09)


### Bug Fixes

* **charts:** don't call the backend if filter is not changed ([4b7946d](https://github.com/albertosantini/argo/commit/4b7946d))
* **deps:** audit dependencies ([d221d94](https://github.com/albertosantini/argo/commit/d221d94))



<a name="6.0.3"></a>
## [6.0.3](https://github.com/albertosantini/argo/compare/v6.0.2...v6.0.3) (2018-03-15)


### Bug Fixes

* **server:** fix message error in uncaught exception ([f26dfd5](https://github.com/albertosantini/argo/commit/f26dfd5))



<a name="6.0.2"></a>
## [6.0.2](https://github.com/albertosantini/argo/compare/v6.0.1...v6.0.2) (2018-01-23)



<a name="6.0.1"></a>
## [6.0.1](https://github.com/albertosantini/argo/compare/v6.0.0...v6.0.1) (2018-01-08)


### Bug Fixes

* **quotes:** fix quotes highlighting ([6275f43](https://github.com/albertosantini/argo/commit/6275f43))
* **token-dialog:** display token button when it fails ([d327789](https://github.com/albertosantini/argo/commit/d327789))


### Performance Improvements

* **quotes:** improve highlighter ([e8819aa](https://github.com/albertosantini/argo/commit/e8819aa))



<a name="6.0.0"></a>
# [6.0.0](https://github.com/albertosantini/argo/compare/v5.0.2...v6.0.0) (2017-12-06)


### Bug Fixes

* **api:** use message in code property ([5ece339](https://github.com/albertosantini/argo/commit/5ece339))
* **css:** remove useless property ([d0e7288](https://github.com/albertosantini/argo/commit/d0e7288))


### Features

* **hyperHTML:** replace AngularJS with hyperHTML ([a0e5c93](https://github.com/albertosantini/argo/commit/a0e5c93))



<a name="5.0.2"></a>
## [5.0.2](https://github.com/albertosantini/argo/compare/v5.0.1...v5.0.2) (2017-04-21)


### Bug Fixes

* **streaming:** fix bid and ask price ([86e75ae](https://github.com/albertosantini/argo/commit/86e75ae))
* **token-dialog:** fix login cancel ([64de056](https://github.com/albertosantini/argo/commit/64de056))



<a name="5.0.1"></a>
## [5.0.1](https://github.com/albertosantini/argo/compare/v5.0.0...v5.0.1) (2017-04-03)


### Bug Fixes

* **ohlc:** fix again date value for candles ([e59cadf](https://github.com/albertosantini/argo/commit/e59cadf))



<a name="5.0.0"></a>
# [5.0.0](https://github.com/albertosantini/argo/compare/v4.4.0...v5.0.0) (2017-03-22)


### Bug Fixes

* **api:** improve error message handler ([5396ee6](https://github.com/albertosantini/argo/commit/5396ee6))
* **app:** fix app layout ([c9f6f60](https://github.com/albertosantini/argo/commit/c9f6f60))
* **charts:** fix alignmentTimezone in candles request ([3db5421](https://github.com/albertosantini/argo/commit/3db5421))
* **charts:** fix candles chart ([e6a4a18](https://github.com/albertosantini/argo/commit/e6a4a18))
* **charts:** fix sell button ([813776f](https://github.com/albertosantini/argo/commit/813776f))
* **charts:** when mobile ohlc chart is hidden ([48aedcd](https://github.com/albertosantini/argo/commit/48aedcd))
* **news:** fix timestamp ([3b77f8e](https://github.com/albertosantini/argo/commit/3b77f8e))
* **order-dialog:** close if pips are not avalable ([f5ac2e0](https://github.com/albertosantini/argo/commit/f5ac2e0))
* **order-dialog:** fix message error ([11b7b1b](https://github.com/albertosantini/argo/commit/11b7b1b))
* **orders:** add error handling when closing ([5a01760](https://github.com/albertosantini/argo/commit/5a01760))
* **orders:** fix order.type in wrong field ([2d2ed31](https://github.com/albertosantini/argo/commit/2d2ed31))
* **spinner:** use tachyons in the spinner ([812eb36](https://github.com/albertosantini/argo/commit/812eb36))
* **tabs:** align text right for contentv in tabs ([e8db1a3](https://github.com/albertosantini/argo/commit/e8db1a3))
* **tabs:** center message whit no content ([cbba541](https://github.com/albertosantini/argo/commit/cbba541))
* **token-dialog:** raise error if no account ([6595574](https://github.com/albertosantini/argo/commit/6595574))
* **trades:** fix typo in closing dialog ([596f494](https://github.com/albertosantini/argo/commit/596f494))


### Features

* **build:** prepare d3 bundle for techan ([80f6308](https://github.com/albertosantini/argo/commit/80f6308))
* **build:** remove simple-modal dep ([0724004](https://github.com/albertosantini/argo/commit/0724004))
* **material:** remove material dep ([fc0a8b0](https://github.com/albertosantini/argo/commit/fc0a8b0))
* **simple-modal:** add simple-modal script ([0e6718e](https://github.com/albertosantini/argo/commit/0e6718e))



<a name="4.4.0"></a>
# [4.4.0](https://github.com/albertosantini/argo/compare/v4.3.0...v4.4.0) (2017-02-22)


### Bug Fixes

* **activity:** move initialization to the constructor ([243cb59](https://github.com/albertosantini/argo/commit/243cb59))
* **build:** load d3 and techan lib via script tags ([ad4e282](https://github.com/albertosantini/argo/commit/ad4e282))
* **header:** fix escaping from settings dialog ([38db7f7](https://github.com/albertosantini/argo/commit/38db7f7))
* **header:** fix escaping from token dialog ([6c8c786](https://github.com/albertosantini/argo/commit/6c8c786))
* **sl-chart:** fix sparkline height in IE ([e9e1061](https://github.com/albertosantini/argo/commit/e9e1061))


### Features

* **build:** add webpack with ES2015 modules ([19e07a5](https://github.com/albertosantini/argo/commit/19e07a5))
* **build:** replace webpack with rollup ([c07db8b](https://github.com/albertosantini/argo/commit/c07db8b))
* **core:** use ES2015 ([ee410ae](https://github.com/albertosantini/argo/commit/ee410ae))



<a name="4.3.0"></a>
# [4.3.0](https://github.com/albertosantini/argo/compare/v4.2.0...v4.3.0) (2016-12-15)


### Bug Fixes

* **order-dialog:** fix order canceled ([11a9670](https://github.com/albertosantini/argo/commit/11a9670))


### Features

* **deps:** angular 1.6.0 ([d0d68cc](https://github.com/albertosantini/argo/commit/d0d68cc))



<a name="4.2.0"></a>
# [4.2.0](https://github.com/albertosantini/argo/compare/v4.1.1...v4.2.0) (2016-12-07)


### Bug Fixes

* **order-dialog:** put bindings init in $onInit ([ca68c4e](https://github.com/albertosantini/argo/commit/ca68c4e))
* **streaming:** fix missing catch part ([d661014](https://github.com/albertosantini/argo/commit/d661014))



<a name="4.1.1"></a>
## [4.1.1](https://github.com/albertosantini/argo/compare/v4.1.0...v4.1.1) (2016-11-17)


### Bug Fixes

* **charts:** filter trades per chart ([afbb965](https://github.com/albertosantini/argo/commit/afbb965))
* **README:** fix npm badges ([a842001](https://github.com/albertosantini/argo/commit/a842001))



<a name="4.1.0"></a>
# [4.1.0](https://github.com/albertosantini/argo/compare/v4.0.0...v4.1.0) (2016-11-08)


### Bug Fixes

* **api accounts:** fix wrong token ([11267c4](https://github.com/albertosantini/argo/commit/11267c4))
* **electron:** move electron as optional dep ([5214532](https://github.com/albertosantini/argo/commit/5214532))
* **order dialog:** fix limit order ([dfb3df0](https://github.com/albertosantini/argo/commit/dfb3df0))
* **orders:** fix close message ([de1b716](https://github.com/albertosantini/argo/commit/de1b716))
* **orders:** fix details of the orders view ([2b3b16d](https://github.com/albertosantini/argo/commit/2b3b16d))
* **package.json:** fix electron dep ([bc4a2b0](https://github.com/albertosantini/argo/commit/bc4a2b0))
* **putOrder:** remove lower and upper bound ([ee442ee](https://github.com/albertosantini/argo/commit/ee442ee))
* **putOrder:** use gtdTime as expire time ([26dd654](https://github.com/albertosantini/argo/commit/26dd654))
* **stream:** fix isTransaction condition ([3d8d409](https://github.com/albertosantini/argo/commit/3d8d409))


### Features

* **debug:** support devtools to debug the server ([417913d](https://github.com/albertosantini/argo/commit/417913d))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/albertosantini/argo/compare/v3.10.0...v4.0.0) (2016-11-03)


### Bug Fixes

* **api:** fix trailing stop in putOrder ([85d3718](https://github.com/albertosantini/argo/commit/85d3718))
* **docs:** add index.md to docs in the root ([e66b515](https://github.com/albertosantini/argo/commit/e66b515))
* **docs:** fix search in the docs ([5390e73](https://github.com/albertosantini/argo/commit/5390e73))
* **docs:** move README.md to index.md ([8c430dd](https://github.com/albertosantini/argo/commit/8c430dd))
* **order dialog:** convert price to string ([7fb79ae](https://github.com/albertosantini/argo/commit/7fb79ae))
* **order dialog:** fix MARKET and LIMIT values ([d331438](https://github.com/albertosantini/argo/commit/d331438))
* **order dialog:** fix trailing stop option ([a5cfe62](https://github.com/albertosantini/argo/commit/a5cfe62))
* **positions:** use units to get the side ([697406f](https://github.com/albertosantini/argo/commit/697406f))
* **trades:** add side to the list of trades ([691de9f](https://github.com/albertosantini/argo/commit/691de9f))


### Features

* **docs:** add Read the Docs ([576feaa](https://github.com/albertosantini/argo/commit/576feaa))
* **node:** Require Node.js 6.x ([d2b8432](https://github.com/albertosantini/argo/commit/d2b8432))
* **v20:** support rest-v20 calls ([178db02](https://github.com/albertosantini/argo/commit/178db02))



<a name="3.10.0"></a>
# [3.10.0](https://github.com/albertosantini/argo/compare/v3.9.0...v3.10.0) (2016-10-03)


### Bug Fixes

* **charts:** add css for label in candlestick ([c1e5b71](https://github.com/albertosantini/argo/commit/c1e5b71))



<a name="3.9.0"></a>
# [3.9.0](https://github.com/albertosantini/argo/compare/v3.8.0...v3.9.0) (2016-09-05)


### Bug Fixes

* **charts:** refresh only last bar in OHLC chart ([83375f5](https://github.com/albertosantini/argo/commit/83375f5))
* **exposures:** fix no exposures text. ([80a00aa](https://github.com/albertosantini/argo/commit/80a00aa))
* **index:** use minified d3 ([5bc1c25](https://github.com/albertosantini/argo/commit/5bc1c25))
* **karma:** fix d3 path ([2e5e413](https://github.com/albertosantini/argo/commit/2e5e413))
* **logo:** revert wrongly log class removed ([0f67fd0](https://github.com/albertosantini/argo/commit/0f67fd0))


### Performance Improvements

* **charts:** improve sparkline shifting data ([bef6240](https://github.com/albertosantini/argo/commit/bef6240))



<a name="3.8.0"></a>
# [3.8.0](https://github.com/albertosantini/argo/compare/v3.7.0...v3.8.0) (2016-06-19)


### Bug Fixes

* **scripts:** Fix executable permissions([e1dcecb](https://github.com/albertosantini/argo/commit/e1dcecb)), closes [#6](https://github.com/albertosantini/argo/issues/6)



<a name="3.7.0"></a>
# [3.7.0](https://github.com/albertosantini/argo/compare/v3.6.0...v3.7.0) (2016-05-26)



<a name="3.6.0"></a>
# [3.6.0](https://github.com/albertosantini/argo/compare/v3.5.0...v3.6.0) (2016-05-20)



<a name="3.5.0"></a>
# [3.5.0](https://github.com/albertosantini/argo/compare/v3.4.0...v3.5.0) (2016-05-11)



<a name="3.4.0"></a>
# [3.4.0](https://github.com/albertosantini/argo/compare/v3.3.4...v3.4.0) (2016-05-09)


### Bug Fixes

* **d3:** fix d3 hack for electron env([e042465](https://github.com/albertosantini/argo/commit/e042465))



<a name="3.3.4"></a>
## [3.3.4](https://github.com/albertosantini/argo/compare/v3.3.3...v3.3.4) (2016-04-09)




<a name="3.3.3"></a>
## [3.3.3](https://github.com/albertosantini/argo/compare/v3.3.2...v3.3.3) (2016-04-03)




<a name="3.3.2"></a>
## [3.3.2](https://github.com/albertosantini/argo/compare/v3.3.1...v3.3.2) (2016-04-03)




<a name="3.3.1"></a>
## [3.3.1](https://github.com/albertosantini/argo/compare/v3.3.0...v3.3.1) (2016-03-26)




<a name="3.3.0"></a>
# [3.3.0](https://github.com/albertosantini/argo/compare/v3.2.0...v3.3.0) (2016-03-21)


### Bug Fixes

* **bottomsheet:** add fixed position ([04cc4fb](https://github.com/albertosantini/argo/commit/04cc4fb))
* **deps:** add again ngSocket dependency ([2bae8c5](https://github.com/albertosantini/argo/commit/2bae8c5))
* **deps:** remove duplicate angular-local-storage ([d4d7f48](https://github.com/albertosantini/argo/commit/d4d7f48))
* **docs:** fix workflow doc ([8f0af5d](https://github.com/albertosantini/argo/commit/8f0af5d))
* **electron:** increase window width ([31f7784](https://github.com/albertosantini/argo/commit/31f7784))
* **env:** remove sandbox ([236f4a2](https://github.com/albertosantini/argo/commit/236f4a2))

### Features

* **build:** use local resources for frontend deps ([0417d49](https://github.com/albertosantini/argo/commit/0417d49))



<a name="3.2.0"></a>
# [3.2.0](https://github.com/albertosantini/argo/compare/v3.1.0...v3.2.0) (2016-02-15)


### Features

* **deps:** AngularJS 1.5.0 ([83c1304](https://github.com/albertosantini/argo/commit/83c1304))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/albertosantini/argo/compare/v3.0.0...v3.1.0) (2016-02-04)


### Bug Fixes

* **charts:** fix trade arrows for current trades ([a485339](https://github.com/albertosantini/argo/commit/a485339))
* **quotes:** fix the order of instruments list ([99878d1](https://github.com/albertosantini/argo/commit/99878d1))

### Features

* **build:** add snyk tool to test script ([28a7e82](https://github.com/albertosantini/argo/commit/28a7e82))
* **build:** remove grunt ([094291c](https://github.com/albertosantini/argo/commit/094291c))
* **charts:** add buy/sell arrows for trades ([f3238ec](https://github.com/albertosantini/argo/commit/f3238ec))
* **quotes:** add sparkline to quotes view ([35774e5](https://github.com/albertosantini/argo/commit/35774e5))
* **sparkline:** add sparkline directive ([83e394f](https://github.com/albertosantini/argo/commit/83e394f))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/albertosantini/argo/compare/v2.7.1...v3.0.0) (2016-01-07)


### Bug Fixes

* **order dlg:** check when pips are undefined ([5e8c5ab](https://github.com/albertosantini/argo/commit/5e8c5ab))
* **order dlg:** fix layout margin for order dialog ([9b1ae34](https://github.com/albertosantini/argo/commit/9b1ae34))

### Features

* **env:** add sandbox environment ([c270ebe](https://github.com/albertosantini/argo/commit/c270ebe))
* **env:** add standalone app ([f54b06d](https://github.com/albertosantini/argo/commit/f54b06d))



<a name="2.7.1"></a>
## [2.7.1](https://github.com/albertosantini/argo/compare/v2.7.0...v2.7.1) (2015-12-19)


### Bug Fixes

* **CHANGELOG:** remove wrong 2.6.0 tag ([70f84b5](https://github.com/albertosantini/argo/commit/70f84b5))
* **charts:** fix selects position if scrolled ([fcee311](https://github.com/albertosantini/argo/commit/fcee311))

### Features

* **deps:** Material 1.0.1 ([62d9357](https://github.com/albertosantini/argo/commit/62d9357))



<a name="2.7.0"></a>
# [2.7.0](https://github.com/albertosantini/argo/compare/v2.6.0...v2.7.0) (2015-12-17)


### Bug Fixes

* **charts:** add workaround for selects glitch ([93cc6fe](https://github.com/albertosantini/argo/commit/93cc6fe))
* **default:** fix next/previous tab ([fe1f677](https://github.com/albertosantini/argo/commit/fe1f677))
* **dialogs:** fix dialogs due Material update ([3e35fca](https://github.com/albertosantini/argo/commit/3e35fca))
* **dialogs:** use textContent instead of content ([fef8a50](https://github.com/albertosantini/argo/commit/fef8a50))
* **header:** fix progress circular ([94c17b4](https://github.com/albertosantini/argo/commit/94c17b4))
* **order dlg:** fix instruments and limit selects ([71a1d35](https://github.com/albertosantini/argo/commit/71a1d35))
* **tabs:** fix tabs background ([5ca0f1a](https://github.com/albertosantini/argo/commit/5ca0f1a))
* **tests:** session service tests ([57ed8d0](https://github.com/albertosantini/argo/commit/57ed8d0))

### Features

* **build:** update grunt-conventional-changelog 5.0.0 ([2f48e21](https://github.com/albertosantini/argo/commit/2f48e21))
* **deps:** Angular 1.5.0-rc.0, Material 1.0.0-rc7 ([61bd25b](https://github.com/albertosantini/argo/commit/61bd25b))
* **deps:** AngularJS 1.4.8 ([1f88665](https://github.com/albertosantini/argo/commit/1f88665))
* **deps:** Material 1.0.0 ([42f749f](https://github.com/albertosantini/argo/commit/42f749f))
* **deps:** Material 1.0.0-rc5, Ang 1.5.0-beta.2 ([2d0a855](https://github.com/albertosantini/argo/commit/2d0a855))
* **deps:** Material 1.0.0-rc6 ([ca2e465](https://github.com/albertosantini/argo/commit/ca2e465))
* **deps:** update AngularJS 1.4.6 ([8e854b8](https://github.com/albertosantini/argo/commit/8e854b8))
* **deps:** update AngularJS 1.4.7 ([e68e49c](https://github.com/albertosantini/argo/commit/e68e49c))
* **deps:** update Material 0.11.1 ([631d507](https://github.com/albertosantini/argo/commit/631d507))
* **deps:** update Material 0.11.2 ([80d7b48](https://github.com/albertosantini/argo/commit/80d7b48))
* **deps:** update Material 0.11.3 ([8d15d89](https://github.com/albertosantini/argo/commit/8d15d89))
* **deps:** update Material 0.11.4 ([a6a1d5a](https://github.com/albertosantini/argo/commit/a6a1d5a))
* **deps:** update Material 1.0.0-rc1 ([8aa6ed0](https://github.com/albertosantini/argo/commit/8aa6ed0))
* **deps:** update Material 1.0.0-rc2 ([b0cb1d1](https://github.com/albertosantini/argo/commit/b0cb1d1))
* **deps:** update Material 1.0.0-rc2 again ([9b34465](https://github.com/albertosantini/argo/commit/9b34465))
* **deps:** update Material 1.0.0-rc3 ([8d310d1](https://github.com/albertosantini/argo/commit/8d310d1))
* **deps:** update Material 1.0.0-rc4 ([2728d8c](https://github.com/albertosantini/argo/commit/2728d8c))



<a name="2.6.0"></a>
# [2.6.0](https://github.com/albertosantini/argo/compare/v2.5.0...v2.6.0) (2015-09-13)


### Bug Fixes

* **Material:** fix header buttons and progress ([7c6b94c](https://github.com/albertosantini/argo/commit/7c6b94c))
* **start:** fix again start script ([04b89ef](https://github.com/albertosantini/argo/commit/04b89ef))
* **start:** fix again start script after adding git attributes ([50695e8](https://github.com/albertosantini/argo/commit/50695e8))
* **start:** fix again start script with LF eol ([ef285fb](https://github.com/albertosantini/argo/commit/ef285fb))
* **start:** fix start script ([dbda41b](https://github.com/albertosantini/argo/commit/dbda41b))

### Features

* **deps:** update Material 0.11.0 ([ebb8d91](https://github.com/albertosantini/argo/commit/ebb8d91))



<a name="2.5.0"></a>
# [2.5.0](https://github.com/albertosantini/argo/compare/v2.4.1...v2.5.0) (2015-09-05)


### Features

* **api:** add orderbook api ([cf41662](https://github.com/albertosantini/argo/commit/cf41662))



<a name="2.4.1"></a>
## [2.4.1](https://github.com/albertosantini/argo/compare/2.4.0...v2.4.1) (2015-09-05)


### Bug Fixes

* **CHANGELOG:** fix manually tag mismatch ([e9e5199](https://github.com/albertosantini/argo/commit/e9e5199))



<a name="2.4.0"></a>
# [2.4.0](https://github.com/albertosantini/argo/compare/2.3.0...2.4.0) (2015-09-05)


### Bug Fixes

* **build:** fix grunt-conventional-changelog release ([da67af2](https://github.com/albertosantini/argo/commit/da67af2))

### Features

* **build:** add conventional-changelog ([9b042f4](https://github.com/albertosantini/argo/commit/9b042f4))



2.3.0 / 2015-08-24
==================

* Added throttling (1 req / 500ms) to OANDA api requests.
* Updated eslint-plugin-angular 0.7.0.

2.2.1 / 2015-08-23
==================

* Fixed instrument and granularity select boxes in order dialog.

2.2.0 / 2015-08-22
==================

* Added bold style to price text in chart.
* Removed labs folder (see argo-trading plugins in npmjs site).
* Updated AngularJS 1.4.4, Material 0.10.1.
* Updated other deps.
* Fixed linter errors.

2.1.1 / 2015-07-13
==================

* Fixed linter errors.

2.1.0 / 2015-07-13
==================

* Added pips info to plugin activation.
* Updated AngularJS 1.4.2.
* Updated Material 0.10.1-rc1.
* Updated other deps.

2.0.1 / 2015-06-01
==================

* Updated AngularJS 1.4.0.
* Updated Material 0.9.6.
* Updated ui router 0.2.15.
* Updated other deps.

2.0.0 / 2015-05-25
==================

* Added support for plugins.
* Fixed eol for start script (see [#4](https://github.com/albertosantini/argo/issues/4)).
* Updated deps.

1.9.1 / 2015-05-05
==================

* Removed experimental package node-svm due to compiling issues with io.js 2.0.0.

1.9.0 / 2015-05-05
==================

* Removed screenshot from README (see the site).
* Updated material 0.9.0.
* Updated ui router 0.2.14.
* Added specs.
* Added a shadow below the toolbar.
* Tuned again tabs refresh.
* Added padding and margin to the dialogs.
* Added details for view docs.
* Updated chai 2.3.0.
* Updated AngularJS 1.4.0-rc.1.
* Updated eslint 0.20.0, grunt-eslint 12.0.0.
* Added npm version badge.
* Added color classes to profit, pl in activity view.
* Added favicon.ico and argo logo.
* Added md-dynamic-height to the tabs.
* Updated body-parser 1.12.3.
* Removed useless spaces and blank lines in README.
* Updated features in README.
* Moved spinner loading to the toolbar.
* Updated README with io.js 1.8.x and material 0.9.x.

1.8.4 / 2015-04-14
==================

* Fixed spinner loading if the browser tab is hidden.
* Added a screenshot and features list to the README.
* Added test setup and initial specs.
* Updated deps.
* No negative values to bounds, profits and stops in the order dialog.
* Fixed again filling order in PIPS mode (see [#2](https://github.com/albertosantini/argo/issues/2)).

1.8.3 / 2015-04-04
==================

* Fixed order dialog pips.
* Fixed access token param.

1.8.2 / 2015-04-03
==================

* Fixed rate limit error.
* Added refresh timestamp to the account summary.
* Fixed instruments list for quotes, charts views and order dialog.
* Added color to trades profit.
* Added spread to the quotes view.

1.8.1 / 2015-04-01
==================

* Fixed pips calculation using real info.
* Added settings view with instrument list.
* Added header view doc.

1.8.0 / 2015-03-23
==================

* Added spinner when loading a view.
* Added updating the summary account when there is an event.

1.7.5 / 2015-03-17
==================

* Fixed x axis scale for feeding values.
* Added current price and distance in orders view.
* Added current price and profit pips in trades view.

1.7.4 / 2015-03-12
==================

* Added closing order and trade.
* Added error message for sending order.

1.7.3 / 2015-03-11
==================

* Fixed path for static files.

1.7.2 / 2015-03-11
==================

* First version published to npm repository.

1.7.1 / 2015-03-10
==================

* Added sticky header to the tab views.
* Added text alignment right to flex fields.
* Fixed limit and market order send.
* Added executed order message.

1.7.0 / 2015-03-09
==================

* Added sending order.
* Added exposure view.
* Added news view.

1.6.1 / 2015-03-06
==================

* Added change chart by instrument and granularity.
* Reviewed views style.
* Added Arimo font.

1.6.0 / 2015-03-04
==================

* Added positions view.
* Added orders view.
* Added highlighter to quotes view.

1.5.0 / 2015-03-03
==================

* Added toast for general messages to the user.
* Added activity view.
* Added trades view.

1.4.0 / 2015-02-27
==================

* Added charts view.

1.3.0 / 2015-02-23
==================

* Added quotes view.

1.2.0 / 2015-02-22
==================

* Added token dialog.
* Added account view.
* Added prices and events streaming.
* Added basic docs.

1.1.0 / 2015-02-14
==================

* Added skeleton layout for frontend interface.

1.0.0 / 2015-01-25
==================

* Initial release.
