//@ts-check
import bcrypt from "bcryptjs"
/**
 * @type {Number}
 */
const saltlen = 10;

/**
 * 
 * @param {string} pass 
 */
export const hasherpass = function(pass){
    return bcrypt.hash(pass, saltlen)
}

/**
 * @param {string} pass
 * @param {string} hash
*/
export const verifyhashpass = function(pass,hash){
    return bcrypt.compare(pass, hash)
}