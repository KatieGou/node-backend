const bcrypt = require('bcryptjs');
const saltRounds = 5;

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}

function comparePassword(password, hashedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
                reject(err);
            } else {
                resolve(isMatch);
            }
        });
    });
}

module.exports = {
    hashPassword,
    comparePassword
};