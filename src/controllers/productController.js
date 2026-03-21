const { Product } = require("../models/Product.js");

const productController = {
    createProduct: async (req, res) => {
        try {
            const product = await Product.create(req.body);
            return res.status(201).json(product);
        } catch (error) {
            console.log(error);
            return res.status(501).send({message: "There was a problem trying to create the product"});
        }
    },
    getProducts: async (req, res) => {
        try {
            const products = await Product.find();
            res.status(201).json(products);
        } catch (error) {
            console.log(error);
            res.status(501).send({message: "There was a problem trying to get all products"});
        }
    },
    getProductById: async (req, res) => {
        const id = req.params.id;
        try {
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).send({message: "There is no product with that id"});
            }
            return res.status(201).send(product);
        } catch (error) {
            console.log(error);
            return res.status(501).send({message: "There was a problem trying to get the product"});
        }
    },
    updateProduct: async (req, res) => {
        const id = req.params.id;
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
            });

            if (!updatedProduct) {
                return res.status(404).send({message: "There is no product with that id"});
            }

            return res.status(200).json(updatedProduct);
        } catch (error) {
            console.log(error);
            return res.status(501).send({message: "There was a problem trying to update the product"});
        }
    },
    deleteProduct: async (req, res) => {
        const id = req.params.id;
        try {
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).send({message: "There is no product with that id"});
            }
            const deleteCount = await Product.deleteOne({_id: id});
            return res.status(200).send({message: "Product successfully deleted", deleteCount: deleteCount});
        } catch (error) {
            console.log(error);
            return res.status(501).send({message: "There was a problem trying to delete the product"});
        }
    },
};

module.exports = productController;