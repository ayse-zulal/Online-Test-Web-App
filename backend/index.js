const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const cookieParser = require('cookie-parser');

const multer = require('multer');
const { storage } = require('./cloudinary');

require('dotenv').config();
app.use(cookieParser()); 

app.use(cors({
  origin: "http://localhost:3000", // frontend adresin
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/tests", require("./routes/tests"));
app.use("/api/answers", require("./routes/answers"));
app.use("/api/submissions", require("./routes/submissions"));
app.use("/api/questions", require("./routes/questions"));
app.use("/api/auth", require("./routes/auth"));

const upload = multer({ storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
  res.json({ url: req.file.path });
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});