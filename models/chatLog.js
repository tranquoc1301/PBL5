const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const ChatLog = sequelize.define('ChatLog', {
      chat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      response: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      intent: {
        type: DataTypes.STRING(50)
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'chat_logs',
      timestamps: false
    });
    
    return ChatLog;
  };