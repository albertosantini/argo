# Recommended workflow

## Development

0. Make changes (see also CONTRIBUTING doc)
0. Commit those changes (see [Commit Conventions][])
0. Make sure Travis turns green

## Rollup bundles

After modifying js files in `src` folder, you need to build the application bundle:

`npm run rollup`

For the tests bundle:

`npm run rollup-spec`

If `d3` dep is updated, you need to build the `d3-techan` bundle:

`nom run rollup-d3`

## New release

0. Bump version in `package.json`
0. `npm run changelog`
0. Commit `CHANGELOG.md` with the message `docs(CHANGELOG): vX.Y.Z`
0. Commit `package.json` with the message `chore(release): vX.Y.Z`
0. Tag `vX.Y.Z` (don't forget `v` prefix)
0. Push
0. Publish


[Commit Conventions]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.em2hiij8p46d
