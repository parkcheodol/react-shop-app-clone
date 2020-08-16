import React, { useEffect } from 'react'
import axios from 'axios'
import { FaCode } from "react-icons/fa";

function LandingPage() {

    // #3-1 DB에 저장된 것을 가져오기
    useEffect(() => {

        
        
        // Backend 에 요청 보내기 
        axios.post('/api/product/products')
            .then(response => {
                if(response.data.success) {
                    // front에서 정보를 받아봄 
                    console.log(response.data)
                } else {
                    alert('상품 가져오기 실패')
                }
            })
        
        
    }, [])


    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>@jxxkive</h2>
            </div>
            
            {/* Filter */}

            {/* Search */}

            {/* Cards */}


            <div style={{ justifyContent: 'center' }}>
                <button>더보기</button>
            </div>
        </div>
    )
}

export default LandingPage
