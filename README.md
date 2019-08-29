![ParaView Lite](documentation/content/paraview_lite.png)

Introduction
============
[ParaView Lite][] is an open-source, javascript visualization application created by [Kitware][], based on [ParaView][], and intended to serve a more refined and dedicated UI for controlling data processing and visualization remotely via a Web page. It is part of the [ParaView Web][] suite of tools.

[ParaView Lite]: https://kitware.github.io/paraview-lite/
[ParaView Web]: http://www.paraview.org/web
[ParaView]: http://www.paraview.org
[VTK]: http://www.vtk.org
[Kitware]: http://www.kitware.com

Learning Resources
==================

* General information is available at the [ParaView][] and [ParaView Web][] homepages.

* Community discussion takes place on the [ParaView Discourse][].

* Commercial [support][Kitware Support] and [training][Kitware Training] are available from [Kitware][].

* Additional documentation is being created and will be released as it is created on our [documentation pages][ParaView Lite GitHub.io].

[ParaView Discourse]: https://discourse.paraview.org/
[Kitware Support]: http://www.kitware.com/products/support.html
[Kitware Training]: http://www.kitware.com/products/protraining.php
[ParaView Lite GitHub.io]: https://kitware.github.io/paraview-lite/


Live Demonstrations
===================

As a server based web application, ParaView Lite can be run by starting the server process using the ParaView binaries and connecting to it with any browser at the appropriate URL.

Building for development
========================

The prerequisites are [git][] and [node 8.12+][]. To manage node, we recommend using [nvm][].

If you wish to view, enhance, or adapt this application in any way, you can access and run the freely available source code from any platform using the following commands:


```
$ git clone https://github.com/Kitware/paraview-lite.git
$ cd paraview-lite/
$ npm install
$ npm run serve
```

This will build a development version inside the `./dist` directory. You will have to point the ParaView process to use that directory as web content. (i.e.: `$ pvpython ./server/pvw-lite.py --content ./dist --data ~ --port 1234`)

`open http://localhost:8080/?sessionURL=ws://localhost:1234/ws` assuming the serve command started using port 8080.

To generate a production build, use the following commands:

```
$ npm run build
```

This will output the final bundle and assets to `dist/`.

[git]: https://git-scm.com
[node 8.12+]: https://nodejs.org/en
[nvm]: https://github.com/creationix/nvm


Reporting Bugs and Making Contributions
=======================================

If you have found a bug or have a suggestion for improving ParaView Lite:

1. If you have source code to contribute, please fork the github repository into your own github account, create a branch with your changes, and then create a merge request with the main repo.

2. If you have a bug to report or a feature to request, please open an entry in the [ParaView Lite Issue Tracker][].

[ParaView Lite Issue Tracker]: https://github.com/kitware/paraview-lite/issues


License
=======

ParaView Lite is distributed under the OSI-approved BSD 3-clause License.  See [COPYRIGHT][] and [LICENSE][] for details. For additional licenses, refer to [ParaView Licenses][].

[COPYRIGHT]: COPYRIGHT
[LICENSE]: LICENSE
[ParaView Licenses]: http://www.paraview.org/paraview-license/
