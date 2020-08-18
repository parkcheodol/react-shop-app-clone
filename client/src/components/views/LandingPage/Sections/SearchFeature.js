import React, { useState } from 'react'
import { Input } from 'antd';

const { Search } = Input;

// #3-11
function SearchFeature(props) {

    const [SearchTerm, setSearchTerm] = useState("") 

    const searchHandler = (event) => {

        // 타이핑할 때마다 바꿔줌
        setSearchTerm(event.currentTarget.value)
        // 부모 컴포넌트에 업데이트
        props.refreshFunction(event.currentTarget.value)
    }

    return (
        <div>
            <Search
                placeholder="input search text"
                onChange={searchHandler}
                style={{ width: 200 }}
                value={SearchTerm}
            />
        </div>
    )
}

export default SearchFeature
