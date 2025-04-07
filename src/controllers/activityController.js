const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:123456@localhost:5432/PBL5', {
  dialect: 'postgres',
  logging: false,
});
const ActivityModel = require('../models/Activity');
const Activity = ActivityModel(sequelize);

exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActivityById = async (req, res) => {
    try {
      const { id } = req.params;
      const activity = await Activity.findByPk(id);
      if (activity) {
        res.json(activity);
      } else {
        res.status(404).json({ message: 'Activity not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.createActivity = async (req, res) => {
  try {
    const newActivity = await Activity.create(req.body);
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Activity.update(req.body, {
      where: { activity_id: id },
    });
    if (updated) {
      const updatedActivity = await Activity.findByPk(id);
      res.json(updatedActivity);
    } else {
      res.status(404).json({ message: 'Activity not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Activity.destroy({
      where: { activity_id: id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};