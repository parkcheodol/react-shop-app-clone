import React from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'
import axios from 'axios'

// #2-4 DropZone
function FileUpload() {

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

                } else {
                    alert('파일 저장 실패')
                }
            })


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
        </div>
    )
}

export default FileUpload
