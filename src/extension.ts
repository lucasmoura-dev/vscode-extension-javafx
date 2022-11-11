import {
  commands,
  ExtensionContext
} from "vscode";

import { CreatorSimpleJavaFXProject } from "./commands/createSimpleProject";

export function activate(context: ExtensionContext) {
  const disposable = commands.registerCommand("javafx.createJavaFx", () => {
    new CreatorSimpleJavaFXProject(context)
      .create();
  });

  context.subscriptions.push(disposable);
}