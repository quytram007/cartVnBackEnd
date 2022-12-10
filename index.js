require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const verifyAction = require('./routes/verifyAction');
const cartRoutes = require('./routes/cart') ;


// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/verify", verifyAction);
app.use("/api/cart", cartRoutes);

const port = process.env.PORT || 8000;
app.listen(port, console.log(`Listening on port ${port}...`));
