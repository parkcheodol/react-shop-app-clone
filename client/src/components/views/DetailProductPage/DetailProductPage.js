import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductImage from './Sections/ProductImage'
import ProductInfo from './Sections/ProductInfo'
// #4-2 반응형
import { Row, Col } from 'antd'

// #4-1 상품 상세정보
function DetailProductPage(props) {

    const productId = props.match.params.productId

    // #4-2 
    const [Product, setProduct] = useState({})

    useEffect(() => {
        

        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                if(response.data.success) {
                    // #4-1 13:55 어떤 결과값이 오는지 확인
                    console.log('response.data', response.data)
                    setProduct(response.data.product[0])
                } else {
                    alert('상세정보 가져오기 실패')
                }
            })

    }, [])

    return (
        <div style={{ width: '100%', padding: '3rem 4rem' }}>
            
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <h1>{Product.title}</h1>
            </div>

            <br />

            <Row gutter={[16, 16]} >
                
                <Col lg={12} sm={24}>
                    {/* ProductImage */}
                    <ProductImage detail={Product} />
                </Col>
                <Col lg={12} sm={24}>
                    {/* ProductInfo */}
                    <ProductInfo detail={Product} />
                </Col>

            </Row>
            
        </div>
    )
}

export default DetailProductPage
