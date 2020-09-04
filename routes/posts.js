const router = require('express').Router();
const verify = require('./verifyToken')

router.get('/',verify, (req,res) =>{
    res.json({posts: {title: 'Post', Description: 'Confedential'}});
})















module.exports = router;