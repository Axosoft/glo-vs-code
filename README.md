# glo-vs-code

Glo for VS Code

## Development Setup

1. copy `src/config-template.ts` to `src/config.ts`
2. set the `appUrl` in `config.ts` to your local Glo url
3. run `yarn` to install dependencies

## Debugging

You can debug the VS Code side via the built-in VS Code debugger, but to debug the Glo side, since Glo runs inside a webview, you will need to open the webview's dev tools.
Call the `openDevTools` function on the webview node (ex: `$0.openDevTools()` when the node is selected).
