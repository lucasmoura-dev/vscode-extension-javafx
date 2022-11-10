import { Uri, window } from "vscode";

const chooseFolder = async (openLabel?: string): Promise<string> => {
  const path: Uri[] | undefined = await window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    openLabel: openLabel,
  });

  if (!path || !path.length) {
    throw new Error("Invalid folder path");
  }

  return path[0].fsPath;
};

export default {
  chooseFolder,
};