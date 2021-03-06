var mongoose = require('mongoose');
var gracefulShutdown;
// URL to connect to Cosmos Database, NoSql
// var dbURI = 'mongodb://localhost/empact';
var dbURI = 'mongodb://empact-db:Llp2dVhvJSEspIWLOgqAUNDoE0WadlPM3tYf6AxA9oA9NHVzW26Ui8MxMzTdd1jbXgARcCp5HaLrrQ6DrpeMJA==@empact-db.documents.azure.com:10255/?ssl=true&replicaSet=globaldb';
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}
// connection function
mongoose.connect(dbURI);

// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
// For nodemon restarts
/*process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});*/
// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});
/*
// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app termination', function() {
    process.exit(0);
  });
});
*/
// Bringing In Schemas & Models
require('./users');
require('./emotions');
require('./rooms');