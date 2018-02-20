# Architecture

Argo is an HTML5 interface for the OANDA trading platform.

The source code is located in the `src` folder.

The backend is based on [Node.js][].
The frontend is based on [hyperHTML][].

The application structure follows LIFT Principle, a Folders-by-Feature
structure.

- `src/client/index.html` loads the scripts and the stylesheets.
- `src/client/app/img` contains the images.
- `src/client/app/common` contains the main view.
- `src/client/app/components` contains the components.

The other folders in `components` contain the implementation of every feature.

[Node.js]: http://nodejs.org/
[hyperHTML]: https://viperhtml.js.org/
[OANDA Rest APIs]: http://developer.oanda.com/rest-live/introduction/
[R]: http://www.r-project.org/
[rio]: https://github.com/albertosantini/node-rio
