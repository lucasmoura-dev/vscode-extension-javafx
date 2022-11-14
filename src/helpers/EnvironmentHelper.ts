import * as fse from "fs-extra";
import path = require("path");
import { VSCodeSettingsFiles } from "../constants/vscodeSettingsFiles";
import { VSCodeConfigurationFile } from "../types/vscodeEnvs";
import javaFxLibUtils from "../utils/javaFxLibUtils";

export class EnvironmentHelper {
  projectRoot: string;
  javaFXPath: string;
  launchJsonFile: string;
  settingsJsonFile: string;
  settingsFormatOptions: fse.WriteOptions;

  constructor(projectRoot: string, javaFXPath: string) {
    this.projectRoot = projectRoot;
    this.javaFXPath = javaFXPath;
    const settingsRoot = path.join(this.projectRoot, VSCodeSettingsFiles.ROOT);
    
    this.launchJsonFile = path.join(settingsRoot, VSCodeSettingsFiles.LAUNCH_JSON);
    this.settingsJsonFile = path.join(settingsRoot, VSCodeSettingsFiles.SETTINGS_JSON);
    this.settingsFormatOptions = { spaces: "\t" };
  }

  async setEnvironmentSettings(): Promise<void> {
    const launchJsonContent: VSCodeConfigurationFile =
      fse.readJsonSync(this.launchJsonFile) || {};

    const configurations = launchJsonContent.configurations.map(
      ({ vmArgs: oldVmArgs, ...rest }) => {
        const vmArgs = `--module-path \"${this.javaFXPath}\" --add-modules javafx.controls,javafx.fxml`;
        return { vmArgs, ...rest };
      }
    );

    fse.writeJsonSync(
      this.launchJsonFile,
      { ...launchJsonContent, configurations },
      this.settingsFormatOptions
    );
  }

  async addReferencedLibraries(): Promise<void> {
    const settingsJson = javaFxLibUtils.createJavaFXSettingsJson(this.projectRoot, this.javaFXPath);
    fse.writeJsonSync(this.settingsJsonFile, settingsJson, this.settingsFormatOptions);
  }

}
