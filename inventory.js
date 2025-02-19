const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('mongoDB ga ulanish hosil qilindi');
    })
    .catch((err)=>{
        console.error('MongoDBga ulanishda xatolikka duch keldik',err)
    })
    const SizeSchema = mongoose.Schema({
        h : Number,
        w : Number,
        uom : String
    })

    const inventorySchema = mongoose.Schema({
        item : String,
        qty : String,
        size : SizeSchema,
        status : String        
    },{collection : 'inventory'})

    const Inventory = mongoose.model('Inventory',inventorySchema)

    async function getInventoryItems1(){
        return await Inventory
        .find( {status: 'A'} )
        .sort( {item: 1} )
        .select( {item:1, qty:1, _id:0} )
    }

    async function getInventoryItems2(){
        return await Inventory
        .find()
        .or( [ { qty: {$lte:50} }, {item: /.*l.*/i} ] )
        .sort( {qty:-1} )
    }
    async function run(){
        const items = await getInventoryItems2()
        console.log(items);
    }

    run()