const express = require('express');
const router = express.Router();
const multer = require('multer')

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

module.exports = router;
