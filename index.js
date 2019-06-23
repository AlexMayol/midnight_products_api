
// https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express'),  swaggerDocument = require('./swagger.json');
const app = express()
const port = process.env.PORT || 4000

const ColorController = require('./controllers/colors');
const CategoryController = require('./controllers/categories');
const ProductController = require('./controllers/products');


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
    )
app.use(cors())

// colors
app.get('/colors', ColorController.getColors)
app.get('/color/:id', ColorController.getColor)
app.post('/colors', ColorController.createColor)
app.put('/color/:id', ColorController.updateColor)
app.delete('/color/:id', ColorController.deleteColor)
app.delete('/colors', ColorController.deleteColors)

// categories
app.get('/categories', CategoryController.getCategories)
app.get('/category/:id', CategoryController.getCategory)
app.post('/categories', CategoryController.createCategory)
app.put('/category/:id', CategoryController.updateCategory)
app.delete('/category/:id', CategoryController.deleteCategory)
app.delete('/categories', CategoryController.deleteCategories)

// products
app.get('/products', ProductController.getProducts)
app.get('/producty/:id', ProductController.getProduct)
app.post('/products', ProductController.createProduct)
app.put('/product/:id', ProductController.updateProduct)
app.delete('/product/:id', ProductController.deleteProduct)
app.delete('/products', ProductController.deleteProducts)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
