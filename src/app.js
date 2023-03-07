require("dotenv").config();
const express = require("express");
const connectDatabase = require("./utils/db.connection");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger.json");
const indexRouter = require("./routes/index-route");
const { ValidationError } = require("express-validation");
const passport = require('passport');

const app = express();
const port = parseInt(process.env.PORT || 8000);

// app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-swagger", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(indexRouter);

app.use('/test', (req, res) => {
  res.send('-------------------')
});

app.use((err, req, res, next) => {
  const { statusCode } = err;
  if (err instanceof ValidationError) return res.status(statusCode).json(err);
});

app.use((err, req, res, next) => {
  console.log("Inside error middleware")
  const { status = 500, message = "something went wrong" } = err;
  res.status(status).json({ message });
});

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is up and running on port ${port}`);
    });
  })
  .catch(() => {
    console.log("Server is not running.");
  });
