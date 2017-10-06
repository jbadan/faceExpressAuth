'use strict';
module.exports = (sequelize, DataTypes) => {
  var image = sequelize.define('image', {
    src: DataTypes.STRING,
    isFavorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.image.belongsTo(models.user);
      }
    }
  });
  return image;
};
