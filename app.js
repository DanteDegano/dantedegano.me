const express =  require('express')
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const session = require('express-session')
const mongoose =  require('mongoose')
const crypto = require('crypto');
const hbs = require("hbs")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
dotenv.config()

  const ADMIN_MAIL = process.env.ADMIN_MAIL
  const ADMIN_MAIL_PASS = process.env.ADMIN_MAIL_PASS

  // Configuración de nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: ADMIN_MAIL,
      pass: ADMIN_MAIL_PASS,
    }
  });

const app = express()

//Middleweres

app.use(express.static(__dirname + '/public'))

const session_params ={
    secret: 'keySecret',
    resave: false,
    saveUnitialized: true,
    cookie: {secure: false}
}
app.use(session(session_params))

//Configurando Handlebars

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

//MongoDB/Mongoose config 
const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const DB_NAME = 'eCommerceUTN_Noche_LM'

let original_password = process.env.ADMIN_PASSWORD

let hashedPassword

bcrypt.genSalt(10, (err, salt) =>{
    if(err){
        console.log("Hubo un error al generar la sal")
    }
    else{
        bcrypt.hash(original_password, salt, (err, hash) =>{
            if(err){
                console.log('hubo un error al hashear la contraseña')
            }
            else{
                hashedPassword = hash
                console.log('Su contraseña ha sido hasheada correctamente:', hashedPassword)
            }
            
        })
    }
})

const verificarContraseña = async (password) =>{ //REVISAR
    let isCorrect
    await bcrypt.compare(password, hashedPassword, (err, result) =>{
        if(err){
            isCorrect = false
            console.log('hola')
        }
        else if(result){
            isCorrect = true
        }
        else{
            isCorrect = false
        }
    })
    console.log(isCorrect)
    return isCorrect
}

const DB_PASSWORD = process.env.DB_PASSWORD
const URL_CONNECTION = `mongodb+srv://dantedegano:${DB_PASSWORD}@cluster0.qnxdsys.mongodb.net/${DB_NAME}`

mongoose.connect(URL_CONNECTION, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
const database = mongoose.connection;

database.on('error', () =>{
    console.log('Error al conectarse a MongoDB')
})
database.once('open', () =>{
    console.log('Conectado a MongoDB')
})

const User = mongoose.model('User', {
    username: String, 
    password: String,
    email: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});


// Configuración del body-parser para manejar datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Ruta para manejar el formulario
app.post('/enviar-correo', (req, res) => {
  // Obtén los datos del formulario desde el cuerpo de la solicitud
  const { nombre, email, mensaje } = req.body;



  // Configuración del correo electrónico
  const mailOptions = {
    from: 'dantedegano@gmail.com', // Reemplaza con tu dirección de correo
    to: 'dantedegano@gmail.com', // Reemplaza con la dirección del destinatario
    subject: 'Tienes un nuevo pedido:',
    text: `Nombre: ${nombre}\nCorreo: ${email}\nMensaje: ${mensaje}`
  };

  // Envía el correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.render('home')
  });
});


//Endpoints:

app.get('/', (req, res) => {
    if (req.session.user) {
        res.render('home', {
            user: req.session.user,
            isAdmin: req.session.isAdmin,
            isUser: req.session.isUser
        });
    } else {
        res.render('home');
    }
})

app.get('/home', (req, res) =>{
    res.render('home')
})

app.get('/error', (req, res) => {
    res.render('error')
})

app.post('/home', async (req, res) => {

    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        req.session.isUser = false;
        req.session.user = { username };
        return res.redirect('/');
    }
    
    const user = await User.findOne({ username });
    if (user && verificarContraseñaForUser(password, user.password)) {
        req.session.isAdmin = false;
        req.session.isUser = true;
        req.session.user = user;
        return res.redirect('/');
    } else {
        res.render('home', { error: 'Credenciales inválidas' });
    }
});

function verificarContraseñaForUser(inputPassword, storedPassword) {
    return inputPassword === storedPassword;
}

// Registra un nuevo usuario

app.get('/register', (req, res) =>{
    res.render('register')
})

app.post('/register', async (req, res) =>{
    const {username, password, email} = req.body
    const usuarioExistente =  await User.findOne({username})
    if(usuarioExistente){
        res.render('register', {error: 'El nombre de usuario ya esta siendo utilizado'})
    }else{
        const newUser = new User({username, password, email})
        await newUser.save()
        res.redirect('/home')
    }
})


// Cambia contraseña de usario ya existente

app.use(express.urlencoded({ extended: true }));


app.get('/change-password', (req, res) => {
    res.render('change-password');
});

app.post('/change-password', async (req, res) => {
    const { username, email } = req.body;

    const token = crypto.randomBytes(20).toString('hex');

    const user = await User.findOneAndUpdate(
        { username, email },
        { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 }
    );
    

    if (user) {
        const resetLink = `http://localhost:${PORT}/reset-password?token=${token}`;

        transporter.sendMail({
            to: user.email,
            subject: 'Password Reset',
            html: `Click <a href="${resetLink}">here</a> to reset your password.`,
        });

        res.render('change-password', { message: 'A password reset link has been sent to your email.' });
    } else {
        res.render('change-password', { error: 'Invalid username or email.' });
    }
});

app.get('/reset-password', async (req, res) => {
    const { token } = req.query;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });
    

    if (user) {
        res.render('reset-password', { token });
    } else {
        res.render('reset-password', { error: 'Invalid or expired token. Please try again.' });
    }
});

app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (user) {
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.render('/', { message: 'Your password has been successfully reset. You can now log in with your new password.' });
    } else {
        res.render('reset-password', { error: 'Invalid or expired token. Please try again.' });
    }
});


// Borra usuario de la base de datos

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
};

app.get('/delete-account', isAuthenticated, (req, res) => {
    res.render('delete-account');
});

app.post('/delete-account', isAuthenticated, async (req, res) => {
    const { username, password } = req.body;
    try {
        const usuarioExistente = await User.findOne({ username, password });
        if (usuarioExistente) {
            await User.deleteOne({ _id: usuarioExistente._id });
            req.session.destroy()
            res.redirect('/');
        } else {
            res.render('delete-account', { error: 'Nombre de usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error al intentar eliminar la cuenta:', error);
        res.render('delete-account', { error: 'Error al intentar eliminar la cuenta. Por favor, inténtalo de nuevo más tarde.' });
    }
});



app.get('/logout', (req, res) =>{
    req.session.destroy()
    res.redirect('/')
})


console.log(process.env.PORT)
const PORT = process.env.PORT || 7070
app.listen(PORT, () =>{
    console.log(`Su servidor se esta ejecutando en http://localhost:${PORT}/`)
})
