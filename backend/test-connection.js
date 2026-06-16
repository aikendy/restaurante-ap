import dotenv from 'dotenv';
dotenv.config();

console.log('PORT:', process.env.PORT);
console.log('USER_DB:', process.env.USER_DB);
console.log('PASSWORD_DB:', process.env.PASSWORD_DB);
console.log('SERVER:', process.env.SERVER);