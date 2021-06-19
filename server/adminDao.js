'use strict';
/* Data Access Object (DAO) module for accessing users */

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

// open the database
const db = new sqlite.Database('./newSurveys.db', (err) => {
    if (err) throw err;
  });


exports.getAdminById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Admin WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined)
          resolve({error: 'Admin not found.'});
        else {
          // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
          const admin = {id: row.Id, username: row.Email}
          resolve(admin);
        }
    });
  });
};

exports.getAdmin = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Admin WHERE Email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined) {
          resolve(false);
        }
        else {
          const admin = {id: row.Id, username: row.Email};
            
          // check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
          bcrypt.compare(password, row.hash).then(result => {
            if(result){
              resolve(admin);
            }
            else
              resolve(false);
          });
        }
    });
  });
};