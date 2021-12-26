'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Post_Tag}) {
      // define association here
      this.hasMany(Post_Tag, {
        foreignKey: 'tagName',
      })
    }
  };
  Tag.init({
    tagName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    }
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};