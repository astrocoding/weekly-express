const db = require('../config/db');

const Post = {
    create: (title, content, imageUrl, callback) => {
        const sql = 'INSERT INTO posts (title, content, imageUrl) VALUES (?, ?, ?)';
        db.query(sql, [title, content, imageUrl], callback);
    },
    getAll: (callback) => {
        const sql = 'SELECT * FROM posts';
        db.query(sql, callback);
    },
    getById: (id, callback) => {
        const sql = 'SELECT * FROM posts WHERE id = ?';
        db.query(sql, [id], callback);
    },
    update: (id, title, content, imageUrl, callback) => {
        const sql = 'UPDATE posts SET title = ?, content = ?, imageUrl = ? WHERE id = ?';
        db.query(sql, [title, content, imageUrl, id], callback);
    },
    delete: (id, callback) => {
        const sql = 'DELETE FROM posts WHERE id = ?';
        db.query(sql, [id], callback);
    },
};

module.exports = Post;
