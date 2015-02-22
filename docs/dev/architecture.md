# Architecture

Argo is an HTML5 interface for the OANDA trading platform.

The source code is located in the `src` folder.

The backend is based on [Node.js][].
The frontend is based on [AngularJS][] and [Material Design][].

The frontend follows [Papa's AngularJS style guide][].

`labs` folder contains experimental source code.

In `labs/lib` folder there are a few scripts, wrapping [OANDA Rest APIs][], as
proof-of-concept of API integration. A few examples of dummy trading strategies
are contained in `lib/z-*` files.

`labs/R` folder is a sort of double-check, reading dump files, to verify trading
strategies with [R][] framework. Argo may integrate R statistical framework
using [rio][].

`labs/dump` folder contains a few dumps about forex sessions, used in R and js
scripts.

[Node.js]: http://nodejs.org/
[AngularJS]: https://angularjs.org/
[Material Design]: https://material.angularjs.org/
[Papa's AngularJS style guide]: https://github.com/johnpapa/angularjs-styleguide
[OANDA Rest APIs]: http://developer.oanda.com/rest-live/introduction/
[R]: http://www.r-project.org/
[rio]: https://github.com/albertosantini/node-rio
