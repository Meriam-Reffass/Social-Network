const express=require('express');
const {check, validationResult}=require('express-validator');
const auth = require('../../middleware/auth')
const router = require('express').Router(); 
router.post('/',[auth, [check('text', 'Text is requuired').not().isEmpty()
]], async (req,res)=>{
    
});
module.exports=router;