const express = require("express");
const router = new express.Router();
const Products= require("../models/productsSchema");
const USER= require("../models/userSchema");
const bcrypt = require("bcryptjs");
const athenticate= require("../middleware/authenticate");

//get productsdata api
router.get("/getproducts", async (req, res) => {
    try {
        const productsdata = await Products.find(); //we have to call this function POSTMAN 
        // console.log("ayush zindabad" + productsdata);

        res.status(201).json(productsdata);  //the request has succeeded and has led to the creation of a resource
    } catch (error) {
        console.log("error" + error.message);
    }
});

//get individual data
router.get("/getproductsone/:id",async(req,res)=>{
    try{
        const {id} = req.params;
        //console.log(id);
        const individualdata = await Products.findOne({id:id});

        //console.log(individualdata + "individual data" );
        res.status(201).json(individualdata);
    } catch(error){
        res.status(400).json(individualdata);
        console.log("error" + error.message);

    }
});


//register data

router.post("/register",async(req,res)=>{
// console.log(req.body);
    const { fname, email, mobile, password, cpassword } = req.body;

    if (!fname || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: "fill all details" });
        console.log("no data available ");
    };


try {

    const preuser = await USER.findOne({ email: email });

    if (preuser) {
        res.status(422).json({ error: "This USER already exist" });
    } else if (password !== cpassword) {
        res.status(422).json({ error: "Password & CPASSWORD are not matching" });;
    } else {

        const finalUser = new USER({
            fname, email, mobile, password, cpassword
        });

          //hashing algorithm bcryptjs for password hashing

        //   we do password hashing in user schema 





        const storedata = await finalUser.save();
        console.log(storedata + "user successfully added");
        res.status(201).json(storedata);
    }

} catch (error) {
    console.log("error during regsitration time"+ error.message);
        res.status(422).send(error);
}

});


//Login user api

router.post("/login",async(req,res)=>{
    const { email, password} = req.body;

    if(!email || !password){
        res.status(400).json({error:"fill all the data"})
    }

    try{
        const userlogin=await USER.findOne({email:email});
        console.log(userlogin+"user value");


       

        if(userlogin){
            const isMatch =await bcrypt.compare(password,userlogin.password);
            console.log(isMatch+"pass match");


             //token generate
        const token=await userlogin.generateAuthtoken();
        // console.log(token);


        
        //generate cookie
        res.cookie("Amazonweb",token,{
            expires:new Date(Date.now()+900000),  // cookie expires after 15 min.
            httpOnly:true
        })

            if(!isMatch){
                res.status(400).json({error:"invalid details"})
            }else{
                res.status(201).json(userlogin);
            }
        }else{
            res.status(400).json({error:"invalid login details"})
        }
    }catch(error){
         res.status(400).json({error:"invalid details"})
    }
})

//adding the data into cart

router.post("/addcart/:id",athenticate,async(req,res)=>{
    try{
        const {id} =req.params;
        const cart= await Products.findOne({id:id});
        console.log(cart + "cart value");
    
        const UserContact = await USER.findOne( {_id:req.userID});
        console.log(UserContact);
    
        if(UserContact){
            const cartData= await UserContact.addcartdata(cart);
            await UserContact.save();
            console.log(cartData);
            res.status(201).json(UserContact);
        }else{
            res.status(401).json({error:"invalid user"});
        }
    
    }catch(error){
        res.status(401).json({error:"invalid user"});
    
    }
    });



    //get cart details
    router.get("/cartdetails",athenticate,async(req,res)=>{
        try{
           const buyuser = await USER.findOne({_id:req.userID});
           res.status(201).json(buyuser);
        } catch(error){
            console.log("error" + error)
        }
    })



    //get valid user
    router.get("/validuser",athenticate,async(req,res)=>{
        try{
           const validuserone = await USER.findOne({_id:req.userID});
           res.status(201).json(validuserone);
        } catch(error){
            console.log("error" + error)
        }
    })


    //remove item from cart

    router.delete("/remove/:id",athenticate,async(req,res)=>{
        try{
            const {id} =req.params;

            req.rootUser.carts=req.rootUser.carts.filter((cruval)=>{
                return cruval.id != id;
            });

            req.rootUser.save();
            res.status(201).json(req.rootUser);
            console.log("item remove");

        } catch (error){
            console.log("error"+ error);
            res.status(400).json(req.rootUser);

        }
    })



    //for user logout we remove cookie

    router.get("/lougout",athenticate,(req,res)=>{
        try{
            req.rootUser.tokens = req.rootUser.tokens.filter((curelem)=>{
                return curelem.token !== req.token
            });

            res.clearCookie("Amazonweb",{path:"/"});

            req.rootUser.save();
            res.status(201).json(req.rootUser.tokens);
            console.log("user logged out");
        }catch(error){
            console.log("error in user logout");

        }
    })
module.exports=router;