const { User } = require('../models')
const ApiError = require('../utils/ApiError');

const authUser = async (req, res) => {
    return res.status(200).send();
};

const getUser = async (req, res) => {
    const user = await User.findOne(req.params.address);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
}


module.exports = {
    authUser,
    getUser
};