const Post = require('../models/Post');
const bucket = require('../config/googleCloud');

const createPost = (req, res) => {
    const { title, content } = req.body;
    const imageUrl = req.file ? `https://storage.googleapis.com/${bucket.name}/${req.file.filename}` : null;

    Post.create(title, content, imageUrl, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating post' });
        res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
    });
};

const getAllPosts = (req, res) => {
    Post.getAll((err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching posts' });
        res.status(200).json(results);
    });
};

const getPostById = (req, res) => {
    const { id } = req.params;
    Post.getById(id, (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(results[0]);
    });
};

const updatePost = (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const imageUrl = req.file ? `https://storage.googleapis.com/${bucket.name}/${req.file.filename}` : null;

    Post.update(id, title, content, imageUrl, (err) => {
        if (err) return res.status(500).json({ message: 'Error updating post' });
        res.status(200).json({ message: 'Post updated successfully' });
    });
};

const deletePost = (req, res) => {
    const { id } = req.params;
    Post.delete(id, (err) => {
        if (err) return res.status(500).json({ message: 'Error deleting post' });
        res.status(200).json({ message: 'Post deleted successfully' });
    });
};

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost };
