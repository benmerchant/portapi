// router.js
const express = require('express');
const BlogController = require('./controllers/blogpost.controller');
module.exports = app => {
  // route groups
  const apiRoutes = express.Router();
  const blogPostRoutes = express.Router();
  // middleware for apiRoutes
  apiRoutes.use('/blogPosts', blogPostRoutes);
  //// Blog Post Routes //////////////
  // POST a new blog post
  blogPostRoutes.post('/', BlogController.publishPost);
  // url for all API routes
  app.use('/api', apiRoutes);
};
