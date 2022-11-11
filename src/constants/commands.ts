// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { commands } from "vscode";
/**
 * Commonly used commands
 */
export enum Commands {
    /**
     * Execute Workspace Command
     */
    EXECUTE_WORKSPACE_COMMAND = "java.execute.workspaceCommand",

    VIEW_PACKAGE_CHANGETOFLATPACKAGEVIEW = "java.view.package.changeToFlatPackageView",

    VIEW_PACKAGE_CHANGETOHIERARCHICALPACKAGEVIEW = "java.view.package.changeToHierarchicalPackageView",

    VIEW_PACKAGE_LINKWITHFOLDER = "java.view.package.linkWithFolderExplorer",

     VIEW_PACKAGE_UNLINKWITHFOLDER = "java.view.package.unlinkWithFolderExplorer",

     VIEW_PACKAGE_REFRESH = "java.view.package.refresh",

     VIEW_PACKAGE_INTERNAL_REFRESH = "_java.view.package.internal.refresh",

     VIEW_PACKAGE_OUTLINE = "java.view.package.outline",

     VIEW_PACKAGE_REVEAL_FILE_OS = "java.view.package.revealFileInOS",

     VIEW_PACKAGE_COPY_FILE_PATH = "java.view.package.copyFilePath",

     VIEW_PACKAGE_COPY_RELATIVE_FILE_PATH = "java.view.package.copyRelativeFilePath",

     VIEW_PACKAGE_EXPORT_JAR = "java.view.package.exportJar",

     EXPORT_JAR_REPORT = "java.view.package.exportJarReport",

     VIEW_PACKAGE_NEW_JAVA_CLASS = "java.view.package.newJavaClass",

     VIEW_PACKAGE_NEW_JAVA_PACKAGE = "java.view.package.newPackage",

     VIEW_PACKAGE_RENAME_FILE = "java.view.package.renameFile",

     VIEW_PACKAGE_MOVE_FILE_TO_TRASH = "java.view.package.moveFileToTrash",

     VIEW_PACKAGE_DELETE_FILE_PERMANENTLY = "java.view.package.deleteFilePermanently",

     VIEW_PACKAGE_REVEAL_IN_PROJECT_EXPLORER = "java.view.package.revealInProjectExplorer",

     JAVA_PROJECT_OPEN = "_java.project.open",

     JAVA_PROJECT_CREATE = "java.project.create",

     JAVA_PROJECT_ADD_LIBRARIES = "java.project.addLibraries",

     JAVA_PROJECT_ADD_LIBRARY_FOLDERS = "java.project.addLibraryFolders",

     JAVA_PROJECT_REMOVE_LIBRARY = "java.project.removeLibrary",

     JAVA_PROJECT_REFRESH_LIBRARIES = "java.project.refreshLibraries",

     JAVA_PROJECT_BUILD_WORKSPACE = "java.project.build.workspace",

     JAVA_PROJECT_CLEAN_WORKSPACE = "java.project.clean.workspace",

     JAVA_PROJECT_UPDATE = "java.project.update",

     JAVA_PROJECT_RELOAD_ACTIVE_FILE = "java.project.reloadProjectFromActiveFile",

     JAVA_PROJECT_REBUILD = "java.project.rebuild",

     JAVA_PROJECT_EXPLORER_FOCUS = "javaProjectExplorer.focus",

     JAVA_PROJECT_LIST = "java.project.list",

     JAVA_PROJECT_REFRESH_LIB_SERVER = "java.project.refreshLib",

     JAVA_GETPACKAGEDATA = "java.getPackageData",

     JAVA_RESOLVEPATH = "java.resolvePath",

     JAVA_PROJECT_GETMAINCLASSES = "java.project.getMainClasses",

     JAVA_PROJECT_GENERATEJAR = "java.project.generateJar",

     JAVA_BUILD_WORKSPACE = "java.workspace.compile",

     JAVA_CLEAN_WORKSPACE = "java.clean.workspace",

     JAVA_PROJECT_CONFIGURATION_UPDATE = "java.projectConfiguration.update",

     JAVA_RESOLVE_BUILD_FILES = "vscode.java.resolveBuildFiles",

     JAVA_PROJECT_LIST_SOURCE_PATHS = "java.project.listSourcePaths",

     INSTALL_EXTENSION = "java.project.installExtension",

     JAVA_UPDATE_DEPRECATED_TASK = "java.updateDeprecatedTask",

    /**
     * Commands from Visual Studio Code
     */
     VSCODE_OPEN_FOLDER = "vscode.openFolder",

     VSCODE_OPEN = "vscode.open",

     WORKBENCH_ACTION_FILES_OPENFOLDER = "workbench.action.files.openFolder",

     WORKBENCH_ACTION_FILES_OPENFILEFOLDER = "workbench.action.files.openFileFolder",

     WORKBENCH_VIEW_PROBLEMS = "workbench.actions.view.problems",

    /**
     * Commands from JLS
     */
     LIST_SOURCEPATHS = "java.project.listSourcePaths",

     COMPILE_WORKSPACE = "java.workspace.compile",

     GET_ALL_PROJECTS = "java.project.getAll",

     BUILD_PROJECT = "java.project.build",
}

export function executeJavaLanguageServerCommand(...rest: unknown[]) {
  return executeJavaExtensionCommand(Commands.EXECUTE_WORKSPACE_COMMAND, ...rest);
}

export async function executeJavaExtensionCommand(commandName: string, ...rest: unknown[]) {
  // TODO: need to handle error and trace telemetry
  return commands.executeCommand(commandName, ...rest);
}
