import Order from "../models/order.js";

// Stage definitions & labels helper
export const STAGE_LABELS = {
  Advance_Received: { label: "Advance Paid & Order Placed", defaultPercent: 15 },
  Timber_Selection: { label: "Matured Teak Selection & Seasoning", defaultPercent: 30 },
  Carpentry_Joinery: { label: "Handcrafted Carpentry & Frame Joinery", defaultPercent: 50 },
  Hand_Carving: { label: "Traditional Hand-Carving & Artistry", defaultPercent: 70 },
  Polishing_Finishing: { label: "Hand Sanding & Natural Teak Polish", defaultPercent: 85 },
  Quality_Inspection: { label: "Final Quality Check & Brass Fitting", defaultPercent: 95 },
  Ready_Delivery: { label: "Ready for Delivery & Dispatched", defaultPercent: 100 },
  Delivered: { label: "Delivered & Installed at Customer Home", defaultPercent: 100 },
};

// CREATE NEW ORDER (Customer checkout with advance)
export const createOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount, advancePaid, upiRefNo } = req.body;

    if (!customer?.name || !customer?.phone || !customer?.address) {
      return res.status(400).json({ message: "Customer name, phone, and address are required" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty, cannot create order" });
    }

    if (!upiRefNo || upiRefNo.trim().length < 4) {
      return res.status(400).json({
        message: "Advance UPI Payment Reference / UTR Number is required to confirm booking ❌",
      });
    }

    const total = Number(totalAmount);
    const advance = Number(advancePaid);
    const balance = total - advance;

    // Generate unique order ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `SWW-${randomSuffix}`;

    const initialStage = "Advance_Received";
    const initialLabel = STAGE_LABELS[initialStage].label;

    const newOrder = new Order({
      orderId,
      user: req.user ? req.user._id : null,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        pincode: customer.pincode || "",
        notes: customer.notes || "",
      },
      items,
      totalAmount: total,
      advancePaid: advance,
      balanceAmount: balance,
      paymentMethod: "UPI_GPAY",
      upiRefNo: upiRefNo.trim(),
      paymentStatus: "Advance_Pending",
      workingProcess: {
        currentStage: initialStage,
        currentStageLabel: initialLabel,
        progressPercent: STAGE_LABELS[initialStage].defaultPercent,
        workshopNotes: "Order registered. Workshop carpenter will verify UPI advance & start wood cutting.",
        stageHistory: [
          {
            stage: initialStage,
            label: initialLabel,
            note: `Advance payment of ₹${advance.toLocaleString()} registered via UPI (Ref: ${upiRefNo.trim()}).`,
            updatedAt: new Date(),
          },
        ],
      },
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully! Advance payment registered ✅",
      order: newOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to place order: " + error.message });
  }
};

// GET MY ORDERS (Logged-in customer)
export const getMyOrders = async (req, res) => {
  try {
    const query = req.user ? { user: req.user._id } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders: " + error.message });
  }
};

// TRACK ORDER (Public lookup by Order ID or Phone number)
export const trackOrder = async (req, res) => {
  try {
    const { identifier } = req.params;
    const query = identifier.startsWith("SWW-")
      ? { orderId: identifier.toUpperCase().trim() }
      : { "customer.phone": identifier.trim() };

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        message: "No order found matching this Order ID or Phone Number ❌",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Order tracking error: " + error.message });
  }
};

// GET ALL ORDERS (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get all orders: " + error.message });
  }
};

// UPDATE WORKING PROCESS STAGE (Admin only)
export const updateWorkingProcess = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, progressPercent, workshopNotes, estimatedDeliveryDate, paymentStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found ❌" });
    }

    const stageConfig = STAGE_LABELS[stage] || {
      label: stage,
      defaultPercent: progressPercent || order.workingProcess.progressPercent,
    };

    const newLabel = stageConfig.label;
    const finalPercent =
      typeof progressPercent === "number"
        ? progressPercent
        : stageConfig.defaultPercent;

    order.workingProcess.currentStage = stage;
    order.workingProcess.currentStageLabel = newLabel;
    order.workingProcess.progressPercent = finalPercent;

    if (workshopNotes) {
      order.workingProcess.workshopNotes = workshopNotes;
    }

    if (estimatedDeliveryDate) {
      order.workingProcess.estimatedDeliveryDate = estimatedDeliveryDate;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    // Add to history log
    order.workingProcess.stageHistory.push({
      stage,
      label: newLabel,
      note: workshopNotes || `Working stage updated to ${newLabel}`,
      updatedAt: new Date(),
    });

    await order.save();

    res.status(200).json({
      message: `Working stage updated to "${newLabel}" (${finalPercent}%) ✅`,
      order,
    });
  } catch (error) {
    console.error("Update process error:", error);
    res.status(500).json({ message: "Failed to update working process: " + error.message });
  }
};

// DELETE ORDER (Admin only)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found ❌" });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order: " + error.message });
  }
};
