# Primer Parcial – Sistema de Gestión de Proyectos de Software (Base)

API REST con Node.js, Express y Sequelize/MySQL.

## Instalación

1. `npm install`
2. Copiar `.env.example` a `.env` y completar los valores.
3. Crear la base de datos en MySQL (`DB_NAME`).
4. `npm run dev`

## Endpoints

Todas las rutas empiezan con `/api`. Cuando alguien inicia sesión, la API le guarda un token en una cookie llamada `token`, y con eso sabe quién es en cada pedido. El token dura una hora.

### Auth

Para crear una cuenta se usa `POST /api/auth/register`. Hay que mandar el username, el email, la password y los datos del perfil: número de empleado, nombre, apellido y, si se quiere, un teléfono. También se puede indicar el rol (developer o administrator); si no se manda, la cuenta queda como developer. El username, el email y el número de empleado no se pueden repetir, y la password tiene que tener al menos 8 caracteres. Si todo está bien, devuelve el usuario creado con su perfil, sin la password.

Para entrar se usa `POST /api/auth/login` con el email y la password. Si son correctos, la API guarda el token en la cookie. Si alguno está mal, responde que las credenciales son inválidas, sin aclarar cuál de los dos falló.

Para salir se usa `POST /api/auth/logout`. Hace falta tener la sesión iniciada, y lo único que hace es borrar la cookie.

### Users

Estas rutas son solo para administradores. `GET /api/users` lista todos los usuarios con su perfil y sus proyectos, y `DELETE /api/users/:id` elimina a un usuario. La eliminación es lógica: el usuario queda guardado en la base, pero ya no aparece en las búsquedas y no puede ser líder de ningún proyecto.

### Projects

Cualquier usuario con la sesión iniciada puede crear un proyecto con `POST /api/projects`. Hay que mandar un código que no se repita, el nombre, la descripción, la fecha de inicio y el presupuesto, que tiene que ser mayor a cero. El estado es opcional (planning, in_progress, paused o finished) y arranca en planning. También se puede mandar la lista de ids de las tecnologías que usa. El líder del proyecto es siempre quien lo crea.

Cada usuario puede ver sus propios proyectos con `GET /api/projects/my-projects`. Solo los administradores pueden ver todos los proyectos con `GET /api/projects`.

Solo el líder de un proyecto puede editarlo o eliminarlo. Para editarlo se usa `PUT /api/projects/:id` y se mandan únicamente los datos que se quieren cambiar. Si se manda la lista de tecnologías, reemplaza a la anterior, y si se manda un `leader_id`, el proyecto pasa a otro usuario, siempre que ese usuario exista y no haya sido eliminado. Para eliminarlo se usa `DELETE /api/projects/:id`.

### Technologies

Cualquier usuario con la sesión iniciada puede ver las tecnologías y en qué proyectos se usan con `GET /api/technologies`. Crearlas con `POST /api/technologies` (nombre obligatorio que no se repita y descripción opcional) y eliminarlas con `DELETE /api/technologies/:id` es solo para administradores. Cuando se elimina una tecnología, los proyectos que la usaban simplemente dejan de tenerla.

### Cuando algo sale mal

Si los datos mandados no son válidos, la API responde con un 400 y explica qué está mal en cada campo. Si no hay sesión iniciada o las credenciales no son correctas, responde con un 401. Si el usuario no tiene permiso para lo que intenta hacer, responde con un 403. Si lo que se busca no existe, responde con un 404.
