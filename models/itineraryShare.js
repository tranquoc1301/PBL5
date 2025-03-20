const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ItineraryShare = sequelize.define('ItineraryShare', {
    share_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    itinerary_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'view',
      validate: {
        isIn: [['view', 'edit']],
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'itinerary_shares',
    timestamps: false,
  });

  return ItineraryShare;
};