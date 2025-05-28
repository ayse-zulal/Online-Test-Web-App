const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/tests", require("./routes/tests"));
app.use("/api/answers", require("./routes/answers"));
app.use("/api/submissions", require("./routes/submissions"));
app.use("/api/questions", require("./routes/questions"));

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});