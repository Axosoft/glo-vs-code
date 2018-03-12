'use strict';

import * as vscode from 'vscode';
import config from './config';

export function activate(context: vscode.ExtensionContext) {
    const contentProviderRegistration = vscode.workspace.registerTextDocumentContentProvider('glo', new GloContentProvider());
    context.subscriptions.push(contentProviderRegistration);

    let openCommand = vscode.commands.registerCommand('extension.glo.open', () => {
        vscode.commands.executeCommand(
            'vscode.previewHtml',
            vscode.Uri.parse('glo://view'),
            undefined,
            'Glo'
        );
    });

    context.subscriptions.push(openCommand);

    let openLinkCommand = vscode.commands.registerCommand('extension.glo.openLink', (uri) => {
        vscode.commands.executeCommand(
            'vscode.open',
            vscode.Uri.parse(uri)
        );
    });

    context.subscriptions.push(openLinkCommand);

    const statusBarItem = vscode.window.createStatusBarItem();
    statusBarItem.text = 'Glo';
    statusBarItem.command = 'extension.glo.open';
    statusBarItem.show();

    context.subscriptions.push(statusBarItem);
}

export function deactivate() {
}

class GloContentProvider implements vscode.TextDocumentContentProvider {
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken) {
        const appUrlWithSlash = config.appUrl + (config.appUrl.endsWith('/') ? '' : '/');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>GitKraken Glo</title>
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
                    window.addEventListener('message', (event) => {
                        const data = event.data;
                        if (!data) {
                            return;
                        }

                        if (data.channel === 'shell.openExternal') {
                            window.parent.postMessage({
                                command: 'did-click-link',
                                data: 'command:extension.glo.openLink?' + JSON.stringify(data.args[0])
                            }, 'file://');
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
}
