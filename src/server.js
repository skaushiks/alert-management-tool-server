const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const csv = require('csvtojson');
const bcrypt = require('bcrypt');
const Branches = require('./models/branches');
const Admins = require('./models/admins');
const Pusher = require('pusher');
const { readdirSync } = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

const pusher = new Pusher({
    appId: process.env.APPID,
    key: process.env.KEY,
    secret: process.env.SECRET,
    cluster: process.env.CLUSTER,
    useTLS: true
});

async function init() {
    try {
        let password = await bcrypt.hash('PasadenaAdmin@99', 10);

        const admin = await new Admins({
            username: 'Admin.Beetle',
            password
        }).save();

        if (admin) {
            console.log('Administrator Created Successfully.');
        }
    } catch (error) {
        console.log(error);
    }
}

csv({
    ignoreEmpty: true,
    trim: true
})
    .fromFile("./src/BeetleNut.csv")
    .then(async (csvData) => {
        for (let i = 0; i < csvData.length; i++) {
            csvData[i].ContactNumber = csvData[i].contactNumber.split(' ');  /* Array of contact numbers. */
            csvData[i].PincodeCovered = csvData[i].pincodeCovered.split(' ');  /* Array of pincodes. */

            csvData[i].username = csvData[i].BranchIncharge.split(' ')[1].concat('.Beetle');  /* username for branch_incharge. */
            let password = `PasadenaNut@${i}`  /* password for branch_incharge. */
            csvData[i].password = await bcrypt.hash(password, 10);

            delete csvData[i].contactNumber;
            delete csvData[i].pincodeCovered;
        }

        const totalBranches = await Branches.find({})
            .estimatedDocumentCount()
            .exec();

        if (totalBranches === 0) {
            Branches.insertMany(csvData, (error, data) => {
                if (error) {
                    console.log(error);
                }

                if (data) {
                    console.log("Spreadsheet Data Inserted.");
                }
            });

            init();
        }
    });

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => {
        console.log('Database connected.');

        const changeStream = mongoose.connection.collection('notifications').watch();

        changeStream.on('change', (change) => {
            console.log(change)

            if (change.operationType === 'insert') {
                pusher.trigger('notificationChannel', 'newNotification',
                    {
                        'change': change
                    }
                );
            } else if (change.operationType === 'update') {
                console.log("Update seen.");
            } else {
                console.log("Error triggering Pusher.");
            }
        });
    })
    .catch((error) => console.log('DB Connection Error', error));


app.use(express.json());
app.use(cors());

readdirSync('./src/routes').map((file) => app.use('/api', require('./routes/' + file)));

app.listen(port, () => console.log(`Listening on localhost:${port}`));