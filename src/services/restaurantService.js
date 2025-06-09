const { Restaurant } = require("../models");
const { Op, literal } = require("sequelize");

const { Sequelize } = require("sequelize");
class RestaurantService {
  static async getAllRestaurants() {
    return await Restaurant.findAll();
  }

  static async getRestaurantById(id) {
    return await Restaurant.findByPk(id);
  }

  static async getSpecialRestaurantByCity(cityId) {
    return await Restaurant.findAll({
      where: {
        city_id: cityId,
      },
      order: [["rating_total", "DESC"]],
      limit: 4,
    });
  }
  static async createRestaurant(restaurantData) {
    return await Restaurant.create(restaurantData);
  }

  static async updateRestaurant(id, restaurantData) {
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    await restaurant.update(restaurantData);
    return restaurant;
  }

  static async getRestaurantRank(restaurantId) {
    const result = await Restaurant.sequelize.query(
      `
        WITH ranked_restaurants AS (
          SELECT
            restaurant_id,
            rating_total,
            RANK() OVER (PARTITION BY city_id ORDER BY rating_total DESC) AS ranking
          FROM restaurants
        )
        SELECT ranking
        FROM ranked_restaurants
        WHERE restaurant_id = :restaurantId
        LIMIT 1;
        `,
      {
        replacements: { restaurantId },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!result || result.length === 0) {
      return null;
    }

    return result[0].ranking;
  }

  static async getNearbyTopRestaurant(restaurantId) {
    const result = await Restaurant.sequelize.query(
      `
        WITH origin AS (
          SELECT latitude, longitude, city_id
          FROM restaurants
          WHERE restaurant_id = :restaurantId
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
          FROM restaurants a, origin o
          WHERE a.city_id = o.city_id AND a.restaurant_id != :restaurantId
        )
        SELECT *
        FROM nearby
        WHERE distance <= 1
        ORDER BY rating_total DESC
        LIMIT 4;
        `,
      {
        replacements: { restaurantId },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    return result;
  }

  // static async getRestaurantByTags(city, res_tags) {
  //   try {
  //     console.log("RESTAURANT_SERVICE", res_tags)
  //     const restaurants = await Restaurant.findAll({
  //       where: {
  //         city_id: city,
  //         // Sử dụng toán tử '&&' trong PostgreSQL để kiểm tra overlap giữa tags
  //         [Op.or]: res_tags.map((tag) => ({
  //           tags: {
  //             [Op.contains]: [tag], // JSONB chứa ít nhất 1 tag phù hợp
  //           },
  //         })),
  //       },
  //       order: [["rating_total", "DESC"]],
  //     });

  //     return restaurants;
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error('Error fetching restaurants by tags');
  //   }
  // }

  // static async getRestaurantByTags(city, res_tags) {
  //   try {
  //     const conditions = res_tags.map((tag) =>
  //       literal(`tags::text ILIKE '%${tag}%'`)
  //     );

  //     const restaurants = await Restaurant.findAll({
  //       where: {
  //         city_id: city,
  //         [Op.and]: [{ city_id: city }, { [Op.or]: conditions }],
  //       },
  //       order: [["rating_total", "DESC"]],
  //     });

  //     return restaurants;
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error("Error fetching restaurants by tags");
  //   }
  // }

  static async getRestaurantByTags(city, res_tags) {
    try {
      const restaurants = await Restaurant.findAll({
        where: {
          city_id: city,
          [Op.or]: res_tags.map((tag) => ({
            tags: {
              [Op.contains]: [tag], // giống Attraction
            },
          })),
        },
        order: [["rating_total", "DESC"]],
      });
  
      return restaurants;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching restaurants by tags");
    }
  }
  
  //   static async getRestaurantByTags(city, res_tags) {
  //     try {
  //       // Escape và format các tag
  //       const conditions = res_tags.map(tag =>
  //         `tags::jsonb::text ILIKE '%${tag}%'`
  //       ).join(" OR ");

  //       const query = `
  //         SELECT * FROM restaurants
  //         WHERE city_id = :city
  //         AND (${conditions})
  //         ORDER BY rating_total DESC;
  //       `;

  //       const restaurants = await sequelize.query(query, {
  //         replacements: { city },
  //         type: sequelize.QueryTypes.SELECT,
  //       });

  //       return restaurants;
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error('Error fetching restaurants by tags');
  //   }
  // }
  static async searchRestaurants(query) {
    try {
      if (!query || typeof query !== "string" || query.trim().length === 0) {
        return [];
      }

      const sanitizedQuery = query.trim();
      if (sanitizedQuery.length > 100) {
        throw new Error("Search query cannot exceed 100 characters");
      }

      const restaurants = await Restaurant.findAll({
        where: {
          [Op.or]: [
            // Case-insensitive partial match
            { name: { [Op.iLike]: `%${sanitizedQuery}%` } },
            // Unaccented match for Unicode (e.g., "Hà" matches "Ha")
            Sequelize.where(Sequelize.fn("unaccent", Sequelize.col("name")), {
              [Op.iLike]: `%${sanitizedQuery}%`,
            }),
          ],
        },
        // Add trigram similarity for fuzzy matching
        attributes: {
          include: [
            [
              Sequelize.literal(`SIMILARITY(name, '${sanitizedQuery}')`),
              "similarity",
            ],
          ],
        },
        // Order by similarity and name
        order: [
          [Sequelize.literal("similarity"), "DESC"],
          [Sequelize.col("name"), "ASC"],
        ],
        limit: 100,
      });

      return restaurants || [];
    } catch (error) {
      console.error("Error searching restaurants:", error);
      throw new Error("Error searching restaurants: " + error.message);
    }
  }
  static async deleteRestaurant(id) {
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    await restaurant.destroy();
    return true;
  }
}

module.exports = RestaurantService;
