const Products =require ("./models/productsSchema");
const productsdata=require("./constant/productsdata");

//function to store product data on database


const DefaultData = async()=>{
    try {
        await Products.deleteMany({});  //method of mongoDB
        const storeData = await Products.insertMany(productsdata);
        console.log(storeData);
    } catch (error) {
        console.log("error" + error.message);
    }
};

module.exports = DefaultData;