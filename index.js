const express = require('express');
const userRepository = require('./repository/users.js');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

const app = express();

app.use(cookieSession({
    keys: ['eu3na9fa2ci8cn0ri']
}));
app.use(bodyParser.urlencoded({extended: true}));
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

app.get('/signup', (req, res) => {
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

app.post('/signup', async (req, res) => {
    const {email, password, passwordConfirmation} = req.body;
    const existingUser = await userRepository.getOneBy({email: email});

    if (existingUser) {
        return res.send('Email in use');
    }

    if (password !== passwordConfirmation) {
        return res.send('Passwords do not match!');
    }
    const newUser = await userRepository.create(req.body);
    req.session.userId = newUser.id;
    res.send(`Successfully signed up`);
});

app.get('/signin', (req, res) => {
    res.send(`
        <div>
        <form method="POST">
            <input type="email"  name="email" placeholder="Email"/>
            <input type="password" name="password" placeholder="Password"/>
            <button type="submit">Sign Up</button>
        </form>
    </div>
    `)
});

app.post('/signin', async (req, res) => {
    const {email, password} = req.body;
    const existingUser = userRepository.getOneBy({email: email});
    if (!existingUser) {
        return res.send('User not found');
    }

    const passwordsMatch = await userRepository.comparePasswords(existingUser.password, password);

    if (!passwordsMatch) {
        return res.send('Passwords do not match!');
    }

    req.session.userId = existingUser.id;
    res.send(`Successfully logged in`);
});

app.get('/signout', (req, res) => {
    req.session = null;
    res.send('User logged out');
});

app.listen(3000, () => {
    console.log('Server started on port 3000!');
});

