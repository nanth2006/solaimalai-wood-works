import Product from "../models/product.js";

// Initial seed data
export const defaultProducts = [
  {
    name: "Royal Teakwood Dining Chair",
    category: "Chairs",
    price: 25000,
    material: "First Grade Solid Teak",
    image: "https://i.etsystatic.com/38749849/r/il/75f2f9/6031313505/il_fullxfull.6031313505_brtd.jpg",
    tag: "Bestseller",
    description: "Ergonomic high-back solid teak dining chair with hand-rubbed oil finish.",
  },
  {
    name: "Luxury Solid Wood Sofa Set",
    category: "Sofas",
    price: 65000,
    material: "Seasoned Teak + Cushioned Fabric",
    image: "https://i.pinimg.com/originals/6e/be/3b/6ebe3b679bb0ea7630a2db1f924da32b.jpg",
    tag: "Artisanal",
    description: "3+1+1 handcrafted teakwood living suite with premium high-density foam seating.",
  },
  {
    name: "Grand Traditional Teak Bero / Wardrobe",
    category: "Wardrobes",
    price: 48000,
    material: "100% Solid Teak with Brass Fittings",
    image: "https://5.imimg.com/data5/ANDROID/Default/2022/8/KX/WS/IE/76698605/product-jpeg-1000x1000.jpg",
    tag: "Heavy Duty",
    description: "Heavy-duty 3-door solid teak wardrobe with traditional lock mechanisms.",
  },
  {
    name: "Carved Teak Dressing Table with Mirror",
    category: "Tables",
    price: 28000,
    material: "Hand-Carved Teakwood Finish",
    image: "https://i.ytimg.com/vi/Ovni-EX7WlU/maxresdefault.jpg",
    tag: "Custom Made",
    description: "Classic dressing console with bevelled oval mirror and 4 velvet-lined drawers.",
  },
  {
    name: "Ornate Hand-Carved Entrance Door",
    category: "Doors",
    price: 42000,
    material: "Pure Teakwood Traditional Carving",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    tag: "Temple & Home",
    description: "Heavy solid teakwood entrance door featuring traditional Tamil Nadu floral motifs.",
  },
  {
    name: "Handcrafted Teak Center Coffee Table",
    category: "Tables",
    price: 18500,
    material: "Natural Wood Grain Polish",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    tag: "Modern Heritage",
    description: "Minimalist solid teak coffee table with natural grain luster and brass feet.",
  },
];

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    let products = await Product.find(query).sort({ createdAt: -1 });

    // If database has 0 products, seed defaults automatically
    if (products.length === 0 && (!category || category === "All") && !search) {
      await Product.insertMany(defaultProducts);
      products = await Product.find().sort({ createdAt: -1 });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error("Error getting products:", err);
    res.status(500).json({ message: "Failed to fetch products: " + err.message });
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE PRODUCT (Admin only)
export const createProduct = async (req, res) => {
  const { name, price, category, image, material, tag, description } = req.body;

  try {
    if (!name || !price || !image) {
      return res.status(400).json({ message: "Name, price, and image are required" });
    }

    const newProduct = await Product.create({
      name: name.trim(),
      price: Number(price),
      category: category || "Chairs",
      image: image.trim(),
      material: material || "100% Solid Teak Wood",
      tag: tag || "Handcrafted",
      description: description || "Handcrafted in solid teakwood.",
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Failed to create product: " + err.message });
  }
};

// UPDATE PRODUCT (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE PRODUCT (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};