const bcrypt = require('bcrypt');
const res = require('express/lib/response');
//Mantener cuenta abierta si se logeo el usuario
function login(req, res){
    if(req.session.loggedin != true){
        res.render('login/index');
    }
    else{
        res.redirect('/')
    }
}
//Autentificar los datos ingresados en el Login
function auth(req,res){
    const data = req.body;
    req.getConnection((err, conn) =>{
        //Obtener los datos de email para ver si existe un usuario con el email leido
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata)=>{

            if(userdata.length>0){
                
                userdata.forEach(element =>{
                    //Comparar la contraseña ingresada con la contraseña encriptada en la base de datos
                    bcrypt.compare(data.password, element.password, (err, isMatch)=>{
                        userdata.forEach(element =>{
    
                        });
                        if(!isMatch){
                            res.render('login/index', { error: 'Error: Contraseña incorrecta'});
                        }
                        else{
                            
                            req.session.loggedin = true;
                            req.session.name = element.usuario;

                            res.redirect('/');

                        }
                    });
                });
            }
            else{
                res.render('login/index', { error: 'Error: Este correo no esta registrado.'});
            }
        });
    });

}
//Mantener cuenta abierta si se logeo el usuario
function register(req, res){
    if(req.session.loggedin != true){
        res.render('login/register');
    }
    else{
        res.redirect('/')
    }
}
//Almacenar nuevo usuario con los datos ingresados
function storeUser(req, res){
    const data = req.body;
    //Checar si el email ingresado ya existe dentro de la base de datos
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata)=>{
            if(userdata.length>0){
                res.render('login/register', { error: 'Error: Este correo ya esta registrado.'});
            }
            else{
                //Si no existe el email, la contraseña se encripta usando bcrypt y con un salt 12
                bcrypt.hash(data.password, 12).then(hash => { //12 es la sal
        
                    data.password = hash;
                    //Almacenar los datos en la base de datos
                    req.getConnection((err, conn) =>{
                        conn.query('INSERT INTO users SET ?', [data], (err, rows) =>{

                            req.session.loggedin = true;
                            req.session.name = data.usuario;
                            res.redirect('/')
                        });
                    });
                });
            }
        });
    });

}
//Proceso para cerrar sesion y redirigir al login
function logout(req, res){
    if(req.session.loggedin == true){
        req.session.destroy();
    }
        res.redirect('/login');
}


module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout,
}