const express = require("express");
const config = require("config");
const router = require("express").Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required").not().isEmpty(),
      check("skills", "skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json();
      }
      profile=new Profile(profileFields);
      await profile.save();
      res.json(profile);
    
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server errors");
    }
  }
);
router.get('/', async (req,res)=>{
  try {
    const profiles = await Profile.find().populate('user', ['name','avatar'])
    res.json(profiles)
  } catch (error) {
    console.error(error.message);
    res.status(400).send('Server error')
  }
});
router.get('/user/user_id', async (req,res)=>{
  try {
    const profiles = await Profile.findOne({user: req.params.user._id}).populate('user', ['name','avatar'])
    if(!profile) return res.status(400).json({msg:'There is no profile for this user'});
    res.json(profiles)
  } catch (error) {
    console.error(error.message);
    res.status(400).send('Server error')
  }
})
module.exports = router;
