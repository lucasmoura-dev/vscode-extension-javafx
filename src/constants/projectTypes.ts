import { l10n } from "vscode";
import { IProjectType, ProjectType } from "../types/project";

const projectTypes: IProjectType[] = [
  {
    displayName: "Simples",
    detail: l10n.t('createProject.type.simple.detail'),
    metadata: {
      type: ProjectType.SimpleJavaFX,
      extensionId: "",
      extensionName: "",
      createCommandId: "",
    },
  },
];

export default projectTypes;