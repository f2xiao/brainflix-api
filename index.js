const express = require("express");
const app = express();
const videosRoutes = require("./routes/videos");

const requestLogger = (request, response, next) => {
  console.log(`Method: `, request.method);
  console.log(`Path: `, request.path);
  console.log(`Body: `, request.body);
  console.log(`------------------------------`);
  next();
};

app.use(express.json());
app.use(express.static("./public"));
app.use(requestLogger);
app.use("/videos", videosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is runnning on port ${PORT}`);
});
