/* eslint-disable @typescript-eslint/naming-convention */
import {
  commands,
  ExtensionContext,
  Uri,
  window,
  workspace,
  WorkspaceConfiguration,
} from "vscode";
import {
  IProjectType,
  IProjectTypeQuickPick,
  ProjectType,
} from "../types/project";
import * as fse from "fs-extra";
import * as _ from "lodash";
import workspaceUtils from "../utils/workspaceUtils";
import path = require("path");
import { Commands } from "../constants/commands";
import {
  VSCodeConfigurationFile,
  VSCodeJavaSettingsFile,
} from "../types/vscodeEnvs";
import fileDialogUtils from "../utils/fileDialogUtils";
import javaFxLibUtils from "../utils/javaFxLibUtils";
import { Configuration } from "../constants/configuration";
import { initial } from "lodash";

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

export class CreatorSimpleJavaFXProject {
  context: ExtensionContext;
  configuration: WorkspaceConfiguration;
  javaFXPath: string = '';
  projectRoot: string = '';
  templateRoot: string = '';


  constructor(context: ExtensionContext) {
    this.context = context;
    this.configuration = workspace.getConfiguration(
      Configuration.WORKSPACE_CONFIGURATION_ROOT
    );

    this.init();
  }

  async init() {
    try {
      await javaFxLibUtils.checkJavaFXLibFolder(this.configuration);
      window.showInformationMessage('Pasta lib carregada com sucesso.');
    } catch (error: any) {
      window.showErrorMessage(
        error.message ||
          error ||
          "Houve um problema na seleção da pasta lib do JavaFX."
      );
      console.error(error);
    }

    this.javaFXPath =
      this.configuration?.get(Configuration.JAVAFX_LIB_PATH) || "teste";
    this.templateRoot = path.join(
      this.context.extensionPath,
      "templates",
      "simpleJavaFXProject"
    );

    console.log(`Caminho da pasta lib: ` + this.javaFXPath);
  }

  containsJavaFXLib(): boolean {
    const libPath = this.configuration?.get(Configuration.JAVAFX_LIB_PATH);
    return !!libPath;
  }

  async checkJavaFXLibFolder(): Promise<void> {
    const libPathFromSettings = this.getLibPath();
    const containsValidPath = await fse.pathExists(libPathFromSettings);

    if (containsValidPath) {
      return;
    }

    const path = await javaFxLibUtils.chooseJavaFXPath();
  }

  async create() {
    await this.chooseProjectType();
    const basePath = await this.chooseProjectRoot();
    const projectName = await this.defineProjectName(basePath);
    this.projectRoot = path.join(basePath, projectName);

    try {
      await fse.ensureDir(this.projectRoot);
      await fse.copy(this.templateRoot, this.projectRoot);
      this.setEnvironmentSettings();
      this.addReferencedLibraries();
      this.openProject();
    } catch (error: any) {
      throw error;
    }
  }

  async chooseProjectType() {
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
  }

  async chooseProjectRoot(): Promise<string> {
    const workspaceFolder = workspaceUtils.getDefaultWorkspaceFolder();
    const location: Uri[] | undefined = await window.showOpenDialog({
      defaultUri: workspaceFolder && workspaceFolder.uri,
      canSelectFiles: false,
      canSelectFolders: true,
      openLabel: "Selecione o diretório do projeto",
    });

    if (!location || !location.length) {
      throw new Error("Invalid project root");
    }

    return location[0].fsPath;
  }

  async defineProjectName(basePath: string): Promise<string> {
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
      throw new Error("Invalid project name");
    }

    return projectName;
  }

  async openProject(): Promise<void> {
    const openInNewWindow = workspace && !_.isEmpty(workspace.workspaceFolders);
    await commands.executeCommand(
      Commands.VSCODE_OPEN_FOLDER,
      Uri.file(this.projectRoot),
      openInNewWindow
    );
  }

  getLibPath(): string {
    // susbtituir
    let libPath: string =
      this.configuration?.get(Configuration.JAVAFX_LIB_PATH) || "";
    libPath = libPath.replace(/\\/g, "/");
    libPath = !libPath.endsWith("/lib") ? `${libPath}/lib` : libPath;
    return libPath;
  }

  async setEnvironmentSettings(): Promise<void> {
    const launchJsonFile = path.join(
      this.projectRoot /*this.templateRoot*/,
      ".vscode",
      "launch.json"
    );
    let launchJsonContent: VSCodeConfigurationFile =
      fse.readJsonSync(launchJsonFile) || {};

    const configurations = launchJsonContent.configurations.map(
      ({ vmArgs: oldVmArgs, ...rest }) => {
        const libPath = this.getLibPath();
        const vmArgs = `--module-path \"${libPath}\" --add-modules javafx.controls,javafx.fxml`;
        return { vmArgs, ...rest };
      }
    );

    fse.writeJsonSync(
      launchJsonFile,
      { ...launchJsonContent, configurations },
      {
        spaces: "\t",
      }
    );
  }

  async addReferencedLibraries(): Promise<void> {
    const settingsJsonFile = path.join(
      this.projectRoot,
      ".vscode",
      "settings.json"
    );

    let settingsJsonContent: VSCodeJavaSettingsFile =
      fse.readJsonSync(settingsJsonFile) || {};

    //d:\\Java\\Java Libs\\javafx-sdk-18.0.2\\lib\\

    const libPath = this.getLibPath();

    const javaFXReferencedLibraries = [
      `${libPath}/javafx.base.jar`,
      `${libPath}/javafx.controls.jar`,
      `${libPath}/javafx.fxml.jar`,
      `${libPath}/javafx.graphics.jar`,
      `${libPath}/javafx.media.jar`,
      `${libPath}/javafx.swing.jar`,
      `${libPath}/javafx.web.jar`,
      `${libPath}/javafx-swt.ja`,
    ];

    const newJsonContent = {
      ...settingsJsonContent,
      "java.project.referencedLibraries": [
        ...settingsJsonContent["java.project.referencedLibraries"],
        ...javaFXReferencedLibraries,
      ],
    };

    console.log(newJsonContent);

    fse.writeJsonSync(settingsJsonFile, newJsonContent, {
      spaces: "\t",
    });
  }
}
