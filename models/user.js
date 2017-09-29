var bcrypt = require('bcrypt');

'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Name must be between 1 and 99 characters'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 99],
          msg: 'Password must be between 8 and 99 characters'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: function(createdUser, options, cb) {
        // hash the password
        var hash = bcrypt.hashSync(createdUser.password, 10);
        // store the hash as the user's password
        createdUser.password = hash;
        // continue to save the user, with no errors
        cb(null, createdUser);
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
     },
    instanceMethods: {
      validPassword: function(password) {
        // return if the password matches the hash
        return bcrypt.compareSync(password, this.password);
      },
      toJSON: function() {
        // get the user's JSON data
        var jsonUser = this.get();
        // delete the password from the JSON data, and return
        delete jsonUser.password;
        return jsonUser;
      }
    }
  });
  return user;
};
