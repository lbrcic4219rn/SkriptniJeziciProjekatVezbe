'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Comment, User, Post_Tag}) {
      this.hasMany(Comment, {
        foreignKey: "postID",
        onDelete: 'cascade',
        hooks: true,
      })
      this.hasMany(Post_Tag, {
        foreignKey: "postID",
        onDelete: 'cascade',
        hooks: true,
      })
      this.belongsTo(User, {
        foreignKey: "userID"
      })

      // define association here
    }
  };
  Post.init({
    data: DataTypes.STRING,
    likeCount: DataTypes.NUMBER,
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};