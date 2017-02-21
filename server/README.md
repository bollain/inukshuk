
### Running the server
To run the server, run:

```
npm start
```

To view the Swagger UI interface:

```
open http://localhost:8080/docs
```

This project leverages the mega-awesome [swagger-tools](https://github.com/apigee-127/swagger-tools) middleware which does most all the work.


The server requires a MongoDB. Install MongoDB on your machine before running the server.
## Instructions for installing Mongo on Windows
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

## Instructions for installing Mongo on OSX

The easiest way to install Mongo is using HomeBrew

In the shell:

```
    brew update
```
``` brew install mongodb
```
Before you start MongoDB for the first time, create the directory to which the mongod process will write data. By default, the mongod process uses the /data/db directory. If you create a directory other than this one, you must specify that directory in the dbpath option when starting the mongod process later in this procedure.

The following example command creates the default /data/db directory:

```
    mkdir -p /data/db
```
Before running mongod for the first time, ensure that the user account running mongod has read and write permissions for the directory.

```
sudo chown -R mongod:mongod /data/db
```


Run MongoDB.

To run MongoDB, run the mongod process at the system prompt. If necessary, specify the path of the mongod or the data directory. See the following examples.

Run without specifying paths

If your system PATH variable includes the location of the mongod binary and if you use the default data directory (i.e., /data/db), simply enter mongod at the system prompt:
```
mongod
```

Specify the path of the mongod

If your PATH does not include the location of the mongod binary, enter the full path to the mongod binary at the system prompt:
```
<path to binary>/mongod
```
Specify the path of the data directory

If you do not use the default data directory (i.e., /data/db), specify the path to the data directory using the --dbpath option:

```
mongod --dbpath <path to data directory>
```
Use the mongo shell by running:
```
mongo
```
To make any queries to the DB.
You will need to change DB to the inukshukdatabase using:
```
use inukshukdatabase
```
Make queries on the collections. For example:
```
db.users.find()
```
