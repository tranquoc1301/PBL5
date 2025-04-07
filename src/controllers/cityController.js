const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:123456@localhost:5432/PBL5', {
  dialect: 'postgres',
  logging: false,
});

const CityModel = require('../models/cities');
const City = CityModel(sequelize);


exports.getAllCities = async (req, res) => {
    try {
      const cities = await City.findAll();
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getCityById = async (req, res) => {
    try {
      const { id } = req.params;
      const city = await City.findByPk(id);
      if (city) {
        res.json(city);
      } else {
        res.status(404).json({ message: "City not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.createCity = async (req, res) => {
    try {
      const newCity = await City.create(req.body);
      res.status(201).json(newCity);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.updateCity = async (req, res) => {
    try {
      const { id } = req.params;
      const city = await City.findByPk(id);
      if (city) {
        await city.update(req.body);
        res.json(city);
      } else {
        res.status(404).json({ message: "City not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.deleteCity = async (req, res) => {
    try {
      const { id } = req.params;
      const city = await City.findByPk(id);
      if (city) {
        await city.destroy();
        res.json({ message: "City deleted successfully" });
      } else {
        res.status(404).json({ message: "City not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };