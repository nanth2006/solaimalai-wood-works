import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  image: { type: String },
  category: { type: String },
  material: { type: String },
});

const workingProcessStageEnum = [
  "Advance_Received",        // 1. Advance Paid & Verified
  "Timber_Selection",       // 2. Timber Selection & Seasoning
  "Carpentry_Joinery",      // 3. Handcrafted Carpentry & Joinery
  "Hand_Carving",           // 4. Detailed Carving & Sculpting
  "Polishing_Finishing",    // 5. Wood Staining & Protective Finishing
  "Quality_Inspection",     // 6. Final Assembly & Quality Check
  "Ready_Delivery",         // 7. Ready / Out for Delivery
  "Delivered"               // 8. Completed & Delivered
];

const stageHistorySchema = new mongoose.Schema({
  stage: { type: String, required: true },
  label: { type: String, required: true },
  note: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      pincode: { type: String },
      notes: { type: String },
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    advancePaid: {
      type: Number,
      required: true,
    },
    balanceAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "UPI_GPAY",
    },
    upiRefNo: {
      type: String,
      required: true,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Advance_Pending", "Advance_Verified", "Fully_Paid"],
      default: "Advance_Pending",
    },
    workingProcess: {
      currentStage: {
        type: String,
        enum: workingProcessStageEnum,
        default: "Advance_Received",
      },
      currentStageLabel: {
        type: String,
        default: "Advance Paid & Order Placed",
      },
      progressPercent: {
        type: Number,
        default: 15,
        min: 0,
        max: 100,
      },
      workshopNotes: {
        type: String,
        default: "Order registered. Timber log allocation in progress.",
      },
      estimatedDeliveryDate: {
        type: String,
      },
      stageHistory: [stageHistorySchema],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
