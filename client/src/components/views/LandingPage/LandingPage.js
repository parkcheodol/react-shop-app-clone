import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaCode } from "react-icons/fa";
import { Icon, Col, Card, Row, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta'
// #3-3 
import ImageSlider from '../../utils/ImageSlider';


function LandingPage() {

    const [Products, setProducts] = useState([])

    // #3-1 DB에 저장된 것을 가져오기
    useEffect(() => {

        
        // Backend 에 요청 보내기 
        axios.post('/api/product/products')
            .then(response => {
                if(response.data.success) {
                    // front에서 정보를 받아봄 
                    console.log(response.data)
                    setProducts(response.data.productInfo)
                } else {
                    alert('상품 가져오기 실패')
                }
            })
        
        
    }, [])

    // #3-2 Product Cards
    const renderCards = Products.map((product, index) => {

        // 카드에 어떤 정보가 들어있는지 확인
        console.log('product', product)

        return <Col lg={6} md={8} xs={24} key={index}>
        
            <Card
                cover={<ImageSlider images={product.images} />}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />

            </Card>
        </Col>

    })

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>@jxxkive <Icon type="rocket" /></h2>
            </div>
            
            {/* Filter */}

            {/* Search */}

            {/* Cards */}

            <Row gutter={[16, 16]}>
                {renderCards}
            </Row>

            <div style={{ justifyContent: 'center' }}>
                <button>더보기</button>
            </div>
        </div>
    )
}

export default LandingPage
