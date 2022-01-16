'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Comment, Story, Post}) {
      // define association here
      this.hasMany(Comment, {
        foreignKey: "userID",
        onDelete: "cascade",
        hooks: true,
      })
      this.hasMany(Story, {
        foreignKey: "userID",
        onDelete: "cascade",
        hooks: true,
      })
      this.hasMany(Post, {
        foreignKey: "userID",
        onDelete: "cascade",
        hooks: true,
      })
    }
  };

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    bio: {
      type: DataTypes.STRING,
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
    // validate: { isEmail: { msg: "nije Email" } } UBACIVANJE VALIDATORA I MSG JE ERROR MSG
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};