const express = require('express');
const router = express.Router();
const multer = require('multer')
const { Product } = require('../models/Product')

//=================================
//             Product
//=================================

// #2-6 Multer 사용법
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    }
  })
   
var upload = multer({ storage: storage }).single("files")


router.post('/image', (req, res) => {

    // 가져온 이미지 저장 (Multer 이용)
    upload(req, res, err => {
        if(err) {
          return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })

})

// #2-9 10:30
router.post('/', (req, res) => {

  // 받아온 정보를 DB에 넣어준다
  const product = new Product(req.body)

  product.save((err) => {
    if(err) return res.status(400).json({ success: false, err})
    return res.status(200).json({ success: true })
  })

})

module.exports = router;
