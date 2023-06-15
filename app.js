const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

mongoose.set('strictQuery', false);


mongoose.connect("mongodb+srv://prayag_SIHH:pp1234@cluster0.tuna9.mongodb.net/ng_prog3?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Failed to connect to MongoDB");
    console.error(error);
});


// Create a user schema
const usersSchema = new mongoose.Schema({
    username: String,
    userid: String,
    password: String,
    goal_set_date: String,
    j_goal_set_date: String,
    p_goal_set_date: String,
    meditation: [String],
    jogging: [String],
    puspups: [String],
    points: Number

    // Add other fields as needed
});

// Create a user model
const users = mongoose.model('users', usersSchema);



// POST request to handle user login
app.post('/login', async (req, res) => {
    const { userid, password } = req.query;

    try {
        const user = await users.findOne({ userid });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const currentDateObj = new Date();
        const year = currentDateObj.getFullYear();
        const month = String(currentDateObj.getMonth() + 1).padStart(2, '0');
        const day = String(currentDateObj.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;

        const startDate = user.goal_set_date;

        const startDateObj = new Date(startDate);

        const index1 = Math.floor((currentDateObj - startDateObj) / (24 * 60 * 60 * 1000));

        let index = index1;

        // console.log(startDateObj);
        // console.log(currentDateObj);
        // console.log(index);


        let m_check = 'no';

        if (user.meditation[index] == '1') {
            console.log('already exists');
            m_check = 'done';
        } else {
            console.log('not exists');
            m_check = 'undone';

        }

        const count = user.meditation.reduce((accumulator, currentValue) => {
            if (currentValue === '1') {
                return accumulator + 1;
            } else {
                return accumulator;
            }
        }, 0);

        const pp = index;

        const pp1 = m_check;




        //jogging

        const currentDateObj_j = new Date();
        const year_j = currentDateObj_j.getFullYear();
        const month_j = String(currentDateObj_j.getMonth() + 1).padStart(2, '0');
        const day_j = String(currentDateObj_j.getDate()).padStart(2, '0');
        const currentDate_j = `${year_j}-${month_j}-${day_j}`;

        const startDate_j = user.j_goal_set_date;

        const startDateObj_j = new Date(startDate_j);

        const index1_j = Math.floor((currentDateObj_j - startDateObj_j) / (24 * 60 * 60 * 1000));

        console.log(startDateObj_j);
        console.log(currentDateObj_j);

        let index_j = index1_j;

        let j_check = 'no';

        if (user.jogging[index_j] == '1') {
            console.log('already exists');
            j_check = 'done';
        } else {
            console.log('not exists');
            j_check = 'undone';

        }

        const count1 = user.jogging.reduce((accumulator, currentValue) => {
            if (currentValue === '1') {
                return accumulator + 1;
            } else {
                return accumulator;
            }
        }, 0);


        const pp_j = index_j;

        const pp1_j = j_check;


        // console.log('j_index : ' + pp_j);
        // console.log('j_check : ' + pp1_j);





        //pushups: 
        const currentDateObj_p = new Date();
        const year_p = currentDateObj_p.getFullYear();
        const month_p = String(currentDateObj_p.getMonth() + 1).padStart(2, '0');
        const day_p = String(currentDateObj_p.getDate()).padStart(2, '0');
        const currentDate_p = `${year_p}-${month_p}-${day_p}`;

        const startDate_p = user.p_goal_set_date;

        const startDateObj_p = new Date(startDate_p);

        const index1_p = Math.floor((currentDateObj_p - startDateObj_p) / (24 * 60 * 60 * 1000));

        console.log(startDateObj_p);
        console.log(currentDateObj_p);

        let index_p = index1_p;

        let p_check = 'no';

        if (user.puspups[index_p] == '1') {
            console.log('already exists');
            p_check = 'done';
        } else {
            console.log('not exists');
            p_check = 'undone';

        }

        const count2 = user.puspups.reduce((accumulator, currentValue) => {
            if (currentValue === '1') {
                return accumulator + 1;
            } else {
                return accumulator;
            }
        }, 0);


        const pp_p = index_p;

        const pp1_p = p_check;

        console.log('p_index : ' + pp_p);
        console.log('p_check : ' + pp1_p);


        user.meditation_count = count;
        user.meditation_check = pp1;
        user.meditation_current_date_index = pp;

        user.jogging_count = count1;
        user.jogging_check = pp1_j;
        user.jogging_current_date_index = pp_j;

        user.pushups_count = count2;
        user.pushups_check = pp1_p;
        user.pushups_current_date_index = pp_p;


        //learderboard
        const topUsers = await users.find({}).sort({ points: -1 }).limit(3);



        const responseUser = {
            _id: user._id,
            username: user.username,
            password: user.password,
            goal_set_date: user.goal_set_date,
            meditation: user.meditation,
            userid: user.userid,
            meditation_count: user.meditation_count,
            meditation_check: user.meditation_check,
            meditation_current_date_index: user.meditation_current_date_index,

            jogging: user.jogging,
            jogging_count: user.jogging_count,
            jogging_check: user.jogging_check,
            jogging_current_date_index: user.jogging_current_date_index,


            puspups: user.puspups,
            puspups: user.puspups_count,
            puspups_check: user.puspups_check,
            puspups_current_date_index: user.puspups_current_date_index,

            top_users: topUsers.map((user) => ({
                _id: user._id,
                username: user.username,
                points: user.points
            }))
        };

        res.json(responseUser);

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// POST request to handle user login
// app.post('/login', async (req, res) => {
//     const { userid, password } = req.query;
//     // const { userid, password } = req.body;


//     try {
//         // Find the user in the database
//         //const user = await User.findOne({ userid });
//         const user = await users.findOne({ userid });
//         // Check if the user exists
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Check if the password is correct
//         if (user.password !== password) {
//             return res.status(401).json({ error: 'Invalid password' });
//         }


//         const currentDateObj = new Date();
//         const year = currentDateObj.getFullYear();
//         const month = String(currentDateObj.getMonth() + 1).padStart(2, '0');
//         const day = String(currentDateObj.getDate()).padStart(2, '0');
//         const currentDate = `${year}-${month}-${day}`;

//         console.log(currentDate);

//         const startDate = user.goal_set_date;
//         console.log(startDate);

//         const startDateObj = new Date(startDate);
//         console.log(startDateObj);


//         const index1 = Math.floor((currentDateObj - startDateObj) / (24 * 60 * 60 * 1000));

//         let index = index1 + 1;
//         console.log('index: ' + index);

//         // if (user.meditation[index] == '1') {
//         //     console.log('already exists');
//         // }

//         // else {
//         //     console.log('not already exists');
//         // }


//         console.log(user.meditation[index]);

//         let m_check;

//         if (user.meditation[index] == '1') {
//             console.log('already exists');
//             m_check = true;
//         }
//         else {
//             console.log('not exists');
//         }

//         const count = user.meditation.reduce((accumulator, currentValue) => {
//             if (currentValue === '1') {
//                 return accumulator + 1;
//             } else {
//                 return accumulator;
//             }
//         }, 0);

//         console.log(count);

//         user.meditation_count = count;
//         user.meditation_check = m_check;

//         console.log(user)
//         // Password is correct, send the user data as JSON response
//         res.json(user);  //check

//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

app.post('/submitmeditation', async (req, res) => {
    const { userid, med_checked, j_checked } = req.query;

    try {
        const currentDateObj = new Date();
        const year = currentDateObj.getFullYear();
        const month = String(currentDateObj.getMonth() + 1).padStart(2, '0');
        const day = String(currentDateObj.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;

        const user = await users.findOne({ userid });

        console.log(currentDate);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        //  const startDate =  '2023-06-12';
        const startDate = user.goal_set_date;
        console.log(startDate);

        const startDateObj = new Date(startDate);
        console.log(startDateObj);


        const index = Math.floor((currentDateObj - startDateObj) / (24 * 60 * 60 * 1000));

        console.log('index: ' + index);

        console.log("med_checked : " + med_checked);

        if (med_checked == 'done') {
            if (user.meditation[index] == '0') {

                user.meditation[index] = '1'; // Make sure the value is a string '1'
                user.points = user.points + 100;

                console.log(user.meditation);
                await user.save();

                console.log('updated')


            }
            else {
                console.log(' med already updated')
            }
        }

        else {
            console.log('med not checked');
        }





        //jogging

        const currentDateObj_j = new Date();
        const year_j = currentDateObj_j.getFullYear();
        const month_j = String(currentDateObj_j.getMonth() + 1).padStart(2, '0');
        const day_j = String(currentDateObj_j.getDate()).padStart(2, '0');
        const currentDate_j = `${year_j}-${month_j}-${day_j}`;


        const startDate_j = user.j_goal_set_date;
        console.log(startDate_j);

        const startDateObj_j = new Date(startDate_j);
        console.log(startDateObj_j);


        const index_j = Math.floor((currentDateObj_j - startDateObj_j) / (24 * 60 * 60 * 1000));

        console.log('j index: ' + index_j);

        console.log("j_checked : " + j_checked);

        if (j_checked == 'done') {
            if (user.jogging[index_j] == '0') {

                user.jogging[index_j] = '1'; // Make sure the value is a string '1'
                user.points = user.points + 100;

                console.log(user.jogging);
                await user.save();

                console.log('j updated')


            }
            else {
                console.log('j already updated')
            }
        }

        else {
            console.log('med not checked');
        }




        res.json({ message: 'Meditation submitted successfully' });
    } catch (error) {
        console.error('Error during meditation submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// app.post('/submitmeditation', async (req, res) => {
//     const { userid } = req.query;

//     try {
//         const currentDate = '2023-06-14';
//         const user = await users.findOne({ userid });

//         console.log(currentDate);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const startDate = '2023-06-12';
//         console.log(startDate);

//         const currentDateObj = new Date(currentDate);
//         const startDateObj = new Date(startDate);

//         const index = Math.floor((currentDateObj - startDateObj) / (24 * 60 * 60 * 1000));

//         console.log('index: ' + index);
//         user.meditation[index] = '1'; // Make sure the value is a string '1'
//         await user.save();

//         res.json({ message: 'Meditation submitted successfully' });
//     } catch (error) {
//         console.error('Error during meditation submission:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

app.listen(8000, () => console.log('listening on port: 5000'));
