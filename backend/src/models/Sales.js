import mongoose from 'mongoose';

const salesSchema = new mongoose.Schema(
  {
    transactionId: {
      type: Number,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    customerRegion: {
      type: String,
      required: true,
    },
    customerType: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    productCategory: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    quantity: {
      type: Number,
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    deliveryType: {
      type: String,
      required: true,
    },
    storeId: {
      type: String,
      required: true,
    },
    storeLocation: {
      type: String,
      required: true,
    },
    salespersonId: {
      type: String,
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
salesSchema.index({ customerName: 'text', phoneNumber: 'text' });
salesSchema.index({ date: -1 });
salesSchema.index({ customerRegion: 1 });
salesSchema.index({ gender: 1 });
salesSchema.index({ productCategory: 1 });
salesSchema.index({ paymentMethod: 1 });

const Sales = mongoose.model('Sales', salesSchema);

export default Sales;
