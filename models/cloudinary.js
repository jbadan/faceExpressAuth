'use strict';
module.exports = (sequelize, DataTypes) => {
  var cloudinary = sequelize.define('cloudinary', {
    src: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.cloudinary.belongsTo(models.user);
      }
    }
  });
  return cloudinary;
};
