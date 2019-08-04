# JS Shell

**Note: This is currently prototype, and experimental code; it is not recommended for usage at all right now**

General-purpose, multi-threaded, computing environment for web browsers and tablets, with STDIO bindings into a Node.js server over a Socket.io bridge.

It is like a virtual desktop into a Docker / Linux server, though the desktop is not streamed (only file / data I/O), and the execution context is pure JavaScript.

The Shell GUI frontend will have full local user privileges (and can be elevated) into the Docker / Linux server it is bound to.

## Current Development State

Pre-initial prototype.

## Building / Running

Build instructions are not avialable at this time, however it uses a Docker Compose configuration.

It can be preliminarily spun up by executing:

```
$ git submodule init
$ git submodule update
$ docker-compose up
```

However, currently, it is all configured for development, and there are no install scripts, so git submodules and npm packages need to manually installed in the relevant directories (e.g. backend / frontend).

Note: One of the git submodules links to a private Bitbucket repository (stt-socket), and is utilized for doing speech-to-text handling.  This particular submodule can be safely ignored for all other functionality.

## System Design

### Docker Modules

The {root}/docker_modules directory specifies additional Docker packages which help form the infrastructure of the Shell and its related services.

### Backend

Currently developed with Node.js 10, run straight from source (not compiled) and supports ES5 require statements.

- Source file compilation: None
- Module import syntax:
  ```
  const package = require('module-name');
  ```

- Module path resolution definitions: backend/package.json (_moduleAliases)

### Frontend

Currently developed with Node.js 10, compiled with Webpack, and supports ES6+ / CommonJS import statements.

- Built on: [Facebook's Create React App](https://github.com/facebook/create-react-app)
- Source file compilation: Webpack
- Additional configuration: frontend/config-overrides.js
- HMR (Hot Module Replacement) supported: Yes
- Module import syntax (ES6+ / CommonJS):
  ```
  import package from 'module-name';
  ```
- Module path resolution definitions: frontend/jsonconfig.json (compilerOptions.paths)

Path resolutions:

The following paths make up the various utilities and views which bootstrap the Shell Desktop (UI) environment and related resources.

- "apps" (frontend/src/apps): Individual applications which run in the Shell Desktop environment.  Applications typically contain their own set of UI components, though they all use resources from the general "components" below.
- "components" (frontend/src/components): React UI components, most of which are reusable and outside of an application-specific context.
- "config" (frontend/src/config): Configuration for the Shell Desktop.  Any values which may be passed from the environment should be intercepted here and exposed accordingly.
- "core" (frontend/src/core): Core processes and utilties which initialize the Shell and its services.
- "icons" (frontend/src/icons): SVG icons which, when included in components, are compiled into the Shell's JavaScript.
- "process" (frontend/src/process): A set of classes which comprise a forkable virtual process system, with STDIO, and several process extentions which provide STDIO / controller access to native Web Workers, audio and video hardware, etc.
- "shared" (frontend/src/shared): Data structures and code which are shared between server and client.
- "state" (frontend/src/state): A set of classes which provide multi-channeled state management for the Shell Desktop environment.
- "utils" (frontend/src/utils): Utility methods and factory functions for controlling the Shell Desktop environment.  These utilities make simple, programmatic interfaces for controlling all facets of the Shell Desktop environment.

## Optional

### Linux (Ubuntu / Debian) Temperature
In some cases you need to install the linux sensors package to be able to measure temperature e.g. on DEBIAN based systems by running sudo apt-get install lm-sensors

### Linux (Ubuntu / Debian) S.M.A.R.T. Status
To be able to detect S.M.A.R.T. status on Linux you need to install smartmontools. On DEBIAN based linux distributions you can install it by running sudo apt-get install smartmontools

## Installation / Dependencies

- Ubuntu Linux (Debian / other distros may work, if they use freedesktop architecture)
- Node.js 10+

## Technologies Utilized

### Desktop Environment

- JavaScript (specifically, Node.js 10+)

### Server Environment

- Ubuntu
- Docker

## Motto

To contribute, however slightly, to the commonwealth of all human innovation and experience.
