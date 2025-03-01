#  🚀 RUXAILAB Testing App 

This project is an application built using ElectronJS and Vue.js. The purpose of this application is to register user events during UI tests and generate analytics, such as heatmaps, to analyze user behavior.

</br>

## 🛠️ Tools Used

- **ElectronJS**: ElectronJS is a framework for creating native applications with web technologies like JavaScript, HTML, and CSS. It takes care of the hard parts so you can focus on the core of your application.

- **Vue.js**: Vue.js is a progressive JavaScript framework for building user interfaces. Vue is designed from the ground up to be incrementally adoptable, making it easy to integrate with other libraries or existing projects.

</br>
</br>

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js and npm](https://nodejs.org/en/download/) >= v20.11.1 (Earlier versions have not been tested but might also work)

</br>

## 📥 Installing tests-app

To install tests-app, follow these steps:

1. Clone the repository
```sh
git clone https://github.com/ruxailab/heatmap-app.git
```

2. Navigate to the project directory
```sh
cd heatmap-app
```

3. Install the dependencies
```sh
npm install
```

</br>

## 🚀 Running tests-app

To run tests-app, use the following npm scripts:

- To start the Electron application, use:
```sh
npm run electron:start
```

- To start the application in development mode, use:
```sh
npm run dev
```
Note: Some parts of the application will not work in this mode because only the Vue frontend will be displayed.

</br>

## 📦 Packaging the Application

[Electron Forge](https://www.electronforge.io/) is used to package and make distributable versions of the application. The following npm scripts are available:

- To start the application with Electron Forge, use:
```sh
npm run start
```

- To package the application into a directory, use:
```sh
npm run package
```

- To generate distributables for the current platform, use:
```sh
npm run make
```

