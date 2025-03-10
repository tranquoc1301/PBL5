module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
      review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      location_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Locations',
          key: 'location_id'
        },
        onDelete: 'CASCADE'
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      comment: DataTypes.TEXT,
      created_at: {
        type: DataTypes.DATE,
        field: 'created_at'
      }
    }, {
      tableName: 'Reviews',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
    return Review;
  };