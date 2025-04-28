const MongoClient = require('mongodb').MongoClient;

var getID = require('mongodb').ObjectID();

const url = 'mongodb://localhost:27017';

const client = new MongoClient(url);

let mongoClient = MongoClient(url,{ useUnifiedTopology: true });

let myDB;

async function connect(argdb) {
    try {
        await mongoClient.connect();

        myDB = mongoClient.db(argdb);

        if (!myDB) {
            throw new Error("DB Connection Failed to start!");
        }
        else {
            console.log(`Connected to ${argdb}`);
            return myDB;
        }
    } catch (e) {
        console.log(e.message);
    }
}

module.exports = connectToDatabase;

/*Ethan Long*/