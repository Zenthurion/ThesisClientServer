# Source Code for my Thesis Project

The source code is split into two parts: The backend server, and the client server. Each part has its own GitHub repository. Below is a description on how to navigate the repository to find the relevant source code. There is also a description on how to run the system, although an already running instance of the latest version can be found on http://142.93.44.236:3000/.

| Repository | URL                                               |
| ---------: | ------------------------------------------------- |
|    Backend | https://github.com/Zenthurion/ThesisBackendServer |
|     Client | https://github.com/Zenthurion/ThesisClientServer  |

---

## Client Server

The client server provides a web-based client to users of the system developed for my thesis project. The code is written in TypeScript on Node.js using React.

### Source

The code written by me can be found in the src/ directory. There are two sub-directories here, with the events/ directory containing the code used to ensure a modicum of type-safety between the server and clients. This folder is identical between the two repositories. The components/ directory contains the custom React components (.tsx files) implemented to provide the necessary visual representation of the clients. The code was initialised using the create-react-app toolchain for TypeScript, and some of the contents of src were created automatically through this (App.css, App.test.tsx, index.css, index.tsx, logo.svg, react-app-env.d.ts, serviceWorker.ts, setupTests.ts).

At the root of the repository, the remaining configuration files can be found, along with a few directories.

public/ contains some of the files generated through the create-react-app toolchain.

### How to Run

First, it is necessary to initialise node.js. The system has been implemented and tested using version 12 LTS. Once node is installed, run:

```
npm install
```

Then, to run the server directly:

```
npm start
```

OR

```
npm run dev
```

The application runs on port 3000 (e.g. 127.0.0.1:3000)

To run it with docker:

```docker
docker pull zenthurion/thesis-client-server
docker run -d -p 3000:3000 --name client zenthurion/thesis-client-server
```
