const app = require("./app");
const sequelize = require("./src/models").sequelize;
require("dotenv").config();

const PORT = process.env.PORT || 8081;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
