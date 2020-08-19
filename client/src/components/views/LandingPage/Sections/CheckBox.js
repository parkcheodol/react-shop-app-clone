import React, { useState } from 'react'
import { Collapse, Checkbox } from 'antd';

const { Panel } = Collapse;

// #3-6 CheckBox Collapse
function CheckBox(props) {


    // #3-7 CheckBox onChange
    const [Checked, setChecked] = useState([])

    const handleToggle = (value) => {

        // 선택한 것 Index 구하고
        const currentIndex = Checked.indexOf(value)

        // 전체 Checked 된 State 에서 현재 누른 Checkbox 가 이미 있다면 (#3-7 6:00)
        const newChecked = [...Checked]

        // State 에 넣어준다
        if(currentIndex === -1) {
            newChecked.push(value)
        } else {
            // 빼주고
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked)

        // #3-8
        props.handleFilters(newChecked)
    }

    const renderCheckBoxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index}>
            <Checkbox onChange={() => handleToggle(value._id)} checked={Checked.indexOf(value._id) === -1 ? false : true} />
                <span>{value.name}</span>
        </React.Fragment>
    ))

    
    return (
        <div>
            <Collapse defaultActiveKey={['0']} >
                <Panel header="Category" key="1">
                    {renderCheckBoxLists()}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox
