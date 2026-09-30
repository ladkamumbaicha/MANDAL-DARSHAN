// IMPORTANT: The MongoDB password that was previously pasted into chat is exposed.
// Rotate it in MongoDB Atlas before deployment and put the NEW password below.
const MONGODB_URI =
  "mongodb+srv://dakshbudhel123_db_user:REPLACE_WITH_NEW_PASSWORD@cluster0.ljj9xq8.mongodb.net/ganpati_locator?retryWrites=true&w=majority";

const DB_NAME = "ganpati_locator";
const MONGODB_COLLECTION = "mandals";
const ADMIN_EMAIL = "dakshbudhel123@gmail.com";

const ADMIN = {
  username: "ladkamumbaicha@gmail.com",
  password: "ladkamumbaicha@"
};

const JWT_SECRET = "adadadadadadwdasdad";

module.exports = {
  MONGODB_URI,
  DB_NAME,
  MONGODB_COLLECTION,
  ADMIN_EMAIL,
  ADMIN,
  JWT_SECRET
};
