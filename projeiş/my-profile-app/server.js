const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

// Modeli dahil etme
const User = require('./models/User');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads'));

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/my-profile-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB bağlantı hatası:'));
db.once('open', function() {
    console.log('MongoDB bağlantısı başarıyla kuruldu.');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
  }
});
const upload = multer({ storage: storage });

// Static files
app.use(express.static('public'));

// Routes

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/profile', upload.single('profilePicture'), (req, res) => {
    const userData = {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      birthdate: req.body.birthdate,
      profilePicture: req.file ? `/uploads/${req.file.filename}` : '',
      linkedin: req.body.linkedin,
      twitter: req.body.twitter,
      github: req.body.github
    }
    const user = new User(userData);
    user.save()
        .then(savedUser => {
            res.json({ message: 'Profil başarıyla kaydedildi', data: savedUser });
        })
        .catch(error => {
            console.error('Profil kaydı sırasında hata oluştu:', error);
            res.status(500).json({ error: 'Profil kaydedilemedi' });
        });
});

app.get('/profiles', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/profile', (req, res) => {
    const { email } = req.body;
    User.findOneAndDelete({ email: email })
        .then(deletedUser => {
            if (deletedUser) {
                res.json({ message: 'Profil başarıyla silindi', data: deletedUser });
            } else {
                res.status(404).json({ error: 'Silinecek profil bulunamadı' });
            }
        })
        .catch(err => {
            console.error('Profil silinirken bir hata oluştu:', err);
            res.status(500).json({ error: 'Profil silinemedi' });
        });
});


app.put('/profile', async (req, res) => {
    const { email, username, phone, birthdate, linkedin, twitter, github } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { $set: { username, phone, birthdate, linkedin, twitter, github } },
            { new: true }
        );
        if (updatedUser) {
            res.json({ message: 'Profil başarıyla güncellendi', data: updatedUser });
        } else {
            res.status(404).json({ error: 'Güncellenecek profil bulunamadı' });
        }
    } catch (err) {
        console.error('Profil güncellenirken bir hata oluştu:', err);
        res.status(500).json({ error: 'Profil güncellenemedi' });
    }
});


app.listen(3001, () => {
    console.log('Sunucu port 3001 üzerinde çalışıyor');
});
