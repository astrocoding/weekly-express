const Post = require('../models/Post');
const bucket = require('../config/googleCloud');
const path = require('path');
const fs = require('fs');

const createPost = async (req, res) => {
    const { title, content } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
        return res.status(400).json({ message: 'Image file is required' });
    }

    const fileName = Date.now() + path.extname(imageFile.originalname);
    const filePath = path.join(__dirname, '../uploads/', imageFile.filename);

    try {
        await bucket.upload(imageFile.path, {
            destination: fileName,
            metadata: {
                contentType: imageFile.mimetype,
            },
        });

        // Hapus file dari server setelah diupload
        fs.unlinkSync(imageFile.path);

        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        // Simpan postingan ke database
        Post.create(title, content, imageUrl, (err, result) => {
            if (err) return res.status(500).json({ message: 'Error creating post' });
            res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
        });
    } catch (error) {
        console.error('Error uploading to GCS:', error);
        res.status(500).json({ message: 'Error uploading image to Google Cloud Storage' });
    }
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

const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const imageFile = req.file;

    let imageUrl = null;

    if (imageFile) {
        const fileName = Date.now() + path.extname(imageFile.originalname);

        try {
            await bucket.upload(imageFile.path, {
                destination: fileName,
                metadata: {
                    contentType: imageFile.mimetype,
                },
            });

            // Hapus file dari server setelah diupload
            fs.unlinkSync(imageFile.path);
            
            imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        } catch (error) {
            console.error('Error uploading to GCS:', error);
            return res.status(500).json({ message: 'Error uploading image to Google Cloud Storage' });
        }
    }

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
