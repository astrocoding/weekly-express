const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

    // Untuk logout kita hanya perlu menghapus token dari sisi klien
    // Jika menggunakan JWT, tidak perlu melakukan apa-apa di server
    // Jadi cukup beri tahu sisi klien untuk menghapus token

module.exports = router;
