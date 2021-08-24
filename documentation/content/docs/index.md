title: Documentation
---

The ParaView Lite is a Web client that enables data processing and visualization using a remote ParaView process. The user can load and filter and visualize remote data without the burden of moving its data around.

ParaView Lite is part of the ParaView family and is supported by Kitware. If you have question or needs for customisation due to your specific needs you can reach us at kitware@kitware.com.

## What is ParaView Lite?

ParaView Lite is a standalone application that leverages ParaView capabilities on the server side to produce interactive visualizations over the Web. The ParaView Lite application can be used locally as a command line tool (demo-mode), within a bundle based on Electron or remotely when properly deployed.

The ParaViewWeb Lite aims to provide a more tailored user experience than the general purpose UI that you can find in our ParaView Qt client. It also open other options in term of deployment as nothing needs to be install on the client side as only a browser is required.

## Installation

To try out ParaView Lite, you will need ParaView 5.6+. Then depending on your system, you can run one of the following command line:


```sh macOS
$ cd ParaView.app/Contents
$ ./bin/pvpython -m paraview.apps.lite  \
    --data $PWD/data                     \
    --port 8080

==> Open your browser to http://localhost:8080/
```

```sh Linux
$ cd ParaView-5.10+
$ ./bin/pvpython -m paraview.apps.lite  \
    --data $PWD/data                          \
    --port 8080

==> Open your browser to http://localhost:8080/
```

```sh Windows
$ cd ParaView-5.10+
$ .\bin\pvpython.exe -m paraview.apps.lite  \
   --data "C:\...full_path...\data"                           \
   --port 8080

==> Open your browser to http://localhost:8080/
```


For production usage, ParaView Lite should be deployed within your Web infrastructure following the proper requirements:

1) Serve the ParaView Lite application to the client (Static content: JS + HTML) using any kind of Web server (Apache, Nginx, Tomcat, Node...).
2) Enable the client to start a new ParaView process on the server side (Cluster). We provide a generic launcher implementation using Python which could be replaced with something more appropriate to your infrastructure.
3) Configure your network to forward the WebSocket connection to the proper backend host running the ParaView server.

For better rendering performance, the ParaView server should run on a GPU machine.

Addition information on alternate setups are available here:

- [Multi user setup](multi_user_setup.html)
- [Apache as front-end](apache_front_end.html)
- [Launcher configuration](python_launcher.html)
- [More launcher setup examples](launching_examples.html)

### Requirements

Installing ParaView Lite as a dependency inside your Web project is quite easy. However, you do need to have a couple of other things installed first:

- [Node.js](http://nodejs.org/)
- [Git](http://git-scm.com/)

If your computer already has these, congratulations! Just install ParaView Lite with npm:

``` bash
$ npm install paraview-lite --save
```

If not, please follow the following instructions to install all the requirements.

{% note warn For Mac users %}
You may encounter some problems when compiling. Please install Xcode from the App Store first. After Xcode is installed, open Xcode and go to **Preferences -> Download -> Command Line Tools -> Install** to install command line tools.
{% endnote %}

### Install Git

- Windows: Download & install [git](https://git-scm.com/download/win).
- Mac: Install it with [Homebrew](http://mxcl.github.com/homebrew/), [MacPorts](http://www.macports.org/) or [installer](http://sourceforge.net/projects/git-osx-installer/).
- Linux (Ubuntu, Debian): `sudo apt-get install git-core`
- Linux (Fedora, Red Hat, CentOS): `sudo yum install git-core`

### Install Node.js

The best way to install Node.js is with [nvm](https://github.com/creationix/nvm).

Once nvm is installed, restart the terminal and run the following command to install Node.js.

``` bash
$ nvm install --lts
$ npm use --lts
```

Alternatively, download and run [node](http://nodejs.org/).

### Install paraview-lite

This is useful if you want to embed ParaView Lite within your own application or just use some ParaView Lite components.

``` bash
$ npm install paraview-lite --save
```

### Getting paraview-lite source code for contributing

``` bash
$ git clone https://github.com/kitware/paraview-lite.git
$ cd paraview-lite
$ npm install
$ [...]
```
