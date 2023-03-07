const { connect, connection, set } = require("mongoose");

const connectDatabase = () => {
  set("strictQuery", true);
  return connect("mongodb://localhost:27017/final-demo-database");
};

connection.on("connected", () => {
  console.log("Database connected");
});

module.exports = connectDatabase;
