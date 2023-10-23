const mongoose=require("mongoose");

//A Mongoose schema defines the document's properties, default values, types of data, validators, etc

const productsSchema= new mongoose.Schema({
    id:String,
    url:String,
    detailUrl:String,
    title:Object,
    price:Object,
    description:String,
    discount:String,
    tagline:String
});

//a Mongoose model provides an interface for the database to create, query, update, delete records, and so on.

const Products = new mongoose.model("products",productsSchema); //collection name, schema name

module.exports = Products;