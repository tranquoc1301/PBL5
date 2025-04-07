const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:123456@localhost:5432/PBL5', {
  dialect: 'postgres',
  logging: false,
});
const RestaurantModel = require('../models/restaurant');
const Restaurant = RestaurantModel(sequelize);

exports.getAllRestaurants = async (req, res) => {
  try {
    const restautants = await Restaurant.findAll();
    res.json(restautants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSpecialRestaurantByCity = async (req, res) => {
  try {
    const { city_id } = req.params;

    const specialRestaurant = await Restaurant.findAll({
      where: {
        special: true,
        city_id: city_id,
      },
    });

    res.json(specialRestaurant);
  } catch (error) {
    console.error('Error fetching special attractions by city:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const newRestaurant = await Restaurant.create(req.body);
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Restaurant.update(req.body, {
      where: { restuarant_id: id },
    });
    if (updated) {
      const updatedRestaurant = await Restaurant.findByPk(id);
      res.json(updatedRestaurant);
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Restaurant.destroy({
      where: { restaurant_id: id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
