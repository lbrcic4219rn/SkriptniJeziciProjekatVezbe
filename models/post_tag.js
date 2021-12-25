'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post_Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Post, Tag}) {
      // define association here
      this.belongsTo(Post, {
        foreignKey: "postID",
      })
      this.belongsTo(Tag, {
        foreignKey: "tagName", 
      })
    }
  };
  Post_Tag.init({
  }, {
    sequelize,
    modelName: 'Post_Tag',
  });
  return Post_Tag;
};