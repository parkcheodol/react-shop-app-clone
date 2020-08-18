import React, { useState } from 'react'
import { Collapse, Radio } from 'antd';

const { Panel } = Collapse;

// #3-9 RadioBox Filter #1
function RadioBox(props) {

    const [Value, setValue] = useState(0)

    const renderRadioBox = () => (props.list && props.list.map(value => (
        <Radio key={value._id} value={value._id}> {value.name} </Radio>
    ))
    )

    // #3-9 12:30
    const handleChange = (event) => {
        setValue(event.target.value)
        props.handleFilters(event.target.value)
    }


    return (
        <div>
            <Collapse defaultActiveKey={['1']} >
                <Panel header="This is panel header 1" key="1">
                    <Radio.Group onChange={handleChange} value={Value}>
                        {renderRadioBox()}
                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox
