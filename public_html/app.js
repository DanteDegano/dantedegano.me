const express =  require('express')
const session = require('express-session')
const mongoose =  require('mongoose')
const hbs = require("hbs")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
dotenv.config()


const app = express()

//Middleweres

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: true}))

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
    password: String
})

const Producto = mongoose.model('Producto', {
    precio: Number, 
    nombre: String,
    stock: Number,
    descripcion: String
})

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
    const {username, password} = req.body
    const usuarioExistente =  await User.findOne({username})
    if(usuarioExistente){
        res.render('register', {error: 'El nombre de usuario ya esta siendo utilizado'})
    }else{
        const newUser = new User({username, password})
        await newUser.save()
        res.redirect('/home')
    }
})

// Cambia contraseña de usario ya existente (requiere de vieja contraseña)

app.get('/change-password', (req, res) =>{
    res.render('change-password')
})

app.post('/change-password', async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    // Busca el usuario por nombre de usuario y contraseña actual
    const usuarioExistente = await User.findOne({ username, password: oldPassword });

    if (usuarioExistente) {
        // Borra la contraseña anterior del usuario encontrado
        usuarioExistente.password = undefined; // O establece un valor seguro, por ejemplo, null

        // Cambia la contraseña del usuario encontrado
        usuarioExistente.password = newPassword;
        
        await usuarioExistente.save();
        // Redirige al usuario a la página luego del cambio de contraseña
        res.redirect('/'); 
    } else {
        res.render('change-password', { error: 'Nombre de usuario o contraseña actual incorrectos' });
    }
});

// Borra usuario de la base de datos

app.get('/delete-account', (req, res) =>{
    res.render('delete-account')
})

app.post('/delete-account', async (req, res) => {
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


/* Como autoresetar con HBS */