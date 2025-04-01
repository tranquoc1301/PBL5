const { Sequelize } = require('sequelize');
const { Op } = require("sequelize");
const sequelize = new Sequelize('postgres://postgres:123456@localhost:5432/PBL5', {
  dialect: 'postgres',
  logging: false,
});
const LocationModel = require('../models/location');
const Location = LocationModel(sequelize);

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchLocationByName = async (req, res) => {
  try {
    const { name } = req.query; // Lấy tên từ query parameter

    if (!name) {  
      return res.status(400).json({ error: "Tên địa điểm là bắt buộc" });
    }

    const locations = await Location.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`, // Tìm kiếm không phân biệt hoa thường (PostgreSQL)
        },
      },
    });

    if (locations.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy địa điểm nào" });
    }

    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const id = req.params.id;
    const location = await Location.findByPk(id);
    if (!location) {
      res.status(404).json({ error: 'Location not found' });
    }
    res.json(location);
    } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

exports.createLocation = async (req, res) => {
  try {
    const newLocation = await Location.create(req.body);
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Location.update(req.body, {
      where: { location_id: id },
    });
    if (updated) {
      const updatedLocations = await Location.findByPk(id);
      res.json(updatedLocations);
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Location.destroy({
      where: { location_id: id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};