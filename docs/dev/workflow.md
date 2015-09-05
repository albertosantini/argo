# Recommended workflow

## Development

1. Make changes (see also CONTRIBUTING doc)
2. Commit those changes (see [Commit Conventions][])
3. Make sure Travis turns green

## New release

4. Bump version in `package.json`
5. `grunt conventionalChangelog`
6. Commit `package.json` and `CHANGELOG.md` files
7. Tag vX.Y.Z (don't forget `v` prefix)
8. Push
9. Publish


[Commit Conventions]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.em2hiij8p46d
