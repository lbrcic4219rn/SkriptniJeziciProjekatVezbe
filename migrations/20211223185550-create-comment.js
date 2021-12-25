'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userID: {
        type: Sequelize.STRING,
        allowNull: false,
        // references: {
        //   model: {
        //     tableName: 'Users',
        //     schema: 'schema'
        //   },
        //   key: 'username'
        // }
      },
      postID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: {
        //     tableName: 'Posts',
        //     schema: "schema"
        //   },
        //   key: id
        // }
      },
      data: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Comments');
  }
};