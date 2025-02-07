
const router  = require("express").Router()

const {register_user, get_all_users, update_users, login} = require("../controllers/users_controller.js")

const {check_token} =  require("../auth/token_validation.js")
// API REQUESTS
router.post('/register', check_token,register_user)
router.get('/all_users',check_token,get_all_users)
router.put('/update-user/:userId',check_token,update_users)
router.post('/login',login )

module.exports = router
