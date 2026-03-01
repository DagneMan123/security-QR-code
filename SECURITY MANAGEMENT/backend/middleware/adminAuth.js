import jwt from "jsonwebtoken";


const adminAuth = async (req, res, next) => {
  try {
    const {token} = req.headers;

    if (!token) {
            return res.json({
                success:false,
                message:"NOT AUTHORIZED"
            }) 
          }

          const token_decode = jwt.verify(token, process.env.JWT_SECRET)

          if (token_decode !== process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD) {
          console.log("notauthenticated");

             return res.json({
                success:false,
                message:"NOT AUTHORIZED"
            })
          }
          console.log("authenticated");
          

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "INVALID TOKEN" });
  }
};



export default adminAuth;