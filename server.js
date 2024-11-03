const express = require("express");
const path = require("path"); // Import path module
const bcrypt = require("bcrypt");
const router = require("./routers/router.js");


const app = express();

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// To handle POST request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use('/css', express.static(path.join(__dirname, 'views', 'css')));
app.use('/js', express.static(path.join(__dirname, 'views', 'js')));
app.use('/images', express.static(path.join(__dirname, 'views', 'images')));

// Use the router for other routes
app.use(router);

app.listen(4000, () => {
  console.log("Server started on http://localhost:4000!");
});
