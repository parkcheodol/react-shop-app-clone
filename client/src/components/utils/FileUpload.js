import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'
import axios from 'axios'

// #2-4 DropZone
function FileUpload(props) {

    // #2-8 FileUpload Image 를 UploadPage 로 
    const [Images, setImages] = useState([])

    // #2-5 onDropFunction
    const dropHandler = (files) => {

        let formData = new FormData();

        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("files", files[0])

        axios.post('/api/product/image', formData, config)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data)
                    // #2-6 7:00
                    setImages([...Images, response.data.filePath])

                    // #2-8 이미지를 올렸을 때, state 변경되는 부분
                    props.refreshFunction([...Images, response.data.filePath])

                } else {

                    // console.log(response.data)
                    alert('파일 저장 실패')
                }
            })
    }

    // #2-7 Delete Image
    const deleteHandler = (image) => {
        
        const currentIndex = Images.indexOf(image)
        
        // 클릭했을 때, 값 확인
        console.log('currentIndex', currentIndex)

        // #2-7 4:00 원리 설명
        let newImages = [...Images]
        newImages.splice(currentIndex, 1)
        setImages(newImages)
        
        // #2-8 이미지 삭제할 때도 state 변경
        props.refreshFunction(newImages)

    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between'}}>
            <Dropzone onDrop={dropHandler}>
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div
                            style={{
                                width:300, height:240, border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize: '3rem'}} />
                        </div>
                    </section>
                )}
            </Dropzone>

            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>

                {Images.map((image, index) => (

                    <div onClick={() => deleteHandler(image)} key={index}>
                        <img style={{ minWidth:'300px', width: '300px', height: '240px'}} src={`http://localhost:5000/${image}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FileUpload
