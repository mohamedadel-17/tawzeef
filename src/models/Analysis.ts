import mongoose, { Schema, model, models } from "mongoose";

const AnalysisSchema = new Schema({
  applicationId: { type: Number, required: true }, // This is the ID that exists in SQLite
  fullCvText: String,
  aiFeedback: {
    strengths: [String],
    weaknesses: [String],
    recommendation: String,
  },
  rawAiResponse: Object, // To store the complete AI response for any future purpose
}, { timestamps: true });

const Analysis = models.Analysis || model("Analysis", AnalysisSchema);
export default Analysis;