'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "glo-vs-code" is now active!');

    const contentProviderRegistration = vscode.workspace.registerTextDocumentContentProvider('glo', new GloContentProvider());
    context.subscriptions.push(contentProviderRegistration);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        vscode.commands.executeCommand(
            'vscode.previewHtml',
            vscode.Uri.parse('glo://view'),
            undefined,
            'GK Glo'
        );
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class GloContentProvider implements vscode.TextDocumentContentProvider {
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken) {
        const bundlePath = path.resolve(__dirname, 'glo.js');
        const bundleUri = 'file://' + bundlePath;

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>GK Glo</title>
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
                <script charset="utf-8" src="${bundleUri}"></script>
            </body>
            </html>
        `;
    }
}