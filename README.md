
# INTRODUCTION
---

This project development structure offers potential capabilites for **social media** applications.
It uses this tech stack
1 Python/Django/djangorestframework
2. REST API
3. Postgres
4. React
Other technologies used are *redis* and *celery* to handle background tasks
and [docker](https://docker.com) for packaging and shipping the application

## TABLE OF CONTENT
- [Requirements](#requirements)
- [File Structure](#file-structure)
- [Building the project with docker](#building-the-project-with-docker)
- [Starting the project](#starting-the-project)
- [Stopping the project](#stopping-the-project)



## Requirements
The project requires a host of tools.
Ensure that before you begin you've cloned the project by running
```
    git clone https://github.com/prime2014/exo.git
```
The above command will clone the project in your local machine
It also requires a docker installation on your machine
installation for windows [windows installation](https://docs.docker.com/desktop/windows/install/)
installation for ubuntu [ubuntu installation](https://docs.docker.com/desktop/ubuntu/install/)
You must have ***python*** installed in your system and ***node*** as well

## File Structure
```
├───.github
├───djapps
│   ├───accounts
│   │   └───migrations
│   ├───feeds
│   │   └───migrations
│   └───templates
│       └───accounts
├───config
│   └───settings
├───media
│   └───avatar
├───static
│   └───images
└───utils
    └───django
```

## Building the project with docker
To build the project, navigate to the project directory and run the following command:
- For windows
```
    docker-compose -f local.yml up --build
```
- For ubuntu
```
    sudo docker-compose -f local.yml up --build
```
The command should build the project installing all the dependencies it needs.

## Starting the project
After the project has been built, it should automatically start on its own.
However on subsequent use of the project, run the following command
```
    docker-compose -f local.yml up
```

## Running the test for django
```
    docker-compose -f local.yml run --rm django pytest
```


## Stopping the project
To stop the project just press `CTRL + C` on the terminal once.

