const router = require('express').Router();
const { Post, Comment, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          // attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User
        }, 
        {
          model: Comment, 
          include: [{
            model: User,
          }]
        }
      ],
    });

    const post = postData.get({ plain: true });
  ;

    res.render('post', {
      post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try{
    const data = await Post.findAll({
      where: {
        user_id: req.session.user_id
      },
    });
  
    const posts = data.map((post) => post.get({ plain: true }));
  
    res.render('dashboard', {
      dashboard: true,
      posts,
      logged_in: req.session.logged_in,
    });
  }
  catch(err) {
  res.status(500).json(err);
  }
  
  });

  router.get('/new', withAuth, async (req, res) => {
    try {
    
  
      res.render('new', {
       
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  
  router.get('/login', (req, res) => {
    if (req.session.logged_in) {
      res.redirect('/');
      return;
    }
  
    res.render('login');
  }); 
  
  // router.get('/post/:id', async (req, res) => {
  //   try {
    
  
  //     console.log(commentData);
  //     const comment = commentData.get({ plain: true });
  
  //     res.render('post', {
  //       ...comment,
  //       logged_in: req.session.logged_in
  //     });
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // });
  
  
  router.get('/edit/:id', async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id);
  
      console.log(postData);
      const post = postData.get({ plain: true });
  
      res.render('editpost', {
        post,
        logged_in: req.session.logged_in
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;
