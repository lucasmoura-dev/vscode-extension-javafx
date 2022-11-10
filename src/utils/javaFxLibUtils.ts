import fileDialogUtils from "./fileDialogUtils";
import * as fse from "fs-extra";
import { WorkspaceConfiguration } from "vscode";
import { Configuration } from "../constants/configuration";
import { config } from "process";

const checkJavaFXLibFolder = async (
  configuration: WorkspaceConfiguration
): Promise<string> => {
  const pathFromConfiguration: string | undefined = configuration?.get(Configuration.JAVAFX_LIB_PATH);
  if (pathFromConfiguration) {
    const parsedPath = parseLibPath(pathFromConfiguration);
    const containsValidPath = await fse.pathExists(parsedPath);

    if (containsValidPath) {
      return parsedPath;
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
    const path = fileDialogUtils.chooseFolder(
      "Selecione a pasta lib do JavaFX"
    );
    return path;
  } catch (error) {
    throw new Error("Invalid JavaFX lib folder");
  }
};

export default {
  parseLibPath,
  chooseJavaFXPath,
  checkJavaFXLibFolder,
};
