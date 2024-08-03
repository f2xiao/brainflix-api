require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const videosRoutes = require("./routes/videos");

const requestLogger = (request, response, next) => {
  console.log(`Method: `, request.method);
  console.log(`Path: `, request.path);
  console.log(`Body: `, request.body);
  console.log(`------------------------------`);
  next();
};

const requireApiKey = (request, response, next) => {
  const api_key = request.query.api_key;
  if (api_key) {
    if (api_key === process.env.API_KEY) {
      next();
    }
  } else {
    response.status(401).json({
      message: "require api key",
    });
  }
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(requestLogger);
app.use(requireApiKey);
app.use("/videos", videosRoutes);

app.use(unknownEndpoint);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is runnning on port ${PORT}`);
});
