const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const fs = require("fs");
const VIDEOS_PATH = "./data/videos.json";

const readVideos = () => {
  return JSON.parse(fs.readFileSync(VIDEOS_PATH));
};

// GET /videos
router.get("/", (req, res) => {
  const videosData = readVideos();
  const responseData = videosData.map((video) => {
    const { id, title, channel, image } = video;
    return { id, title, channel, image };
  });
  res.json(responseData);
});

// GET /videos/:id
router.get("/:id", (req, res) => {
  console.log(`params-id: `, req.params.id);
  console.log(`params: `, req.params);
  const returnedVideo = readVideos().find(
    (video) => video.id === req.params.id
  );
  if (!returnedVideo) {
    return res.status(404).json({
      message: "No video with that id exists",
    });
  }

  res.json(returnedVideo);
});

// POST /videos/:id/comments
router.post("/:id/comments", (req, res) => {
  console.log(`params-id: `, req.params.id);
  console.log(`body`, req.body);

  // generate a new comment obj and push to the comments array
  const currentTime = new Date();
  const timestamp = currentTime.getTime();
  const videoId = uuidv4();
  // console.log(videoId);
  const newComment = { ...req.body, id: videoId, timestamp };
  // console.log(newComment);

  const videosData = readVideos();
  videosData
    .find((video) => video.id === req.params.id)
    .comments.push(newComment);

  // write to the videosData file
  fs.writeFileSync("./data/videos.json", JSON.stringify(videosData));

  res.json(newComment);
});

// DELETE /videos/:videoId/comments/:commentId
router.delete("/:videoId/comments/:commentId", (req, res) => {
  const videosData = readVideos();

  // const returnedVideo = videosData.find(
  //   (video) => video.id === req.params.videoId
  // );

  // if (!returnedVideo) {
  //   return res.status(404).json({
  //     message: "No video with that id exists",
  //   });
  // }

  const deletedComment = videosData
    .find((video) => video.id === req.params.videoId)
    .comments.filter((comment) => comment.id === req.params.commentId);

  videosData.find((video) => video.id === req.params.videoId).comments =
    videosData
      .find((video) => video.id === req.params.videoId)
      .comments.filter((comment) => comment.id !== req.params.commentId);

  fs.writeFileSync("./data/videos.json", JSON.stringify(videosData));

  res.json(deletedComment);
});

module.exports = router;
