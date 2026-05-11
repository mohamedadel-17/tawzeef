import mongoose, { Schema, model, models } from "mongoose";

const AnalysisSchema = new Schema({
  applicationId: { type: Number, required: true, unique: true, index: true },
  cvUrl: String,
  cvText: String,
  aiFeedback: {
    strengths: [String],
    weaknesses: [String],
    status: String,
    summary: String,
    decisionSummary: String,
    improvementTip: String
  },
  rawAiResponse: Object,
}, { timestamps: true });

const Analysis = models.Analysis || model("Analysis", AnalysisSchema);
export default Analysis;