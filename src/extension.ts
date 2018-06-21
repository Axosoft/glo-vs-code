'use strict';

import * as vscode from 'vscode';
import config from './config';

const DEBUG = false;
function debug(fn: Function) {
    DEBUG && fn();
}

const APP_TITLE = 'Glo';
const OPEN_COMMAND = 'glo.open';

enum MessageType {
    GetState = 'getState',
    SetState = 'setState',
    OpenLink = 'shell.openExternal'
}

type GetStateMessage = {
    type: MessageType.GetState
}
type SetStateMessage = {
    type: MessageType.SetState,
    args: object[]
}
type OpenLinkMessage = {
    type: MessageType.OpenLink,
    args: string[]
}

type Message = GetStateMessage | SetStateMessage | OpenLinkMessage;

export function activate(context: vscode.ExtensionContext) {
    const openGloCommand = vscode.commands.registerCommand(OPEN_COMMAND, () => createWebviewPanel(context));
    context.subscriptions.push(openGloCommand);

    const statusBarItem = vscode.window.createStatusBarItem();
    statusBarItem.text = APP_TITLE;
    statusBarItem.command = OPEN_COMMAND;
    statusBarItem.show();

    context.subscriptions.push(statusBarItem);

    debug(() => vscode.commands.executeCommand(OPEN_COMMAND));
}

export function deactivate() {}

function createWebviewPanel(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'gitkraken-glo',
        APP_TITLE,
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.webview.html = getWebviewContent();

    panel.webview.onDidReceiveMessage((message: Message) => {
        switch (message.type) {
            case MessageType.GetState:
                panel.webview.postMessage({
                    from: 'extension',
                    type: 'sendState',
                    state: context.globalState.get('appState', {})
                });
                break;

            case MessageType.SetState:
                context.globalState.update('appState', message.args[0]);
                break;

            case MessageType.OpenLink:
                vscode.commands.executeCommand(
                    'vscode.open',
                    vscode.Uri.parse(message.args[0])
                );
                break;
        }
    });

    debug(() => setTimeout(() => vscode.commands.executeCommand('workbench.action.webview.openDeveloperTools'), 1000));
}

function getWebviewContent() {
    const appUrlWithSlash = config.appUrl + (config.appUrl.endsWith('/') ? '' : '/');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${APP_TITLE}</title>
            <style>
                body {
                    padding: 0;
                    margin: 0;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                }

                iframe {
                    height: 100%;
                    width: 100%;
                    border: none;
                }
            </style>
            <script>
                var vscode = acquireVsCodeApi();

                window.addEventListener('message', (event) => {
                    if (event.data.from === 'iframe') {
                        vscode.postMessage(event.data);
                    } else if (event.data.from === 'extension') {
                        document.querySelector('iframe').contentWindow.postMessage(event.data, '*');
                    }
                });
            </script>
        </head>
        <body>
            <iframe src="${appUrlWithSlash}" />
        </body>
        </html>
    `;
}
