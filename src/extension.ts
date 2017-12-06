'use strict';

import * as vscode from 'vscode';
import config from './config';

export function activate(context: vscode.ExtensionContext) {
    const contentProviderRegistration = vscode.workspace.registerTextDocumentContentProvider('glo', new GloContentProvider());
    context.subscriptions.push(contentProviderRegistration);

    let disposable = vscode.commands.registerCommand('extension.openGlo', () => {
        vscode.commands.executeCommand(
            'vscode.previewHtml',
            vscode.Uri.parse('glo://view'),
            undefined,
            'Glo'
        );
    });

    context.subscriptions.push(disposable);

    const statusBarItem = vscode.window.createStatusBarItem();
    statusBarItem.text = 'Glo';
    statusBarItem.command = 'extension.openGlo';
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
                <link href="https://unpkg.com/basscss@8.0.3/css/basscss.min.css" rel="stylesheet">
                <link href="https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i" rel="stylesheet">
                <script src="https://use.fontawesome.com/a7d36f32d6.js"></script>
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

                    #app {
                        height: 100%;
                    }
                </style>
            </head>
            <body>
                <div id="app"></div>
                <script charset="utf-8" src="${appUrlWithSlash}/bundle.js"></script>
            </body>
            </html>
        `;
    }
}
