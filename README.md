# Project Manager for JavaFX

> Manage JavaFX projects in Visual Studio Code.

If you liked this extension, come meet my youtube channel:
[YouTube/AcademiadosDevs](https://www.youtube.com/c/AcademiadosDevs)


## Overview

A lightweight extension to manage JavaFX projects. It works with [Language Support for Java by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.java).

## How to

### Download JavaFX's lib
1. First you need to download JavaFX's lib [here](https://gluonhq.com/products/javafx/);
2. Extract the JavaFX's folder to a directory of your choose. You'll need to use
the path of `lib/` folder;

### Create a JavaFX project
1. Press `CTRL + SHIFT + P` and type `javafx`, choose the option to create a javaFX project;
2. If is your first time after installed this extension, will ask you to tell the javaFX's 
`lib` folder. Don't worry, you will only set the JavaFX directory once.
3. Now you'll need to choose the project's root, where the project will be saved;
4. Now you just need to tell the project's name;
5. The Visual Studio Code will open your project. Now press `F5` to run the 'hello world`
example. 

## Requirements

- JDK (version 11 or later)
- [JavaFX's lib](https://gluonhq.com/products/javafx/)
- VS Code (version 1.44.0 or later)
- [Language Support for Java by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.java) (version 0.32.0 or later)

## Extension Settings

This extension contributes the following settings:

* `javafx.libPath`: Specify the JavaFX's  'lib' path that contains `.jar` files;

## Release Notes

### 0.0.1
Created the project.