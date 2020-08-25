const express = require('express')
const router = express.Router()
const db = require('monk')(process.env.MONGO_URI)
const Joi = require('@hapi/joi')

const products = db.get('orders')

const ORDER_STATUS = {
  Cancelled: 0,
  Ordered: 1,
  Shipping: 2,
  Completed: 3,
}

const newOrderSchema = new Joi.object({
  idCustomer: Joi.string().required(),
  idProduct: Joi.string().required(),
  timestamp: Joi.number().required(),
  status: Joi.number().min(0).max(3).required(),
})

// Read all
router.get('/', async (req, res, next) => {
  try {
    const items = await products.find({})
    res.json(items)
  } catch (error) {
    next(error)
  }
})

// Read one
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const item = await products.findOne({
      _id: id,
    })
    if (!item) return next()

    // return item
    return res.json(item)
  } catch (error) {
    next(error)
  }
})

// Create one
router.post('/', async (req, res, next) => {
  try {
    const value = await newOrderSchema.validateAsync(req.body)
    const inserted = await products.insert(value)
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
    const item = await products.findOne({
      _id: id,
    })
    if (!item) return next()

    const value = await newOrderSchema.validateAsync(req.body)
    const updated = await products.update({ _id: id }, { $set: value })
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
    const item = await products.findOne({
      _id: id,
    })
    if (!item) return next()

    const deleted = await products.remove({ _id: id })
    res.status(200)
  } catch (error) {
    next(error)
  }
})

module.exports = router
