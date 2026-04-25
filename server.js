
const mongoose  = require ('mongoose')
const { MONGODB_URI, PORT } = require ('./utils/config.js')

const { server } = require("./app");

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB')



//server start
server.listen((PORT), () => {
    console.log(`Server is Connected on the Port ${PORT}`)
});

})



.catch((error) => {
    console.log("Error Connecting to the MongoDB");
    console.log(error.message);
})

// start cron jobs
require('./jobs/cron');

