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
} from "../types/project";
import * as fse from "fs-extra";
import * as _ from "lodash";
import workspaceUtils from "../utils/workspaceUtils";
import path = require("path");
import { Commands } from "../constants/commands";

import javaFxLibUtils from "../utils/javaFxLibUtils";
import { Configuration } from "../constants/configuration";
import projectTypes from "../constants/projectTypes";
import { EnvironmentHelper } from "../helpers/EnvironmentHelper";
import { l10n } from "vscode";

export class CreatorSimpleJavaFXProject {
  context: ExtensionContext;
  configuration: WorkspaceConfiguration;
  javaFXPath = '';
  projectRoot = '';
  templateRoot = '';

  constructor(context: ExtensionContext) {
    this.context = context;
    this.configuration = workspace.getConfiguration(
      Configuration.WORKSPACE_CONFIGURATION_ROOT
    );

    this.templateRoot = path.join(
      this.context.extensionPath,
      "templates",
      "simpleJavaFXProject"
    );

    this.init();
  }

  async init() {
    try {
      this.javaFXPath = await javaFxLibUtils.checkJavaFXLibFolder(this.configuration);
      // window.showInformationMessage(l10n.t('success.javaFxLoaded'));
    } catch (error: any) {
      window.showErrorMessage(
        error.message ||
          error ||
          l10n.t('error.javaFxLoaded')
      );
      console.error(error);
    }
  }

  async create() {
    await this.chooseProjectType();
    const basePath = await this.chooseProjectRoot();
    const projectName = await this.defineProjectName(basePath);
    this.projectRoot = path.join(basePath, projectName);
    const environmentHelper = new EnvironmentHelper(this.projectRoot, this.javaFXPath);

    try {
      await fse.ensureDir(this.projectRoot);
      await fse.copy(this.templateRoot, this.projectRoot);
      environmentHelper.setEnvironmentSettings();
      environmentHelper.addReferencedLibraries();
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
      placeHolder: l10n.t('createProject.selectType'),
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
      openLabel: l10n.t('createProject.chooseProjectRoot'),
    });

    if (!location || !location.length) {
      throw new Error(l10n.t('error.invalidProjectRoot'));
    }

    return location[0].fsPath;
  }

  async defineProjectName(basePath: string): Promise<string> {
    const projectName: string | undefined = await window.showInputBox({
      prompt: l10n.t('createProject.enterProjectName'),
      ignoreFocusOut: true,
      validateInput: async (name: string): Promise<string> => {
        if (name && !name.match(/^[^*~/\\]+$/)) {
          return l10n.t('info.invalidProjectName');
        }
        if (name && (await fse.pathExists(path.join(basePath, name)))) {
          return l10n.t('info.duplicatedProjectName');
        }
        return "";
      },
    });

    if (!projectName) {
      throw new Error(l10n.t('error.invalidProjectName'));
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
}
