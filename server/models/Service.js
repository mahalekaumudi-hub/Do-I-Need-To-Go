import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    keywords: [{
      type: String,
      trim: true,
    }],
    visitRequired: {
      type: String,
      enum: ['YES', 'NO', 'MAYBE'],
      default: 'MAYBE',
    },
    onlineAvailable: {
      type: Boolean,
      default: false,
    },
    documents: [{
      type: String,
      trim: true,
    }],
    procedure: [{
      type: String,
      trim: true,
    }],
    fees: {
      type: String,
      default: 'To be verified',
    },
    processingTime: {
      type: String,
      default: 'To be verified',
    },
    department: {
      type: String,
      default: 'To be verified',
    },
    officeLocation: {
      type: String,
      default: 'To be verified',
    },
    onlineApplicationUrl: {
      type: String,
      default: '',
    },
    conditions: [{
      type: String,
      trim: true,
    }],
    description: {
      type: String,
      default: 'To be verified',
    },
    lastVerified: {
      type: Date,
      default: null,
    },
    verificationSource: {
      type: String,
      default: 'Pending official college verification',
    },
    status: {
      type: String,
      enum: ['verified', 'sample', 'needs-review'],
      default: 'sample',
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;
