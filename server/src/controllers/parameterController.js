const ParameterModel = require("../models/parameterModel.js");

const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 });

class ParameterController {
  constructor() {
    this.parameterModel = new ParameterModel();
  }

  async addParameter(req, res) {
    try {
      const createDate = new Date();
      const parameterData = {
        ...req.body,
        createDate: createDate,
      };

      const id = await this.parameterModel.addParameter(parameterData);
      cache.flushAll();
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateParameter(req, res) {
    try {
      await this.parameterModel.updateParameter(req.params.id, req.body);
      cache.flushAll();
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteParameter(req, res) {
    try {
      await this.parameterModel.deleteParameter(req.params.id);
      cache.flushAll();
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getParameters(req, res) {
    try {
      const parameters = await this.parameterModel.getParameters();
      const updatedParameters = parameters.map((param) => {
        const { createDate, description, id, parameterKey, value } = param;

        let updatedValue;
        if (req.query.country && param[req.query.country]) {
          updatedValue = param[req.query.country];
        } else {
          updatedValue = value;
        }

        return {
          createDate,
          description,
          id,
          parameterKey,
          value: updatedValue,
        };
      });

      res.json(updatedParameters);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getParametersShort(req, res) {
    try {
      const cacheKey = `parameters:${req.query.country || "default"}`;

      const cachedParameters = cache.get(cacheKey);

      if (cachedParameters) {
        return res.json(cachedParameters);
      }

      const parameters = await this.parameterModel.getParameters();
      const response = {};

      parameters.forEach((param) => {
        const { parameterKey, value } = param;
        const updatedValue =
          req.query.country && param[req.query.country]
            ? param[req.query.country]
            : value;

        response[parameterKey] = updatedValue;
      });

      cache.set(cacheKey, response);

      res.json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ParameterController;
