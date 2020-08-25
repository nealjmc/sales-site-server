const express = require('express')
const router = express.Router()
const db = require('monk')(process.env.MONGO_URI)
const Joi = require('@hapi/joi')

const customers = db.get('customers')

const newCustomerSchema = new Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),

  birthday: Joi.date(),
  email: Joi.string().email().required(),
  phone: Joi.number(),

  address: Joi.string(),
  postal: Joi.string(),
  province: Joi.string(),
  gender: Joi.string(),
})

// Read all
router.get('/', async (req, res, next) => {
  try {
    const items = await customers.find({})
    res.json(items)
  } catch (error) {
    next(error)
  }
})

// Read one
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const item = await customers.findOne({
      _id: id,
    })
    if (!item) return next()

    // return item
    return res.json(item)
  } catch (error) {
    next(error)
  }
})

// create one
router.post('/', async (req, res, next) => {
  try {
    const value = await newCustomerSchema.validateAsync(req.body)
    const inserted = await customers.insert(value)
    res.json(inserted)
  } catch (error) {
    next(error)
  }
})

// Update one
router.put('/:id', async (req, res, next) => {
  try {
    // Look for it, and see if the item exists
    const { id } = req.params
    const item = await customers.findOne({
      _id: id,
    })
    if (!item) return next()

    const value = await newCustomerSchema.validateAsync(req.body)
    const updated = await customers.update({ _id: id }, { $set: value })
    res.json(value)
  } catch (error) {
    next(error)
  }
})

// Delete one
router.delete('/:id', async (req, res, next) => {
  try {
    // Look for it, and see if the item exists
    const { id } = req.params
    const item = await customers.findOne({
      _id: id,
    })
    if (!item) return next()

    const deleted = await customers.remove({ _id: id })
    res.status(200)
  } catch (error) {
    next(error)
  }
})

module.exports = router
