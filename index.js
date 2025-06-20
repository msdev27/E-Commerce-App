// console.log("Server is running on port: " + process.env.PORT);

const express = require('express');
const app = express();
const userRepository = require('./repository/users.js');
const bodyParser = require('body-parser');

// const bodyParser = (req, res, next) => {
//     if (req.method === 'POST') {
//         req.on('data', (data) => {
//             const parsedData = data.toString('utf-8').split('&');
//             let formData = {};
//             for (const pd of parsedData) {
//                 const [key, value] = pd.split('=');
//                 formData[key] = value;
//             }
//             req.body = formData;
//             next();
//         });
//     } else {
//         next();
//     }
// }

app.get('/', (req, res) => {
    console.log("get call");
    res.send(`
    <div>
        <form method="POST">
            <input type="email"  name="email" placeholder="Email"/>
            <input type="password" name="password" placeholder="Password"/>
            <input type="password" name="passwordConfirmation" placeholder="Password Confirmation"/>
            <button type="submit">Sign Up</button>
        </form>
    </div>
    `);
});

app.post('/', bodyParser.urlencoded({ extended : true}), async (req, res) => {
    const {email, password, passwordConfirmation} = req.body;
    const existingUser = await userRepository.getOneBy({email: email});

    if (existingUser) {
        return res.send('Email in use');
    }

    if (password !== passwordConfirmation) {
        return res.send('Passwords do not match!');
    }
    await userRepository.create(req.body);
    res.send(`In the post method`);
});

app.listen(3000, () => {
    console.log('Server started on port 3000!');
});

