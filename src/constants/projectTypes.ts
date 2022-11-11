import { IProjectType, ProjectType } from "../types/project";

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

export default projectTypes;