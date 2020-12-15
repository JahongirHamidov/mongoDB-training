const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('mongoDB ga ulanish hosil qilindi');
    })
    .catch((err)=>{
        console.error('MongoDB ga ulanishda xatoga duch keldik', err);
    })

    const bookSchema = new mongoose.Schema({
        name: {
            type: String, 
            required: true,
            minLength:3,
            maxlength:100
        },
        author: String,
        tags: {
            type: Array,
            validate:{
                isAsync: true,
                validator: function(val,callback){
                // return val && val.length>0
                setTimeout(() => {
                    const result = val && val.length>0
                    callback(result)
                }, 5000);
                },
                message: 'tag 0 ga teng'
            }
        },
        date: { type: Date, default: Date.now  },
        isPublished: Boolean,
        price: {
            type: Number,
            required: function(){ return this.isPublished},
            min: 10,
            max: 10000,
        },
        category: {
            type: String,
            required: true,
            enum: ['classic', 'biography', 'science']
        }
    })

    const Book = mongoose.model("Book", bookSchema)

async function createBook(){
    const book = new Book({
        name: "JavaScript darslari",
        author: "Farhod Dadajonov",
        tags: ["js", 'web dasturlash'],
        isPublished: true,
        price: 500,
        category: 'classic'
        
    })

    try{
        //await book.validate()
    const savedBook = await book.save()
    console.log(savedBook)
    }
    catch(ex){
        console.log(ex);
    }    
}

async function getBooks(){
    const pageNumber = 3
    const pageSize = 10

    const books = await Book
    .find({author: "Farhod Dadajonov"})
    .skip((pageNumber-1)*pageSize)
    .limit(pageSize)
    .sort({name: 1})
    .select({name: 1, tags: 1, })
    console.log(books);
}
async function updateBook(id){
    const book = await Book.findById(id)
    if(book){
        book.set({
            isPublished: true,
            author: 'Farkhod'
        })
        const updatedBook = await book.save()
        console.log(updatedBook);
    } 
    else return
}

async function updateBook2(id){
    const result = await Book.update({ _id:id }, {
        $set:{
            author: 'Farhod',
            isPublished: false
        }
    }) 
     console.log(result);
}

async function deleteBook(id){
    const result = await Book.deleteOne({_id:id})   //findByIdAndRemove  && findByIdAndDelete
}

createBook()
//deleteBook('5f607829fdcd44b26bd81e68')
