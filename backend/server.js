const express =require("express")
const mongoose =require("mongoose");
const cors =require("cors");
const dotenv =require("dotenv");
const nodemailer = require("nodemailer");

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

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'vinithbusipalli@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password' // Use App Password for Gmail
  }
});

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
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Save to DB
    const newMessage = new Contact({ name, email, subject, message });
    await newMessage.save();

    // Send email notification
    const mailOptions = {
      from: `Portfolio Contact <${process.env.EMAIL_USER || 'vinithbusipalli@gmail.com'}>`,
      to: 'vinithbusipalli@gmail.com',
      replyTo: email, // replies go to sender
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Sent from your portfolio contact form</em></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    res.status(200).json({ 
      success: true, 
      message: "Message sent successfully!" 
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send message. Please try again." 
    });
  }
});

// Run Server
const PORT =3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
