import React, { useEffect } from 'react'
import axios from 'axios'

// #4-1 상품 상세정보
function DetailProductPage(props) {

    const productId = props.match.params.productId

    useEffect(() => {
        

        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                if(response.data.success) {
                    // #4-1 13:55 어떤 결과값이 오는지 확인
                    console.log('response.data', response.data)
                } else {
                    alert('상세정보 가져오기 실패')
                }
            })

    }, [])

    return (
        <div>
            
        </div>
    )
}

export default DetailProductPage
