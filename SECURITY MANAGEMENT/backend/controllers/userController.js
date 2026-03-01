import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { SecurityOfficer } from "../models/index.js"

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '24h' })
}

const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(
                { 
                    email: email, 
                    role: 'admin',
                    id: 'admin'
                }, 
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            return res.status(200).json({
                success: true, 
                token: token,
                data: {
                    email: email,
                    role: 'admin'
                }
            });
            
        } else {
            return res.status(401).json({
                success: false, 
                message: 'Invalid admin credentials'
            });
        }
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false, 
            message: error.message || 'Server error'
        });
    }
} 

export const officerLogin = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Find officer by email
        const officer = await SecurityOfficer.findOne({ where: { email }});

        if (!officer) {
            return res.status(404).json({
                success: false,
                message: "Officer not found"
            });
        }

        // Check if officer is active
        if (!officer.isActive) {
            return res.status(403).json({
                success: false,
                message: "Officer account is deactivated"
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, officer.password);
        
        if (isMatch) {
            const token = createToken(officer.officerId);
            
            // Prepare officer data for response
            const officerData = {
                officerId: officer.officerId,
                fullName: officer.fullName,
                email: officer.email,
                phone: officer.phone,
                isActive: officer.isActive
            };
            
            return res.status(200).json({
                success: true,
                message: "Login successful",
                token: token, // THIS WAS MISSING
                data: officerData
            });
            
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

    } catch(error) {
        console.log("Error in officerLogin:", error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
}

export { adminLogin }