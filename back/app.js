var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors({
    origin: 'http://127.0.0.1:8080',
    credentials:true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var content = require('./routes/content');
app.use('/content', content);

app.listen(52273, function() {
    console.log('Server Running at http://127.0.0.1:52273');
});