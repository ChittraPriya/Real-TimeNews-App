const JWT_SECRET = require('../utils/config.js')

const isAuthenticated = async(req,res,next) => {
    //chck if the token is present in the cookie
    const token = req.cookies && req.cookies.token

    //if there is no token , return to the unauthorised user
    if(!token){
        return res.status(500).json({message: 'UnAuthorised'})
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)

        //if the token is valid , attach the userId to the request object
        req.body = decoded.userId

        //call the next middleware or route handler\
        next()
    } catch (error) {
        res.status(400).json({message:'Unauthorised', error: error.message })
    }
}