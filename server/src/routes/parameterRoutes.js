const express = require("express");
const ParameterController = require("../controllers/parameterController.js");
const tokenObject = require("../middlewares/authentication.js");

const router = express.Router();
const parameterController = new ParameterController();

router.post("/", tokenObject.authenticateToken, (req, res) =>
  parameterController.addParameter(req, res)
);
router.put("/:id", tokenObject.authenticateToken, (req, res) =>
  parameterController.updateParameter(req, res)
);
router.delete("/:id", tokenObject.authenticateToken, (req, res) =>
  parameterController.deleteParameter(req, res)
);
router.get("/", tokenObject.verifyApiToken, (req, res) =>
  parameterController.getParameters(req, res)
);
router.get("/values", tokenObject.verifyApiToken, (req, res) =>
  parameterController.getParametersShort(req, res)
);
module.exports = router;
