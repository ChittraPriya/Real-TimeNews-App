const express = require('express')
const { isAuthenticated } = require('../middleware/auth');
const { createPreference, getMyPreference, updatePreference, deletePreference, deleteCategory } = require('../controller/preferenceController');

const preferenceRouter = express.Router()

preferenceRouter.post('/add',isAuthenticated, createPreference )
preferenceRouter.get('/',isAuthenticated, getMyPreference)
preferenceRouter.put('/',isAuthenticated, updatePreference)
preferenceRouter.delete('/',isAuthenticated, deletePreference)
preferenceRouter.delete('/category', isAuthenticated, deleteCategory);

module.exports = preferenceRouter