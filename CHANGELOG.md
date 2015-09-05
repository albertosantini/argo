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
