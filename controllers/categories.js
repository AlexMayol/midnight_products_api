
const client = require('../database/db');



const getCategories = (request, response) => {
    client.query('SELECT * FROM categories ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json({ results: results.rows })
    })
}


const getCategory = (request, response) => {
    let id = parseInt(request.params.id)
    client.query('SELECT * FROM categories WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json({ results: results.rows })
    })
}

const createCategory = (request, response) => {    
    console.log(request.body)
    const { name, description, image } = request.body.params

    client.query('INSERT INTO categories (name, description, image) VALUES ($1, $2, $3) RETURNING id', [name, description, image], (error, results) => {
        if (error) {
            throw error
        }
        
        console.log(results)
        response.status(201).send({ success: true, id: results.rows[0].id, message: `Category added with ID: ${results.rows[0].id}` })
    })
}

const updateCategory = (request, response) => {
    const id = parseInt(request.params.id)    
    const { name, description, image } = request.body

    client.query(
        'UPDATE categories SET name = $1, description = $2, image = $3  WHERE id = $4',
        [name, description, image, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send({ success: true, message: `Category modified with ID: ${id}` })
        }
    )
}

const deleteCategory = (request, response) => {
    const id = parseInt(request.params.id)
    client.query('DELETE FROM categories WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send({ success: true, message: `Category deleted with ID: ${id}` })
    })
}

const deleteCategories = (request, response) => {
    client.query('DELETE FROM categories', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send({ success: true, message: `All categories deleted` })
    })
}


module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    deleteCategories
}