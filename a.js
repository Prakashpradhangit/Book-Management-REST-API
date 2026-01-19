const { log } = require('console');
const http = require('http')
const express = require('express');
const { readFileSync } = require('fs');

const app = express()

const os = require('os')
console.log(os.cpus().length);



// const port = 5000;

// app.get('/hello', (req, res)=>{
//     const data = readFileSync('./book.csv')
//     const data2 = data.toString();
//     res.end(data2.toJson())

    
//     res.end("hello Prakash")
// })
   

// app.listen(port,()=>{
//     console.log(`server running on ${port}`);
    
// })





    


