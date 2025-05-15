const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RecentlyViewed = sequelize.define(
    "RecentlyViewed",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onDelete: "CASCADE",
      },
      item: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
          notEmpty: true,
          isValidItem(value) {
            if (
              !value.id ||
              !value.name ||
              !value.type ||
              !["attraction", "restaurant"].includes(value.type)
            ) {
              throw new Error(
                "Invalid item: id, name, type (attraction/restaurant) required"
              );
            }
            if (
              value.rating &&
              (typeof value.rating !== "number" ||
                value.rating < 0 ||
                value.rating > 5)
            ) {
              throw new Error("Invalid rating: must be number between 0 and 5");
            }
            if (
              value.reviewCount &&
              (typeof value.reviewCount !== "number" || value.reviewCount < 0)
            ) {
              throw new Error(
                "Invalid reviewCount: must be non-negative number"
              );
            }
            if (value.tags && !Array.isArray(value.tags)) {
              throw new Error("Invalid tags: must be array");
            }
          },
        },
      },
      viewed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      tableName: "recently_viewed",
      timestamps: false,
      indexes: [
        { fields: ["user_id", "viewed_at"] },
        {
          fields: [
            { attribute: "item", path: "id" },
            { attribute: "item", path: "type" },
          ],
        },
      ],
    }
  );

  RecentlyViewed.associate = (models) => {
    RecentlyViewed.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return RecentlyViewed;
};
