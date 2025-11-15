


function mostrarLeyenda() {
  const resultado = document.querySelector('.contenedor-resultados');
  if (!resultado) {
    console.error('Contenedor de resultados no encontrado');
    return;
  }
  
  const hijosCopia = Array.from(resultado.children).map(child => child.cloneNode(true));
  
  
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
  
  const leyendaDiv = document.createElement('div');
  leyendaDiv.className = 'contenedor-leyenda';
  leyendaDiv.innerHTML = `
    <span class="icono-cerrar">&times;</span>
    <fieldset style="padding:20px; border-radius:10px">
      <h3>Estados de habitaciones:</h3>
      <div class="item-leyenda">
        <div class="caja-color color-libre"></div> Libre
      </div>
      <div class="item-leyenda">
        <div class="caja-color color-ocupada"></div> Ocupada
      </div>
      <div class="item-leyenda">
        <div class="caja-color color-reservada"></div> Reservada
      </div>
      <div class="item-leyenda">
        <div class="caja-color color-seleccionada"></div> Seleccionada
      </div>
      <div class="item-leyenda">
        <div class="caja-color color-fuera-servicio"></div> Fuera de Servicio
      </div>
    </fieldset>
    <fieldset style="padding:20px; border-radius:10px">
      <h3>Nomenclatura: Tipo Habitación - Numero Habitación</h3>
      <p class="tipo-habitacion">
        <span style="font-size: 18px; margin-right: 5px;">&#8594;</span>IND: Individual
      </p>
      <p class="tipo-habitacion">
        <span style="font-size: 18px; margin-right: 5px;">&#8594;</span>DOBE: Doble Estandar
      </p>
      <p class="tipo-habitacion">
        <span style="font-size: 18px; margin-right: 5px;">&#8594;</span>DOBS: Doble Superior
      </p>
      <p class="tipo-habitacion">
        <span style="font-size: 18px; margin-right: 5px;">&#8594;</span>FAM: Family Plan
      </p>
      <p class="tipo-habitacion">
        <span style="font-size: 18px; margin-right: 5px;">&#8594;</span>SUITE: Suite Doble
      </p>
    </fieldset>
    <fieldset style="padding:20px; border-radius:10px">
      <h3>Seleccionar Habitación</h3>
      <p>
        <span style="display:inline-block;width:12px;height:12px;background:rgb(255, 72, 72); border:2px solid black; border-radius:50%;margin-right:6px;vertical-align:middle;"></span>
        Para seleccionar una habitación, haga clic en el encabezado de la columna correspondiente. Las habitaciones seleccionadas se resaltarán en amarillo.
      </p>
    </fieldset>
  `;
  
  resultado.appendChild(leyendaDiv);
  
  const iconoCerrar = leyendaDiv.querySelector('.icono-cerrar');
  if (iconoCerrar) {
    iconoCerrar.addEventListener('click', function() {
      resultado.innerHTML = '';
      hijosCopia.forEach(child => resultado.appendChild(child));
      
      aplicarEstilosCeldas();
      inicializarSeleccionHabitaciones();
    });
  }
}


function inicializarLeyenda() {
  const iconoInformacion = document.querySelector('.icono-informacion');
  if (iconoInformacion) {
    iconoInformacion.addEventListener('click', mostrarLeyenda);
  }
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarLeyenda);
} else {
  inicializarLeyenda();
}

