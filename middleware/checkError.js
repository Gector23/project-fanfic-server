module.exports = (err, req, res, next) => {
  console.log(err);
  switch (err.message) {
    case "Already admin.":
      res.status(400).json({
        message: err.message
      });
      break;

    case "Not admin.":
      res.status(400).json({
        message: err.message
      });
      break;

    case "Already blocked.":
      res.status(400).json({
        message: err.message
      });
      break;

    case "Not blocked.":
      res.status(400).json({
        message: err.message
      });
      break;

    case "Email already exists.":
      res.status(400).json({
        message: err.message
      });
      break;

    case "Incorrect email.":
      res.status(400).json({
        message: err.message
      });
      break;

    case "Incorrect password.":
      res.status(400).json({
        message: err.message
      });
      break;

    case "Incorrect activation link.":
      res.status(400).json({
        message: err.message
      });
      break;

    case "The chapter file is not a image.":
      res.status(400).json({
        message: err.message
      });
      break;

    case "Auth failed.":
      res.status(401).json({
        message: err.message
      });
      break;

    case "No access rights.":
      res.status(403).json({
        message: err.message
      });
      break;

    case "You are blocked.":
      res.status(403).json({
        message: err.message
      });
      break;

    case "Fanfic not found.":
      res.status(404).json({
        message: err.message
      });
      break;

    case "Already added to favorites.":
      res.status(400).json({
        message: err.message
      });
      break;

    case "Not added to favorites.":
      res.status(400).json({
        message: err.message
      });
      break;

    case "Chapter not found.":
      res.status(404).json({
        message: err.message
      });
      break;

    case "Already liked.":
      res.status(400).json({
        message: err.message
      });
      break;

    case "Not liked.":
      res.status(400).json({
        message: err.message
      });
      break;

    case "User not found.":
      res.status(404).json({
        message: err.message
      });
      break;

    default:
      res.status(500).json({
        message: "Internal Server Error."
      });
  }
};