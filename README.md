
# Virtual python

## Start virtual server by using

```cmd
<virtual-folder-location>\Scripts\activate
```

## Stop virtual server by using

```cmd
<virtual-folder-location>\Scripts\deactivate
```


# Flask server

## Setup Enviroment variable

To start the flask server we first need to set an enviroment variable called FLASK_APP. Do do this navigate to the server's folder and type the following in the terminal:

>POSIX
```cmd
export FLASK_APP="server.app"
```

>Windows
```cmd
setx FLASK_APP "server.app"
```
>NOTE on windows you need to restart the terminal for the enviroment variable to be updated. Also it does NOT work in VS-Code's terminal.

## Start flask server

To start the flask server simply run
```cmd
flask run
```

Additionally you can use the `--debug` flag to have the server restart every time the script is saved. This is recommended as it makes it faster in development.

```cmd
flask --debug run
```