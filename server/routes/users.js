const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");
const { Product } = require('../models/Product');
const { Payment } = require('../models/Payment');
const async = require('async');


//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        // #5-1 4:00
        cart: req.user.cart,
        history: req.user.history // 결제내역
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

// #4-4 9:50
router.post("/addToCart", auth, (req, res) => {

    // #4-5 
    // User Collection 에 해당 유저의 모든 정보 가져오기
    // req.user === user (auth.js)
    User.findOne({ _id: req.user._id },
        (err, userInfo) => {

        // 가져온 정보에서 카트에 넣으려 하는 상품이 이미 들어있는지 확인
        let duplicate = false;
        userInfo.cart.forEach((item) => {
            if(item.id === req.body.productId) {
                duplicate = true;
                // true 면 이미 들어있는 것, false 면 카트에 들어있지 않은 것
            }
        })

        
        if(duplicate) {

            // 상품이 이미 있을 때
            User.findOneAndUpdate(
                { _id: req.user._id, "cart.id": req.body.productId },
                { $inc: { "cart.$.quantity": 1 } },
                { new: true },
                (err, userInfo) => {
                    if(err) return res.status(400).json({ success: false, err})
                    res.status(200).send(userInfo.cart)
                }
            )
        } else {

            // 상품이 있지 않을 때
            User.findOneAndUpdate(
                {_id: req.user._id},
                {
                    $push: {
                        cart: {
                            id: req.body.productId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.status(400).json({ success: false, err })
                    res.status(200).send(userInfo.cart)
                }
            )
        }

    })
    
});


// #5-7 5:40
router.get('/removeFromCart', auth, (req, res) => {

    // Cart 안에 내가 지우려고 한 상품 지워주기
    User.findOneAndUpdate(
        {_id: req.user._id},
        {
            "$pull":
                { "cart": { "id": req.query.id } }
        },
        { new: true },
        (err, userInfo) => {

            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })

            // Product Collection 에서 현재 남아 있는 상품의 정보를 가져오기
            // productIds = ['123123', '234234']

            Product.find({ _id: { $in: array }})
            .populate('writer')
            .exec((err, productInfo) => {
                return res.status(200).json({
                    productInfo,
                    cart
                })
            })
        }
    )

    

})

// #5-11 7:00
// user_action 의 request 를 server 에서 받아줌
router.post('/successBuy', auth, (req, res) => {

    // 1. User Collection 의 history 필드 안에 간단한 결제 정보 넣어주기
    let history = [];
    let transactionData = {};

    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: Date.now(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentId
        })
    })

    // #5-12
    // 2. Payment Collection 에 자세한 결제 정보 넣어주기 
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }

    transactionData.data = req.body.paymentData
    transactionData.product = history

        // history 정보 저장
        User.findOneAndUpdate(
            { _id: req.user._id },
            { $push: { history: history }, $set: { cart: [] } },
            { new: true },
            (err, user) => {
                if (err) return res.json({ success: false, err })

                // Payment 에 transactionData 정보 저장
                const payment = new Payment(transactionData)
                payment.save((err, doc) => {
                    if (err) return res.json({ success: false, err })

                    // #5-13
                    // 3. Product Collection 의 sold 필드 정보 업데이트 시켜주기

                    // 상품 당 몇 개의 quantity 를 샀는지
                    let products = [];
                    doc.product.forEach(item => {
                        products.push({ id: item.id, quantity: item.quantity })
                    })

                        async.eachSeries(products, (item, callback) => {
                            Product.update(
                                {_id: item.id},
                                {
                                    $inc: {
                                        "sold" : item.quantity
                                    }
                                },
                                { new: false },
                                callback
                            )
                            
                        }, (err) => {
                            if(err) return res.json({ success: false, err})
                            res.status(200).json({success: true,
                            cart:user.cart,
                        cartDetail: [] })
                        })


                })
            }
        )


})


module.exports = router;
