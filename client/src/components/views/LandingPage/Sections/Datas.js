
// #3-6 CheckBox List

const category = [
    {
        "_id": 1,
        "name": "Outer"
    },
    {
        "_id": 2,
        "name": "Top"
    },
    {
        "_id": 3,
        "name": "Bottom"
    },
    {
        "_id": 4,
        "name": "Shoes"
    },
    {
        "_id": 5,
        "name": "Acc"
    },
    {
        "_id": 6,
        "name": "Cute"
    }
]

// #3-9 RadioBox (Price)
const price = [
    {
        "_id": 0,
        "name": "Any",
        "array": []
    },
    {
        "_id": 1,
        "name": "$0 to $199",
        "array": [0, 199]
    },
    {
        "_id": 2,
        "name": "$200 to $499",
        "array": [200, 499]
    },
    {
        "_id": 3,
        "name": "$500 to $999",
        "array": [500, 999]
    },
    {
        "_id": 4,
        "name": "More than $1000",
        "array": [1000, 1000000]
    }
]


export {
    category,
    price
}