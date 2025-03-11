const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Analytics = sequelize.define(
    "Analytics",
    {
      event_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      event_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      event_data: {
        type: DataTypes.JSONB,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "analytics",
      timestamps: false,
    }
  );

  return Analytics;
};
