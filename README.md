# MURDER IN THE HOSPITAL 🥼🏥

## Lenguajes y Herramientas

### HTML

- A través de [JSX](https://legacy.reactjs.org/docs/introducing-jsx.html) para poder utilizarlo junto con JavaScript en un mismo archivo.

### JavaScript

- Usamos [React](http://facebook.github.io/react) para la User Interface

### CSS

- Para las páginas de estilo de cada ruta.


## Consideraciones de diseño

### Paleta de colores

Basamos nuestra paleta en el mockup de la entrega 0

- <a href='#'><img valign='middle' alt='#CAEEEB' src='https://readme-swatches.vercel.app/CAEEEB?style=round'/></a> (#CAEEEB) Para el background.
- <a href='#'><img valign='middle' alt='#06A196' src='https://readme-swatches.vercel.app/06A196?style=round'/></a> (#06A196) Para los títulos, el fondo de los botones y para resaltar textos en general.
- <a href='#'><img valign='middle' alt='#000000' src='https://readme-swatches.vercel.app/000000?style=round'/></a> (#000000) Para el header, y algunos textos.
- <a href='#'><img valign='middle' alt='#FFFFFF' src='https://readme-swatches.vercel.app/FFFFFF?style=round'/></a> (#FFFFFF) Para el título del juego, el texto en los botones y algunos otros textos.

### Fonts

Las fonts también las basamos en el mockup de la entrega 0. Usamos 2:

- Usamos [Muro](https://www.dafont.com/es/muro.font) para los títulos, subtitulos y botones. Esta fue la tipografía más parecida al mockup que pudimos encontrar.
- Usamos [Segoe UI](https://learn.microsoft.com/es-es/typography/font-list/segoe-ui) para los textos descriptivos, esta venía ya instalada.


## Archivos de estilo

### Dificultades encontradas

Comenzamos el diseño utilizando los típicos archivos .css para dar estilo a cada página. Sin embargo, al pasar de trabajar con archivos .html a .jsx, nos encontramos con que las vistas se desarmaban. Luego de investigar, nos dimos cuenta de que los archivos .css estaban interfiriendo en páginas a las que no estaban asignados, por lo que, para solucionarlo, cambiamos de .css a .module.css en los archivos de estilo de las páginas que se habían visto afectadas.

## Cómo probar nuestros avances

Básicamente, lo que esta implementado de momento destaca las funcionalidades básicas de un juego. De momento, funciona con un solo tablero y un solo personaje (que pertenece al primero en registrarse), para demostrar dos aspectos; el movimiento con el dado y la asignación aleatoria de cartas a las salas específicas. Para esto, se deben seguir los siguientes pasos una vez ya ejecutado el servidor del [Backend](https://github.com/IIC2513/back-WebGirlies#):


1. Ejecutar `yarn dev`
2. Se debe registrar (Puede ser por la página o por la documentación en Postman) y luego iniciar sesión en la página.
3. Luego, por medio de la documentación en Postman en **Post new game**, se crea un tablero con el ownerId = 1, que corresponde al usuario del punto anterior.
4. Se debe acceder a la ruta "/character" quedando como: http://localhost:5173/character para poder seleccionar el avatar con el que se quiere jugar
5. Una vez hecho esto, se debe ir a la sección "Play" donde se verá el tablero con el jugador seleccionado en el medio. Aquí se pueden tirar los dados y, luego de esto, seleccionar la celda a la que uno se quiere mover. Donde, si el número lo permite, la imagen del personaje se trasladará, de lo contrario, se quedará donde está esperando que se seleccione una celda correcta

## Asegúrate de configurar las variables de entorno con la información de la base de datos en un archivo .env:
```bash
VITE_BACKEND_URL="http://localhost:3000"
```

## Consideraciones
### Qué alcanzamos a cubrir y qué no
La lógica del juego sigue manteniendo en esencia pero ahora funciona como un Clue con las siguientes reglas:

1. Los jugadores intentan resolver un asesinato al descubrir tres cosas:
  - Quién es el asesino.
  - Con qué arma se cometió el asesinato.
  - En qué habitación ocurrió el asesinato.
    
2. Inicialmente, se colocan cartas de sospechosos, armas y habitaciones en sus respectivas categorías. Una carta de cada categoría se selecciona al azar y se coloca en el sobre confidencial, que contiene la solución del caso. El resto de las cartas se baraja y reparte entre los jugadores y las habitaciones.

3. Para los turnos, los jugadores lanzan un dado para moverse por el tablero hacia las habitaciones que contienen cartas y poder recogerlas.
4. En cuanto a la acusación, cuando un jugador cree que sabe la solución, puede hacerla. Si la acusación es correcta, el jugador gana. Si es incorrecta el jugador queda fuera de la partida, y no puede seguir jugando y no puede volver a acusar.

4. Se gana cuando un jugador hace una acusación correcta, es decir, adivinar correctamente el sospechoso, el arma y la habitación.

5. Mecánica de eliminación de sospechas: Cada carta vista o descartada ayuda a deducir qué cartas están en el sobre confidencial.
   
### Detalles de funcionamiento del juego
Existen detalles en el juego que no logramos trabajar al 100% en el frontend pero que en cuanto al backend sí funcionan. Por ejemplo:
1. Para recoger las cartas se debe parar sobre ellas para recogerlas. Ya que, si bien existe toda la lógica de identificar si es que un usuario está dentro de una habitación al llegar a su respectiva puerta o no y de repartir aleatoriamente las cartas en el tablero, no se concretó el hecho de "mover" la imagen del jugador dentro de la habitación respectiva.
2. También, una vez se recogen las cartas, la página no logra actualizarse automáticamente y mostrar el cambio instantáneo, por lo que se requiere recargar la página para que le aparezca la carta al usuario dentro de "My cards" y que desaparezca del tablero.
