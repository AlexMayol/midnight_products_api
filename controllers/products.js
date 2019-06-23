
const client = require('../database/db');


const getProducts = (request, response) => {
    let query = `SELECT * FROM products ORDER BY id ASC`;
    client.query(query, (error, results) => {
        if (error) {
            throw error
        }
        //get all colors for the products
        client.query('SELECT * FROM product_colors', (error2, results2) => {
            if (error) {
                throw error
            }
            let colors = results2.rows
            // console.log(colors);
            // console.log('the reuslts');
            // console.log(results.rows);
            for (let product of results.rows) {
                product.colors = []
                for (let color of colors) {
                    if (product.id == color.product)
                        product.colors.push(color.color)
                }
                if (product.colors.length == 0) delete product.colors
            }
            // console.log('tras procesar');

            // console.log(results.rows);
            response.status(200).json({ results: results.rows })
        })

    })
}

const getProduct = (request, response) => {
    let id = parseInt(request.params.id)
    client.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json({ info: results.rows })
    })
}

const createProduct = (request, response) => {
    console.log('the body')
    console.log(request.body)
    const { name, price, image, category, colors } = request.body.params
    const en_description = request.body.params.descriptions.en;
    const es_description = request.body.params.descriptions.es;
    const de_description = request.body.params.descriptions.de;


    client.query('INSERT INTO products (name, price, en_description, es_description, de_description, image, category) VALUES ($1, $2, $3, $4, $5, $6, $7)  RETURNING id',
        [name, price, en_description, es_description, de_description, image, category],
        (error, results) => {
            if (error) {
                throw error
            }
            console.log(results);

            for (let x in colors) {
                console.log('inserto color ' + colors[x])
                client.query('INSERT INTO product_colors (product, color) VALUES ($1, $2)  RETURNING id',
                    [results.rows[0].id, colors[x].id],
                    (err, res) => {
                        if (err) {
                            throw err
                        }
                    })
            }
            response.status(200).send({ success: true, id: results.rows[0].id, message: `Product added with ID:${results.rows[0].id}` })
        })
}

const updateProduct = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, price, image, category, colors } = request.body.params;
    const en_description = request.body.params.descriptions.en;
    const es_description = request.body.params.descriptions.es;
    const de_description = request.body.params.descriptions.de;


    client.query(
        'UPDATE products SET name = $1, price = $2, image = $3, category = $4, en_description = $5, es_description = $6,de_description = $7  WHERE id = $8 RETURNING id',
        [name, price, image, category, en_description, es_description, de_description, id],
        (error, results) => {
            if (error) {
                throw error
            }

            console.log(results);

            if (results.rows.length == 0) {
                response.status(100).send({ success: false, message: `Product  with ID: ${id} wasn't modified` })
                results;
            }
      
                client.query('DELETE FROM product_colors WHERE product = $1',
                    [id],
                    (err, res) => {
                        if (err) {
                            throw err
                        }
                    })
                for (let x in colors) {
                    console.log('inserto color ' + colors[x])
                    client.query('INSERT INTO product_colors (product, color) VALUES ($1, $2)  RETURNING id',
                        [results.rows[0].id, colors[x].id],
                        (err2, res2) => {
                            if (err2) {
                                throw err2
                            }
                        })
                }
            
            response.status(200).send({ success: true, message: `2Product modified with ID: ${id}` });
        }
    )
}

const deleteProduct = (request, response) => {
    const id = parseInt(request.params.id)
    client.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send({ success: true, message: `Color deleted with ID: ${id}` });
    })
}

const deleteProducts = (request, response) => {
    client.query('DELETE FROM products', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send({ success: true, message: `All categories deleted` });
    })
}


module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProducts
}