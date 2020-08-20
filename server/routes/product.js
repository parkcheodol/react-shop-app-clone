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

// #3-1 3:30
router.post('/products', (req, res) => {

  // #3-4 6:00
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  // #3-12 4:00
  let term = req.body.searchTerm

  // #3-8 7:00
  let findArgs = {};
  
  for(let key in req.body.filters) {

    if(req.body.filters[key].length > 0) {

      // #3-10 6:30
      
      // key 가 price 인지 category 인지 확인
      console.log('key', key) 

      if(key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0], // Greater than equal
          $lte: req.body.filters[key][1] // Less than equal
        }
      } else {
        findArgs[key] = req.body.filters[key];
      }
      
    }
  }

  // 확인
  //console.log('findArgs', findArgs)

  if (term) {
    // #3-12 6:00 find 추가
    Product.find(findArgs)
      .find({ $text: { $search: term } })
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true, productInfo, postSize: productInfo.length })
      })
  } else {
    // product collection 에 들어있는 모든 상품 정보 가져오기 (productInfo: 받아온 모든 정보)
    Product.find(findArgs)
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true, productInfo, postSize: productInfo.length })
      })
  }

})

// #4-1 10:00

// axios.get(`/api/product/products_by_id?id=${productId}&type=single`)

router.get('/products_by_id', (req, res) => {

  let type = req.query.type
  let productIds = req.query.id

  // #5-2 13:00
  if (type === "array") {

    // id= 123123, 234234, 345345 를
    // productIds = ['123123', '234234', '345345'] 이렇게 바꿔줌

    let ids = req.query.id.split(',')
    productIds = ids.map(item => {
      return item
    })
  }

  // productId를 이용해 DB에서 productId와 같은 상품의 정보 가져오기

  Product.find({ _id: {$in : productIds} })
    .populate('writer')
    .exec((err, product) => {
      if(err) return res.status(400).send(err)
      return res.status(200).send(product)
    })
})




module.exports = router;
