const express = require("express");
const app = express();
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
    if (api_key === "32466d85-c74a-4004-8864-0d31ddf91185") {
      next();
    }
  } else {
    response.status(401).json({
      message: "require api key",
    });
  }
};

app.use(cors());
app.use(express.json());
app.use(express.static("./public"));
app.use(requestLogger);
app.use(requireApiKey);
app.use("/videos", videosRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is runnning on port ${PORT}`);
});
