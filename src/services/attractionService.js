const { Attraction } = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

class AttractionService {
  static async getAllAttractions() {
    return await Attraction.findAll();
  }

  static async getAttractionById(attractionId) {
    return await Attraction.findByPk(attractionId);
  }

  static async createAttraction(data) { 
    return await Attraction.create(data);
  }

  static async updateAttraction(attractionId, data) {
    const attraction = await Attraction.findByPk(attractionId);
    if (!attraction) throw new Error("Địa điểm không tồn tại");
    return await attraction.update(data);
  }

  static async deleteAttraction(attractionId) {
    const attraction = await Attraction.findByPk(attractionId);
    if (!attraction) throw new Error("Địa điểm không tồn tại");
    return await attraction.destroy();
  }

  static async getSpecialAttractionsByCity(cityId) {
    const attractions = await Attraction.findAll({
      where: {
        city_id: cityId,
      },
      order: [["rating_total", "DESC"]],
      limit: 4,
    });

    if (!attractions || attractions.length === 0) {
      throw new Error("Không tìm thấy địa điểm nổi bật nào cho thành phố này");
    }

    return attractions;
  }

  static async getAttractionRank(attractionId) {
    const result = await Attraction.sequelize.query(
      `
      WITH ranked_attractions AS (
        SELECT
          attraction_id,
          rating_total,
          RANK() OVER (PARTITION BY city_id ORDER BY rating_total DESC) AS ranking
        FROM attractions
      )
      SELECT ranking
      FROM ranked_attractions
      WHERE attraction_id = :attractionId
      LIMIT 1;
      `,
      {
        replacements: { attractionId },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!result || result.length === 0) {
      return null;
    }

    return result[0].ranking;
  }

  static async getNearbyTopAttractions(attractionId) {
    const result = await Attraction.sequelize.query(
      `
      WITH origin AS (
        SELECT latitude, longitude, city_id
        FROM attractions
        WHERE attraction_id = :attractionId
      ),
      nearby AS (
        SELECT a.*,
          (
            6371 * acos(
              cos(radians(o.latitude)) *
              cos(radians(a.latitude)) *
              cos(radians(a.longitude) - radians(o.longitude)) +
              sin(radians(o.latitude)) *
              sin(radians(a.latitude))
            )
          ) AS distance
        FROM attractions a, origin o
        WHERE a.city_id = o.city_id AND a.attraction_id != :attractionId
      )
      SELECT *
      FROM nearby
      WHERE distance <= 4
      ORDER BY rating_total DESC
      LIMIT 4;
      `,
      {
        replacements: { attractionId },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    return result;
  }

  static async getAttractionsByTags(city, tags) {
    try {
      
      const attractions = await Attraction.findAll({
        where: {
          city_id: city,
          // Sử dụng toán tử '&&' trong PostgreSQL để kiểm tra overlap giữa tags
          [Op.or]: tags.map((tag) => ({
            tags: {
              [Op.contains]: [tag], // JSONB contains 1 phần tử
            },
          })),
        },
        order: [["rating_total", "DESC"]],
      });
      
      return attractions;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching attractions by tags');
    }
  }

  static async searchAttractions(query) {
    return await Attraction.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`,
        },
      },
    });
  }
}

module.exports = AttractionService;
