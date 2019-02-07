# glass-hello
Minimal glass application

## Dependencies
Set these up first in order

<https://github.com/krisnye/glass-build>
<https://github.com/krisnye/glass-platform>

## Setup

    git clone https://github.com/krisnye/glass-hello.git hello
    cd hello
    guild setup

## Development

    guild watch

## Quick Setup of all dependencies and test
From a directory that will contain all glass projects:

    git clone https://github.com/krisnye/glass-build.git build
    cd build
    yarn run setup
    (sudo yarn setup) for Linux users
    cd ..
    git clone https://github.com/krisnye/glass-platform.git platform
    cd platform
    guild setup
    cd ..
    git clone https://github.com/krisnye/glass-hello.git hello
    cd hello
    guild setup
    
    guild watch

- Browse to http://localhost:8080/
- Open hello/src/index.ts and edit the text.
- Verify hot-reloading in the browser.

## Creating a new app engine project

Browse to https://console.cloud.google.com/projectcreate

Create a new project and try to match the project name to the project id
Make sure to set your new project id in your package.json as "name" or "id"

Set your AppEngine daily spend limits to 0 dollars.

https://console.cloud.google.com/appengine/settings?project=glass-todomvc

Disable the compute engine

https://console.cloud.google.com/apis/dashboard?project=glass-todomvc&duration=PT1H
