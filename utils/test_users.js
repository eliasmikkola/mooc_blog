const initialUsers = [
    {
        "username": "masa213",
        "name": "Martti Pentikäinen",
        "adult": false,
        "password": "password"
    },
    {
        "username": "jakki",
        "name": "Jaakko Pakko",
        "adult": true,
        "password": "password"
    },
    {
        "username": "123Jou",
        "name": "Jou Mään",
        "password": "password"
    }
]
const invalidUsers = {
    invalidPassword: {
            "username": "123Jou",
            "name": "Mark Twain",
            "password": "hv"
    },
    dublicateUsername: {
        "username": "123Jou",
        "name": "Jou Mään",
        "password": "password"
    }
}
module.exports = {
    initialUsers,
    invalidUsers
}