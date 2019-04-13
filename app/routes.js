module.exports = function(app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    db.collection('orders').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('index.ejs', {
        orders: result
      })
    })
  });

  // PROFILE SECTION =========================
  app.get('/orders', isLoggedIn, function(req, res) {
    db.collection('orders').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('orders.ejs', {
        user : req.user,
        orders: result
      })
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================
  //cashier posts into db order info
  app.post('/orders', (req, res) => {
    db.collection('orders').save({order: req.body.order, custName: req.body.custName, barista: null, complete: false}, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/')
    })
  })
  //updates status of order selected and barista name
  app.put('/orders', (req, res) => {
    db.collection('orders')
    .findOneAndUpdate({order: req.body.order, custName: req.body.custName}, {
      $set: {
        barista: req.body.barista,
        complete: true
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })

  //targets order and deletes
  app.delete('/orders', (req, res) => {
    db.collection('orders').findOneAndDelete({order: req.body.order, custName: req.body.custName}, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  //use a stratagey login authentican
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/orders', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/orders', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/orders');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
  return next();

  res.redirect('/');
}
