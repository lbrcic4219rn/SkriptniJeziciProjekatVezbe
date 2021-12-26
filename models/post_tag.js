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
    postID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    }, 
    tagName: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'Post_Tag',
  });
  return Post_Tag;
};