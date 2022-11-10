import { QuickPickItem } from "vscode";

export interface IProjectType {
  displayName: string;
  description?: string;
  detail?: string;
  metadata: IProjectTypeMetadata;
}

interface IProjectTypeMetadata {
  type: ProjectType;
  extensionId: string;
  extensionName: string;
  leastExtensionVersion?: string;
  createCommandId: string;
  createCommandArgs?: any[];
}

export enum ProjectType {
  SimpleJavaFX = "SimpleJavaFX",
  JavaFXML = "SimpleJavaFXML",
}

export interface IProjectTypeQuickPick extends QuickPickItem {
  metadata: IProjectTypeMetadata;
}