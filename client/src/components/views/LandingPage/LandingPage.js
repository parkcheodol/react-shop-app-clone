import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaCode } from "react-icons/fa";
import { Icon, Col, Card, Row, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta'
// #3-3 
import ImageSlider from '../../utils/ImageSlider';
// #3-6
import { category, price } from './Sections/Datas';
import CheckBox from './Sections/CheckBox';
// #3-9
import RadioBox from './Sections/RadioBox'
// #3-11
import SearchFeature from './Sections/SearchFeature'

function LandingPage() {

    const [Products, setProducts] = useState([])

    // #3-4 4:30
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(4)

    // #3-5 7:15
    const [PostSize, setPostSize] = useState(0)

    // #3-8 1:50
    const [Filters, setFilters] = useState({
        category: [],
        price: []
    })

    // #3-11 8:30
    const [SearchTerm, setSearchTerm] = useState("")

    // #3-1 DB에 저장된 것을 가져오기
    useEffect(() => {

        // #3-4 5:00 body를 이용해서 8개만 가져오도록 함
        let body = {
            skip: Skip,
            limit: Limit
        }
        
        // #3-5 2:20
        getProducts(body)
        
        
    }, [])

    // #3-5 loadMore #2
    const getProducts = (body) => {
        // Backend 에 요청 보내기 
        axios.post('/api/product/products', body)
            .then(response => {
                if(response.data.success) {
                    // front에서 정보를 받아봄 
                    console.log(response.data)
                    // #3-5 5:30
                    if(body.loadMore) {
                        setProducts([...Products, ...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert('상품 가져오기 실패')
                }
            })
    }


    // #3-4 loadMore onClick Func
    const loadMoreHandler = () => {
        
        // SKIP & LIMIT
        // #3-5 2:30
        let skip = Skip + Limit

        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getProducts(body)
        setSkip(skip)
    }

    // #3-2 Product Cards
    const renderCards = Products.map((product, index) => {

        // 카드에 어떤 정보가 들어있는지 확인
        console.log('product', product)

        return <Col lg={6} md={8} xs={24} key={index}>
        
            <Card
                cover={<a href={`/product/${product._id}`}><ImageSlider images={product.images} /></a>}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />

            </Card>
        </Col>

    })

    

    // #3-8 CheckBox Filter #3
    const handleFilters = (filters, type) => {

        const newFilters = { ...Filters }

        newFilters[type] = filters

        // console.log('filters', filters)
        // #3-9
        if (type === "price") {
            let priceValues = handlePrice(filters)
            newFilters[type] = priceValues
        }

        showFilteredResults(newFilters)
        setFilters(filters)
    }

    // #3-8 4:30
    const showFilteredResults = (filters) => {
        
        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }

        getProducts(body)
        setSkip(0)

    }

    // #3-10 2:50
    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for (let key in data) {

            if(data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }
        return array;
    }

    // #3-11 7:30
    const updateSearchTerm = (newSearchTerm) => {

        // setSearchTerm(newSearchTerm)

        // #3-12
        // 값에 맞게 backend 에서 처리
        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    
    }

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>@jxxkive <Icon type="rocket" /></h2>
            </div>
            
            {/* Filter */}

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
                    <CheckBox list={category} handleFilters={filters => handleFilters(filters, "category")} />
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <RadioBox list={price} handleFilters={filters => handleFilters(filters, "price")} />
                </Col>
            </Row>

            {/* Search */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
                <SearchFeature 
                    refreshFunction={updateSearchTerm}
                />
            </div>

            {/* Cards */}

            <Row gutter={[16, 16]}>
                {renderCards}
            </Row>

            <br />

            {PostSize >= Limit &&
                <div style={{ justifyContent: 'center' }}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }

            
        </div>
    )
}

export default LandingPage
