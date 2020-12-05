//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Succesfully added a new article");
      } else {
        res.send(err);
      }
    });

  })

  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      if (!err) {
        res.send("succesfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

///////////////////////////////////////////////SPECIFIC //////////////////////////

app.route("/articles/:specificArticle")

  .get(function (req, res) {
    const titleName = req.params.specificArticle;
    Article.findOne({ title: titleName }, function (err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("no articles were found");
      }
    });
  })

  .put(function (req, res) {
    const titleName = req.params.specificArticle;
    Article.update({ title: titleName }, { title: req.body.title, content: req.body.content }, { overwrite: true },
      function (err) {
        if (!err) {
          res.send("succesfully updated");
        }
      });
  })

  .patch(function (req, res) {
    const titleName = req.params.specificArticle;
    Article.update({ title: titleName }, { $set: req.body }, function (err) {
      if (!err) {
        res.send("Succesfully updated");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.specificArticle }, function (err) {
      if (!err) {
        res.send("succesfully deleted specific article");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
