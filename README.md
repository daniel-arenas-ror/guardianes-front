## Guardianes Informáticos

Este proyecto se conecta con el backend para poder adminsitrar la disponibilidad de cada uno de los trabajadores

# Estructura

tenemos dos vistas, las cuales estan en los archivos de [views](https://github.com/daniel-arenas-ror/guardianes-front/tree/main/src/views), que son los encargados de mostrar los turnos y administrar las disponibilidad.

Para hacer los request se creo un modulos llamado [axiosConf](https://github.com/daniel-arenas-ror/guardianes-front/blob/main/src/core/axiosConf/index.js), es el encargado de toda la configuracion del axios, por otro lado, creamos un [connector](https://github.com/daniel-arenas-ror/guardianes-front/blob/main/src/core/connector/index.js), que es el encargado de hacer todos los request, de esta forma queda abstraida toda la logica de request en un solo lugar y de allí se crean [repositorios](https://github.com/daniel-arenas-ror/guardianes-front/tree/main/src/repositories) para cada uno de los modelos de tienen comunicación con el backend.

# Requisitos

Node v20.13.1

# Instalación

```
npm install
```

```
npm run dev
```
