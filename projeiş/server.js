const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Multer setup for profile picture upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Static files
app.use(express.static('public'));

// Routes
app.post('/api/profile', upload.single('profilePicture'), (req, res) => {
    const profileData = req.body;
    // Add profilePicture path if uploaded
    if (req.file) {
        profileData.profilePicture = req.file.path;
    }
    // Save profile data to the database (mocked here)
    console.log(profileData);
    res.json({ message: 'Profile updated successfully', data: profileData });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
