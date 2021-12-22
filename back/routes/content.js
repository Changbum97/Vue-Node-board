var router = require('express').Router();
var mysql = require('mysql2');
var db = require('.././models');
var Op = require('sequelize').Op;
var multer = require('multer');
var fs = require('fs');
db.sequelize.sync();
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
var upload = multer({ storage: storage });

router.post('/write', function(req, res){
    db.content.create({
        boardnum: req.body.boardnum,
        writer: req.body.writer,
        title: req.body.title,
        text: req.body.text,
        imagecnt: req.body.imagecnt,
    }).then(function(){
      return res.status(200).json({
          message: '글 작성 완료!',
      })
    }).catch(function(err){
        console.log(err);
        return res.status(404).json({message: '에러뜸'});
    })
});
router.post('/boardlist', function(req, res){
    db.content.findAll({
        where: {
            boardnum: req.body.boardnum
        },
        offset: 0 + (req.body.page - 1) * 10,
        limit: 10,
        order: [['id', 'ASC']],
        raw: true,
    }).then(result => {
        return res.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return res.status(404).json({message: '에러뜸'});
    })
});
router.post('/boardlistcnt', function(req, res){
    db.content.findAndCountAll({
        where: {
            boardnum: req.body.boardnum
        },
        raw: true,
    }).then(result => {
        return res.status(200).json(result.count);
    }).catch(err => {
        console.log(err);
        return res.status(404).json({message: '에러뜸'});
    })
});
router.post('/content', function(req, res){
    db.content.findOne({
        where: {
            id: req.body.id
        }, raw:true,
    }).then(result => {
        return res.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return res.status(404).json({message: '에러뜸'});
    })
});
router.post('/imagesave', upload.array('filelist'), function(req, res) {
    var i, newname;
    db.content.findOne({
        limit: 1,
        order: [['id', 'DESC']],
        raw:true,
    }).then(result => {
        newname = result.id;
        for(i=0;i<req.files.length;i++) {
            fs.renameSync(req.files[i].path, 'uploads/'+(newname+1)+'-'+(i+1)+'.png');
        }
        return res.status(200).json({message:'이미지업로드완료!'});
    }).catch(err => {
        console.log(err);
        return res.status(404).json({message: '에러뜸'});
    })
});
router.post('/delete', function(req, res){
    db.content.destroy({
        where: {
            id: req.body.id
        },
    }).then(function(){
        return res.status(200).json({
            message: '글 삭제 완료!'
        });
    }).catch(err =>{
        console.log(err);
        return res.status(404).json({message: '에러뜸'});
    })
});
router.post('/edit', function(req, res){
    db.content.update({text: req.body.text}, {
        where: {
            id: req.body.id
        },
    }).then(function(){
        return res.status(200).json({
            message: '글 수정 완료!'
        });
    }).catch(err =>{
        console.log(err);
        return res.status(404).json({message: '에러뜸'});
    })
});
router.post('/search', function(req, res){
    if(req.body.searchoption == '제목'){
        db.content.findAndCountAll({
            where: {
                title: {
                    [Op.like]: "%"+req.body.searchkeyword+"%"
                },
            },
            order: [['id', 'ASC']],
            raw: true,
        }).then(result => {
            var cnt = new Object();
            cnt.cnt = result.count;
            result.rows.push(cnt);
            return res.status(200).json(result.rows);
        }).catch(err => {
            console.log(err);
            return res.status(404).json({message: '에러뜸'});
        })
    } else {
        db.content.findAndCountAll({
            where: {
                writer: {
                    [Op.like]: "%"+req.body.searchkeyword+"%"
                },
            },
            order: [['id', 'ASC']],
            raw: true,
        }).then(result => {
            var cnt = new Object();
            cnt.cnt = result.count;
            result.rows.push(cnt);
            return res.status(200).json(result.rows);
        }).catch(err => {
            console.log(err);
            return res.status(404).json({message: '에러뜸'});
        })
    }
});
module.exports = router;