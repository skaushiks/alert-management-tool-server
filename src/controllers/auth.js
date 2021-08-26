const Admins = require('../models/admins');
const Branches = require('../models/branches');
const jwt = require('jsonwebtoken');

const jwtToken = (_id, role) => {
    return jwt.sign(
        { _id, role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10d' }
    );
};

exports.signin = async (req, res) => {
    try {
        const admin = await Admins.findOne({ username: req.body.username }).exec();

        const incharge = await Branches.findOne({ username: req.body.username }).exec();

        if (admin) {
            const isPassword = await admin.authenticate(req.body.password);

            if (isPassword && admin.role === 'administrator') {
                const token = jwtToken(admin._id, admin.role);

                const branches = await Branches.find({})
                    .select("-username -password -role -createdAt -updatedAt -__v")
                    .exec();

                const { username, role } = admin;

                res.status(200).json({
                    token,
                    user: { username, role },
                    branches
                });
            } else {
                return res.status(401).json({ errorMessage: 'Invalid Credentials!' });
            }
        } else if (incharge) {
            const isPassword = await incharge.authenticate(req.body.password);

            if (isPassword && incharge.role === 'incharge') {
                const token = jwtToken(incharge._id, incharge.role);

                const { username, role, InstitutionName, BranchName, Address, City, ContactNumber, BranchIncharge, PincodeCovered } = incharge;

                res.status(200).json({
                    token,
                    user: { username, role },
                    branchDetails: {
                        InstitutionName,
                        BranchName,
                        Address,
                        City,
                        ContactNumber,
                        BranchIncharge,
                        PincodeCovered
                    }
                });
            } else {
                return res.status(401).json({ errorMessage: 'Invalid Credentials!' });
            }
        } else {
            return res.status(404).json({ errorMessage: 'User does not exist!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ errorMessage: 'Internal Server Error.' })
    }
};