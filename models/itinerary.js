module.exports = (sequelize, DataTypes) => {
  const Itinerary = sequelize.define(
    "Itinerary",
    {
      itinerary_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "user_id",
        },
        onDelete: "CASCADE",
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: "private",
        validate: {
          isIn: [["public", "private"]],
        },
      },
      optimized: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        field: "created_at",
      },
    },
    {
      tableName: "Itineraries",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );
  return Itinerary;
};
