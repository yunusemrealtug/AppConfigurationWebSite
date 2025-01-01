const admin = require("../utils/db.js");

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    res.status(201).send({ uid: userRecord.uid });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  registerUser,
};
