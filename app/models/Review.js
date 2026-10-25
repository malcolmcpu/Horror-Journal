const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    year: { type: Number, min: 1900, max: new Date().getFullYear() },
    posterUrl: { type: String, trim: true },
    subgenre: {
      type: String,
      required: true,
      enum: [
        'slasher',
        'supernatural',
        'found-footage',
        'psychological',
        'zombie',
        'creature-feature',
        'gore',
        'other',
      ],
    },
    scareFactor: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, maxlength: 600, trim: true },
    watchedOn: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Review', reviewSchema);
