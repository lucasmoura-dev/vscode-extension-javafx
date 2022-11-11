import fileDialogUtils from "./fileDialogUtils";
import * as fse from "fs-extra";
import { window, WorkspaceConfiguration } from "vscode";
import { Configuration } from "../constants/configuration";
import path = require("path");
import { VSCodeJavaSettingsFile } from "../types/vscodeEnvs";
import javaFXJarFiles from "../constants/javaFxJarFiles";

const checkJavaFXLibFolder = async (
  configuration: WorkspaceConfiguration
): Promise<string> => {
  const pathFromConfiguration: string | undefined = configuration?.get(Configuration.JAVAFX_LIB_PATH);
  if (pathFromConfiguration) {
    const parsedPath = parseLibPath(pathFromConfiguration);
    const containsValidPath = await fse.pathExists(parsedPath);

    if (containsValidPath) {
      return parsedPath;
    } else {
      window.showErrorMessage('O diretório da pasta lib do JavaFX é inválido.');
    }
  }
  
  const newPath = await chooseJavaFXPath();
  const parsedNewPath = parseLibPath(newPath);
  await configuration.update(Configuration.JAVAFX_LIB_PATH, parsedNewPath, true);
  console.log('JavaLib folder updated!', configuration.get(Configuration.JAVAFX_LIB_PATH));
  return parsedNewPath;
};

const parseLibPath = (oldPath: string): string => {
  let path: string = oldPath;
  path = path.replace(/\\/g, "/");
  path = !path.endsWith("/lib") ? `${path}/lib` : path;
  return path;
};

const chooseJavaFXPath = async (): Promise<string> => {
  try {
    window.showInformationMessage("Selecione a pasta 'lib' do javaFX.");
    const path = fileDialogUtils.chooseFolder(
      "Selecione a pasta lib do JavaFX"
    );
    return path;
  } catch (error) {
    throw new Error("Invalid JavaFX lib folder");
  }
};

const createJavaFXSettingsJson = (projectRootPath: string, javaFXLibPath: string) => {
  const settingsJsonFilePath = path.join(
    projectRootPath,
    ".vscode",
    "settings.json"
  );

  const settingsJsonContent: VSCodeJavaSettingsFile=
      fse.readJsonSync(settingsJsonFilePath) || {};

  const parsedJavaFXLibPath = javaFXLibPath.endsWith('/') ? 
    javaFXLibPath.slice(0, -1) : javaFXLibPath;

  const javaFXReferencedLibraries = javaFXJarFiles.map(jar => `${parsedJavaFXLibPath}/${jar}`);
  
  const newJsonContent = {
    ...settingsJsonContent,
    "java.project.referencedLibraries": [
      ...settingsJsonContent["java.project.referencedLibraries"],
      ...javaFXReferencedLibraries,
    ],
  };

  return newJsonContent;
};

export default {
  parseLibPath,
  chooseJavaFXPath,
  checkJavaFXLibFolder,
  createJavaFXSettingsJson,
};
