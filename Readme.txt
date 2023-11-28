
Para mi: Acceso a BD de mongo online: https://cloud.mongodb.com/v2/65481d9edcedf2724701f834#/host/replicaSet/654820209d16c83a2c8b35c5
Proximas tareas, subir al hostiger y arreglar el formulario de reset password.
Borrar pedidos desde el admin

Datos a completar del .env
ADMIN_MAIL=
ADMIN_MAIL_PASS=
ADMIN_USERNAME=
ADMIN_PASSWORD=
DB_PASSWORD=
PORT=

...................................................................................................................................................

Requisitos para la aprobación:

·        Se debe contar con sitio visualmente ordenado.

·        La web debe estar subida a github y un readme.txt explicando el desarrollo y tecnologías usadas.

·        Se deberá contar con funcionalidades CRUD (creacion, lectura, actualizacion y eliminacion de datos).

·        Se deberá implementar persistencia de datos con MongoDB o MySql.

·        También se evalúa si el alumno logro configurar las variables de entorno correctamente usando dotenv.

·        Se deberá contar con manejo de errores (producto no encontrado o acciones inválidas).

·        El Front se podrá hacer con las tecnologías que sean más cómodas, pero se recomienda usar HBS o React.

·        Se deberá contar con enrutadores.

·        Se deberá presentar un proyecto ordenado (según lo visto en la clase).


La calificación es de un 6 para la aprobación de; fullstack.

...................................................................................................................................................



Explicacion del tp: (El back esta realizado con Node.js y el Front con HBS.)

Este proyecto este enfocado en hacer un login lo mas profesional posible.

CRUD aplicado:  

Create: Puedo crear nuevos usuarios., manda un mail a tu correo y generando un token podes cambiar la contraseña.
Read: Se utiliza para iniciar sesion desde la misma Home.
Update: Puedo cambiar contraseña de usuarios existentes, manda un mail a tu correo y generando un token podes cambiar la contraseña.
Delete: Podes borrar un usario dentro del menu mobile cuando ya estes logeado.


Middlewares aplicados:

En /login,/reset-password y en /delete-password que son las unicas vistas que un usuario no registrado no deberia poder ver

(Hay 3 tipos de usuarios: El usuario registrado, el no registrado y el Admin)

El usuario no registrado no puede mandar formulario pero si puede contactarse por whatsApp (Obteniendo su telefono)
El usuario Registrado puede contactarse por whatsApp y tmb puede enviar el formulario. (Obteniendo mail y telefono aunque borre el user)
El admin por ahora no puede hacer nada, pero puede ver una seccion donde van a cargar los pedidos como si fuesen tickets. (en el futuro podra responder desde ahi)



