const express =require("express")
const mongoose =require("mongoose");
const cors =require("cors");
const dotenv =require("dotenv");

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect MongoDB
mongoose
  .connect("mongodb+srv://vinithbusipalli:vinith12378.@cluster0.sf6qdv6.mongodb.net/portfolio")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Contact = mongoose.model("Contact", contactSchema);

// API Route
app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save to DB
    const newMessage = new Contact({ name, email, subject, message });
    await newMessage.save();

    res.status(200).json({ success: true, message: "Message saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Run Server
const PORT =5500;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
