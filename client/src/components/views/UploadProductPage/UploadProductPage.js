import React, { useState } from 'react'
import { Typography, Button, Form, Input } from 'antd';
// #2-4 DropZone
import FileUpload from '../../utils/FileUpload'
import axios from 'axios';


const { Title } = Typography;
const { TextArea } = Input;

// #2-3 Select Option
const Category = [
    { key: 1, value: "Outer" },
    { key: 2, value: "Top" },
    { key: 3, value: "Bottom" },
    { key: 4, value: "Shoes" },
    { key: 5, value: "Acc" },
    { key: 6, value: "Cute" }
]

function UploadProductPage(props) {


    // #2-2 6:00
    const [ProductTitle, setProductTitle] = useState("")
    const [ProductDescription, setProductDescription] = useState("")
    const [ProductPrice, setProductPrice] = useState(0)
    const [ProductCategory, setProductCategory] = useState(1)
    const [ProductImages, setProductImages] = useState([])

    
    const titleChangeHandler = (event) => {
        setProductTitle(event.currentTarget.value)
    }
    
    const descriptionChangeHandler = (event) => {
        setProductDescription(event.currentTarget.value)
    }

    const priceChangeHandler = (event) => {
        setProductPrice(event.currentTarget.value)
    }

    const categoryChangeHandler = (event) => {
        setProductCategory(event.currentTarget.value)
    }

    // #2-8 Images State 가져오는 func
    const updateProductImages = (newImages) => {
        setProductImages(newImages)
    }

    // #2-9 onSubmit Func
    const submitHandler = (event) => {
        event.preventDefault();

        // 모든 칸이 채워지지 않으면 제출할 수 없게
        if (!ProductTitle || !ProductDescription || !ProductPrice || !ProductCategory || !ProductImages.length === 0 ) {
            return alert("모든 값을 넣어주세요")
        }

        // 서버에 채운 값들을 request 보낸다

        const body = {

            // 로그인 한 사람의 아이디
            writer: props.user.userData._id,
            title: ProductTitle,
            description: ProductDescription,
            price: ProductPrice,
            images: ProductImages,
            category: ProductCategory
        }

        axios.post("/api/product", body)
            .then(response => {
                if(response.data.success) {
                    
                    alert('상품 업로드 성공')  
                    props.history.push('/')
                } else {
                    alert('상품 업로드 실패')
                }
            })

    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}> 의류 상품 업로드 </Title>
            </div>

            <Form onSubmit={submitHandler}> 
                {/* DropZone */}

                <FileUpload refreshFunction={updateProductImages} />

                <br />
                <br />
                <label>이름</label>
                <Input onChange={titleChangeHandler} value={ProductTitle} />
                <br />
                <br />
                <label>설명</label>
                <TextArea onChange={descriptionChangeHandler} value={ProductDescription} />
                <br />
                <br />
                <label>가격($)</label>
                <Input type="number" onChange={priceChangeHandler} value={ProductPrice} />
                <br />
                <br />
                <select onChange={categoryChangeHandler} value={ProductCategory}>

                    {Category.map(item => (
                        <option key={item.key} value={item.key}> {item.value} </option>

                    ))}

                </select>

                <br />
                <br />
                <button type="submit">
                    확인
                </button>

            </Form>

            
        </div>
    )
}

export default UploadProductPage
