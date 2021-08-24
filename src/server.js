const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const csv = require('csvtojson');
const Branches = require('./models/branches');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

csv({
    ignoreEmpty: true,
    trim: true
})
    .fromFile("./src/BeetleNut.csv")
    .then((csvData) => {
        for (let i = 0; i < csvData.length; i++) {
            csvData[i].ContactNumber = csvData[i].contactNumber.split(' ');
            csvData[i].PincodeCovered = csvData[i].pincodeCovered.split(' ');
            delete csvData[i].contactNumber;
            delete csvData[i].pincodeCovered;
        }

        Branches.insertMany(csvData, (error, data) => {
            if (error) {
                console.log(error);
            }

            if (data) {
                console.log("Spreadsheet Data Inserted.");
            }
        });
    });

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => console.log('Database connected.'))
    .catch((error) => console.log('DB Connection Error', error));


app.use(express.json());
app.use(cors());

// readdirSync('./src/routes').map((file) => app.use('/api', require('./routes/' + file)));

app.listen(port, () => console.log(`Listening on localhost:${port}`));