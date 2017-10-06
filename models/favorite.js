'use strict';
module.exports = (sequelize, DataTypes) => {
  var favorite = sequelize.define('favorite', {
    isFavorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cloudinaryId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.favorite.belongsTo(models.cloudinary);
      }
    }
  });
  return favorite;
};
