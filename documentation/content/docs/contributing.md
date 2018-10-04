title: Contributing
---

We welcome your contributions to the development of ParaView Lite. This document will help you with the process.

## Before You Start

Please follow the coding style:

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
- Use soft-tabs with a two space indent.
- Don't put commas first.

## Workflow

1. Fork [kitware/paraview-lite](https://github.com/kitware/paraview-lite).
2. Clone the repository to your computer and install dependencies.

    {% code %}
    $ git clone https://github.com/<username>/paraview-lite.git
    $ cd paraview-lite
    $ npm install
    {% endcode %}

3. Create a feature branch.

    {% code %}
    $ git checkout -b new_feature
    {% endcode %}

4. Start hacking.
5. Use Commitizen for commit message

    {% code %}
    $ npm run commit
    {% endcode %}

6. Push the branch:

    {% code %}
    $ git push origin new_feature
    {% endcode %}

6. Create a pull request and describe the change.

## Notice

- Don't modify the version number in `package.json`. It is modified automatically.
- Your pull request will only get merged when tests have passed. Don't forget to run tests before submission.

    {% code %}
    $ npm test
    {% endcode %}

## Updating Documentation

The ParaView Lite documentation is part of the code repository.

## Reporting Issues

When you encounter a problems with ParaView Lite, please check on [GitHub](https://github.com/kitware/paraview-lite/issues) or [ParaView Discourse](https://discourse.paraview.org/c/web-support) first then ask your question in either communication channel.
