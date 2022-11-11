import { l10n } from "vscode";
import { IProjectType, ProjectType } from "../types/project";

const projectTypes: IProjectType[] = [
  {
    displayName: l10n.t('Simple'),
    detail: l10n.t('Create a JavaFX project without build tools.'),
    metadata: {
      type: ProjectType.SimpleJavaFX,
      extensionId: "",
      extensionName: "",
      createCommandId: "",
    },
  },
];

export default projectTypes;