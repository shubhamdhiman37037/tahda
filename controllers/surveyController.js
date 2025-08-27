const Joi = require("joi");
const { Op, Sequelize, literal, where, or } = require("sequelize");
const Model = require("../models/index");
const {
  validateUser,

  success,
  failure,

  serverError,
} = require("../helpers/commonHelper");
const { err, failures, successe } = require("../helpers/response");
module.exports = {
  surveyQuestions: async (req, res) => {
    try {
      const schema = Joi.object({
        questions: Joi.string().required(),
      });
      const { error } = validateUser(schema, req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { questions } = req.body;
      const question = await Model.surveyModel.create({ questions });
      success(res, successe.questions, question);
    } catch (error) {
      console.log(error);
      serverError(res, err.server, error);
    }
  },
  answers: async (req, res) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return failure(res, failures.notFound);
      }
      const schema = Joi.object({
        answers: Joi.string().required(),
      });
      const { error } = validateUser(schema, req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { answers } = req.body;
      const answer = await Model.answersModel.create({ userId, answers });
      success(res, successe.answers, answer);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
};
