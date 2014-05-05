var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
          res.render('index', { title: 'Express' });
        })
      .get('/chatroom', function (req, res) {
          res.render('chatroom', { title: 'ChatRoom'});
      })
      .get('/rooms', function (req, res) {
          res.render('rooms', { title: 'rooms'});
      });

module.exports = router;
