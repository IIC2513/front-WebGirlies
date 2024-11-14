# MURDER IN THE HOSPITAL

## Idiomas y Herramientas

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

Comenzamos el diseño utilizando los típicos archivos .css para dar estilo a cada página, sin embargo, al pasar de trabajar con archivos .html a .jsx nos encontramos con que las vistas de desarmaban. Luego de investigar nos dimos cuenta de que los archivos .css estaban interfiriendo páginas a las que no estaban asignados.
para solucionarlo cambiamos de .css a .module.css en los archivos de estilo de las páginas ue se habían visto afectadas.