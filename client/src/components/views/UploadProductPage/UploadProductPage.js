import React, { useState } from 'react'
import { Typography, Button, Form, Input } from 'antd';

const { Title } = Typography;
const { TextArea } = Input;

function UploadProductPage() {


    // #2-2 6:00
    const [ProductTitle, setProductTitle] = useState("")
    const [ProductDescription, setProductDescription] = useState("")
    const [ProductPrice, setProductPrice] = useState(0)
    const [ProductContinent, setProductContinent] = useState(1)
    const [ProductImage, setProductImage] = useState([])

    
    const titleChangeHandler = (event) => {
        setProductTitle(event.currentTarget.value)
    }
    
    const descriptionChangeHandler = (event) => {
        setProductDescription(event.currentTarget.value)
    }

    const priceChangeHandler = (event) => {
        setProductPrice(event.currentTarget.value)
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}> 의류 상품 업로드 </Title>
            </div>

            <Form> 
                {/* DropZone */}
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
                <select>
                    <option></option>
                </select>

                <br />
                <br />
                <Button>
                    확인
                </Button>

            </Form>

            
        </div>
    )
}

export default UploadProductPage
