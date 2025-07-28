# 🛠️ Inventory – API REST con Next.js 15 y TypeScript

Este proyecto es una API construida con **Next.js 15 (App Router)** y **TypeScript**, que permite:

- ✅ Registro e inicio de sesión de usuarios con JWT
- 🧑 Gestión del perfil del usuario autenticado
- 📦 CRUD de productos
- 🛡️ Validación de entradas, autenticación y manejo de errores
- 🧪 Pruebas unitarias con Jest
- 📚 Leer archivos excel y obtener datos especificos

---

##  Documentacion de la API
https://documenter.getpostman.com/view/19105603/2sB3B7NDvW

##  Requisitos
éste proyecto utiliza docker para crear una versión de producción que pueda ejecutarse en cualquier computadora para eso será necesario tener instalado lo siguiente:
* docker
* docker-compose

## 🧪 Credenciales de Prueba

Puedes iniciar sesión con las siguientes credenciales para probar rutas protegidas:

```txt
Email: correo@correo.com
Contraseña: password
```

## ▶️ Cómo iniciar el proyecto

Es necesario copiar las credenciales del `.env.example` al archivo `.env` y crear este ultimo en caso de ser necesario. Para esto podemos usar el siguiente comando.
```bash
cp .env.example .env
```

```bash
git clone https://github.com/IvanVasquez289/inventory
cd inventory
scripts/docker-setup.sh
```
### Comándos útiles

Iniciar los contenedores en segundo plano basado en la imágen existente
```bash
docker-compose up -d
```

Detener los contenedores
```bash
docker-compose down -v
```

Revisar los logs en tiempo real
```bash
docker-compose logs -f
```

Acceder al contenedor de la aplicación
```bash
docker-compose exec app sh
```


## 🧪 Cómo correr las pruebas unitarias

Ejecuta las pruebas con:

```bash
npx jest

