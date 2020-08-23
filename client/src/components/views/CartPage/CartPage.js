import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem, onSuccessBuy } from '../../../_actions/user_actions'
// #5-4
import UserCardBlock from './Sections/UserCardBlock'
import { Empty, Result } from 'antd';
// #5-9
import Paypal from '../../utils/Paypal'

// #5-2
function CartPage(props) {

    const dispatch = useDispatch();

    // #5-6 카트 가격 합산
    const [Total, setTotal] = useState(0)

    // #5-8
    const [ShowTotal, setShowTotal] = useState(false)

    // #5-13 11:50 결제 성공 후 메시지
    const [ShowSuccess, setShowSuccess] = useState(false)
    
    useEffect(() => {

        let cartItems=[]

        // 리덕스 User state 안에 cart 안 상품이 들어있는지 확인

        if (props.user.userData && props.user.userData.cart) {
            if(props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    console.log('item', item)
                    cartItems.push(item.id)
                })

                dispatch(getCartItems(cartItems, props.user.userData.cart))
                .then(response => {

                    // #5-6
                    // console.log(response.payload)
                    calculateTotal(response.payload)
                    
                })
            }
        } 

    }, [props.user.userData])

    let calculateTotal = (cartDetail) => {
        let total = 0;

        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity

            setTotal(total)
            setShowTotal(true)
        })
    }

    // #5-7 Remove Button
    let removeFromCart = (productId) => {

        dispatch(removeCartItem(productId))
            .then(response => {
                
                // #5-8 삭제 후 처리
                // console.log('response', response)

                if (response.payload.productInfo.length <= 0) {
                    setShowTotal(false)
                }
            })
    }

    // #5-11 Paypal 결제 후
    const transactionSuccess = (data) => {
        dispatch(onSuccessBuy({

            // #5-11 2:30
            paymentData: data,
            cartDetail: props.user.cartDetail
        }))
            .then(response => {
                if(response.payload.success) {
                    setShowTotal(false)
                    // #5-13 13:00
                    setShowSuccess(true)
                }
            })
    }

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>Shopping Cart</h1>

            <div>
                <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart} />
            </div>

            {ShowTotal ? 
                <div style={{ marginTop: '3rem' }}>
                    <h2>Total Amount :${Total}</h2>
                </div>
                : ShowSuccess ?
                    <Result 
                        status="success"
                        title="Successfully Purchased Items"
                    />
                    :
                    <>
                    <br />
                    <Empty description={false} />
                    </>
            }

            {/* Paypal button */}

            {ShowTotal &&
                <Paypal
                    total={Total}
                    onSucces={transactionSuccess}
                />
            
            }
            
        </div>
    )
}

export default CartPage
