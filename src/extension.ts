import {
  commands,
  ExtensionContext,
  extensions,
} from "vscode";

import { CreatorSimpleJavaFXProject } from "./commands/createSimpleProject";

export function activate(context: ExtensionContext) {
  const disposable = commands.registerCommand("javafx.createJavaFx", () => {
    new CreatorSimpleJavaFXProject(context)
      .create();
  });

  context.subscriptions.push(disposable);
}

function checkOtherExtensionExists(): boolean {
  const javaExtensionPath = extensions.getExtension(
    "vscjava.vscode-java-dependency"
  )?.extensionPath;

  if (!javaExtensionPath) {
    console.error(
      `Extension path for "vscjava.vscode-java-dependency" not found.`
    );
    return false;
  }

  console.log(`Caminho da extensão: ${javaExtensionPath}`);
  return true;
}
