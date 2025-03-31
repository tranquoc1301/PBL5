const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ChatLog = sequelize.define(
    'ChatLog',
    {
      chat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      response: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      intent: DataTypes.STRING(50),
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'chat_logs',
      timestamps: false
    }
  );

  ChatLog.associate = function (models) {
    ChatLog.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return ChatLog;
};