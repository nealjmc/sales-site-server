const express = require('express')
const emojis = require('./emojis')
const router = express.Router()

// imported Apis
const products = require('./products')
const orders = require('./orders')
const customers = require('./customers')

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  })
})

router.use('/emojis', emojis)
router.use('/products', products)
router.use('/orders', orders)
router.use('/customers', customers)

module.exports = router
