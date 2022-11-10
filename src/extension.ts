// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fse from "fs-extra";
import * as _ from "lodash";
import path = require("path");
import {
  commands,
  ExtensionContext,
  extensions,
  Uri,
  window,
  workspace,
} from "vscode";
import { Commands } from "./constants/commands";
import {
  IProjectType,
  IProjectTypeQuickPick,
  ProjectType,
} from "./types/project";
import workspaceUtils from "./utils/workspaceUtils";
import { VSCodeConfigurationFile } from "./types/vscodeEnvs";
import { CreatorSimpleJavaFXProject } from "./commands/createSimpleProject";

const projectTypes: IProjectType[] = [
  {
    displayName: "Simples",
    detail: "Crie um projeto JavaFX sem build tools.",
    metadata: {
      type: ProjectType.SimpleJavaFX,
      extensionId: "",
      extensionName: "",
      createCommandId: "",
    },
  },
];

export function activate(context: ExtensionContext) {
  const disposable = commands.registerCommand("javafx.createJavaFx", () => {
    new CreatorSimpleJavaFXProject(context)
      .create();
  });

  context.subscriptions.push(disposable);
}

async function createSimpleJavaFXProject(
  context: ExtensionContext
): Promise<void> {
  const configuration = workspace.getConfiguration("javafx");

  const javaFXLibPath = configuration?.get("libPath") || "teste";

  console.log(`Caminho da pasta lib: ` + javaFXLibPath);

  const items: IProjectTypeQuickPick[] = projectTypes.map(
    (type: IProjectType) => {
      return {
        label: type.displayName,
        description: type.description,
        detail: type.metadata.extensionName
          ? `Provided by $(extensions) ${type.metadata.extensionName}`
          : type.detail,
        metadata: type.metadata,
      };
    }
  );

  const choice = await window.showQuickPick(items, {
    ignoreFocusOut: true,
    placeHolder: "Selecione o tipo do projeto JavaFX",
  });

  if (!choice) {
    return;
  }

  const workspaceFolder = workspaceUtils.getDefaultWorkspaceFolder();
  const location: Uri[] | undefined = await window.showOpenDialog({
    defaultUri: workspaceFolder && workspaceFolder.uri,
    canSelectFiles: false,
    canSelectFolders: true,
    openLabel: "Selecione o diretório do projeto",
  });

  if (!location || !location.length) {
    return;
  }

  const basePath: string = location[0].fsPath;
  const projectName: string | undefined = await window.showInputBox({
    prompt: "Digite o nome do projeto JavaFX",
    ignoreFocusOut: true,
    validateInput: async (name: string): Promise<string> => {
      if (name && !name.match(/^[^*~/\\]+$/)) {
        return "Digite um nome de projeto válido!";
      }
      if (name && (await fse.pathExists(path.join(basePath, name)))) {
        return "Já existe um projeto com esse nome!";
      }
      return "";
    },
  });

  if (!projectName) {
    return;
  }

  const projectRoot: string = path.join(basePath, projectName);
  const templateRoot: string = path.join(
    context.extensionPath,
    "templates",
    "simpleJavaFXProject"
  );

  try {
    await fse.ensureDir(projectRoot);
    await fse.copy(templateRoot, projectRoot);
    let launchJson: VSCodeConfigurationFile =
      fse.readJsonSync(path.join(projectRoot, ".vscode", "launch.json")) || {};

    const updatedConfigurations = launchJson.configurations.map(
      ({ vmArgs: oldVmArgs, ...rest }) => {
        let libPath: string =
          configuration?.get("libPath") || '';
        
        libPath = libPath.replace("\\", "4");
        libPath = !libPath.endsWith("/lib") ? `${libPath}/lib` : libPath;

        if (!fse.pathExistsSync(libPath)) {
          console.error("O diretório da pasta lib do JavaFX é inválido!");
        }

        const vmArgs = `--module-path \"${libPath}\" --add-modules javafx.controls,javafx.fxml`;

        return { vmArgs, ...rest };
      }
    );

    console.log(updatedConfigurations);

    await fse.ensureDir(path.join(projectRoot, "lib"));
  } catch (error: any) {
    window.showErrorMessage(error.message);
    return;
  }

  const openInNewWindow = workspace && !_.isEmpty(workspace.workspaceFolders);
  await commands.executeCommand(
    Commands.VSCODE_OPEN_FOLDER,
    Uri.file(path.join(basePath, projectName)),
    openInNewWindow
  );
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

// This method is called when your extension is deactivated
export function deactivate() {}
