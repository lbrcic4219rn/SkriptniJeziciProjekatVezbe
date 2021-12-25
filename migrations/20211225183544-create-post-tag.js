'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Post_Tags', {
      postID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        // references: {
        //   model: {
        //     tableName: 'Posts',
        //     schema: "schema"
        //   },
        //   key: id
        // }
      },
      tagName: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        // references: {
        //   model: {
        //     tableName: 'Tags',
        //     schema: "schema"
        //   },
        //   key: tagName
        // }
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
    await queryInterface.dropTable('Post_Tags');
  }
};