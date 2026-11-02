# WXT: build fails when the project's path contains `+`

A minimal reproduction for a WXT 0.21 bug. `wxt build` fails when the project's absolute path contains `+`, such as a git worktree named after a branch with a slash (`sync/foo` → `sync+foo`):

```
ERROR  Cannot read properties of undefined (reading 'get')
```

The same project builds in a path without `+`.

## Steps

```sh
git clone https://github.com/namuorg/wxt-plus-path-repro wxt+plus
cd wxt+plus
npm install
npx wxt build    # ERROR  Cannot read properties of undefined (reading 'get')

cd ..
git clone https://github.com/namuorg/wxt-plus-path-repro wxt-plain
cd wxt-plain
npm install
npx wxt build    # ✔ Built extension
```

## Cause

`removeEntrypointMainFunction` (`packages/wxt/src/internal/builders/vite/plugins/remove-entrypoint-main-function.ts`) filters on `new RegExp(`^${absPath}$`)` without escaping the path. The `t+` in `wxt+plus` is read as a quantifier, so the filter never matches `entrypoints/content.ts`, and its imports aren't removed when WXT imports it to read its options. Vite's module runner then loads `assets/style.css`, and Vite's CSS plugin crashes, since its CSS modules cache is only set up in `buildStart`.

WXT 0.20.11 compared `id === absPath` and built this project in either path.
