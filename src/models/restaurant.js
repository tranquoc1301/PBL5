const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Restaurant = sequelize.define(
    "Restaurant",
    {
      restaurant_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      hours: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      average_rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.0,
        allowNull: true,
        validate: {
          min: 0,
          max: 5,
        },
      },
      image_url: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      tags: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      reservation_required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("open", "closed", "temporarily_closed"),
        defaultValue: "open",
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true,
      },
      rating_total: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
        validate: {
          min: 0,
        },
      },
    },
    {
      tableName: "restaurants",
      timestamps: false,
      indexes: [
        { fields: ["city_id"] },
        { fields: ["hours"], using: "gin" },
        { fields: ["image_url"], using: "gin" },
        { fields: ["latitude", "longitude"] },
        { fields: ["tags"], using: "gin" },
      ],
      validate: {
        uniqueNameAddressCity() {
          return sequelize
            .query(
              `SELECT restaurant_id FROM restaurants WHERE name = :name AND address = :address AND city_id = :city_id AND restaurant_id != :restaurant_id`,
              {
                replacements: {
                  name: this.name,
                  address: this.address || "",
                  city_id: this.city_id,
                  restaurant_id: this.restaurant_id || 0,
                },
                type: sequelize.QueryTypes.SELECT,
              }
            )
            .then((results) => {
              if (results.length > 0) {
                throw new Error(
                  "Restaurant with this name, address, and city_id already exists"
                );
              }
            });
        },
      },
    }
  );
  Restaurant.associate = function (models) {
    Restaurant.belongsTo(models.City, {
      foreignKey: "city_id",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });
    Restaurant.hasMany(models.Review, { foreignKey: "restaurant_id" });
    Restaurant.belongsToMany(models.Favorite, {
      through: "favorites",
      foreignKey: "restaurant_id",
    });
  };

  return Restaurant;
};
