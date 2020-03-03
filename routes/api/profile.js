const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile')
const { check, validationResult} = require('express-validator');
const normalize = require('normalize-url');



// @route GET api/profile/me
// @dex   Get current users profile
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user : req.user.id }).populate('user', ['name', 'avatar']);
        
        if(!profile) {
            return res.status(400).json({msg: 'There is no profile for this user' });
        }

        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
        
    }

})


// @route POST api/profile
// @dex   Create or update user profile
// @access Private

router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors : errors.array()});
    }

    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        twitter,
        instagram,
        linkedin
      } = req.body;


      const profileFields = {
        user: req.user.id,
        company,
        location,
        website: website === '' ? '' : normalize(website, { forceHttps: true }),
        bio,
        skills: Array.isArray(skills)
          ? skills
          : skills.split(',').map(skill => ' ' + skill.trim()),
        status,
        githubusername
      };

          // Build social object and add to profileFields
    const socialfields = { twitter, instagram, linkedin };

    for (const [key, value] of Object.entries(socialfields)) {
      if (value)
        socialfields[key] = normalize(value, { forceHttps: true });
    }
    profileFields.social = socialfields;

    try {
        // Using upsert option (creates new doc if no match is found):
        let profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true, upsert: true }
        );
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }

})


// @route GET api/profile
// @dex   Get all profiles
// @access Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
})


// @route GET api/profile/user/:user_id
// @dex   Get profile by user ID
// @access Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user : req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile) return res.status(400).json({msg : 'Profile Not Found'});
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            if(!profile) return res.status(400).json({msg : 'Profile Not Found'});
        }
        res.status(500).send('Server Error');
        
    }
})


// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
    try {
      // Remove user posts
      
      // Remove profile
      await Profile.findOneAndRemove({ user: req.user.id });
      // Remove user
      await User.findOneAndRemove({ _id: req.user.id });
  
      res.json({ msg: 'User deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


module.exports = router;