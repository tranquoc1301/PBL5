const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Analytics = sequelize.define(
    'Analytics',
    {
      event_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      event_type: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      event_data: DataTypes.JSONB,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'analytics',
      timestamps: false
    }
  );

  Analytics.associate = function (models) {
    Analytics.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'SET NULL',
      allowNull: true
    });
  };

  return Analytics;
};