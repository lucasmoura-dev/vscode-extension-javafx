/* eslint-disable @typescript-eslint/naming-convention */
export interface VSCodeConfiguration {
  type: string;
  name: string;
  request: string;
  mainClass: string;
  vmArgs: string;
}

export interface VSCodeConfigurationFile {
  version: string;
  configurations: VSCodeConfiguration[];
}

export interface VSCodeJavaSettingsFile {
  "java.project.sourcePaths": string[];
  "java.project.outputPath": string;
  "java.project.referencedLibraries": string[];
}