"use strict";

module.exports = {
  async up(queryInterface) {
    // Kích hoạt extension unaccent và pg_trgm trong schema public
    await queryInterface.sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS unaccent SCHEMA public;
    `);
    await queryInterface.sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA public;
    `);

    // Tạo hàm immutable_unaccent trong schema public
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION public.immutable_unaccent(text) 
      RETURNS text AS $$
      SELECT public.unaccent($1)
      $$ LANGUAGE SQL IMMUTABLE;
    `);

    // Tạo các index GIN sử dụng public.immutable_unaccent
    await queryInterface.sequelize.query(`
      CREATE INDEX attraction_name_trgm_idx 
      ON public.attractions 
      USING GIN (public.immutable_unaccent(name) gin_trgm_ops);
    `);
    await queryInterface.sequelize.query(`
      CREATE INDEX restaurant_name_trgm_idx 
      ON public.restaurants 
      USING GIN (public.immutable_unaccent(name) gin_trgm_ops);
    `);
    await queryInterface.sequelize.query(`
      CREATE INDEX city_name_trgm_idx 
      ON public.cities 
      USING GIN (public.immutable_unaccent(name) gin_trgm_ops);
    `);
  },

  async down(queryInterface) {
    // Xóa các index
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS public.attraction_name_trgm_idx;
    `);
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS public.restaurant_name_trgm_idx;
    `);
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS public.city_name_trgm_idx;
    `);

    // Xóa hàm immutable_unaccent
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS public.immutable_unaccent(text);
    `);
  },
};
