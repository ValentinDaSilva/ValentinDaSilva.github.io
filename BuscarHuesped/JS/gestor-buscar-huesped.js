

import { GestorHuesped } from "../../Clases/Dominio/dominio.js";


class GestorBuscarHuesped extends GestorHuesped {
    constructor() {
        super();
        this._rutaBD = '/Datos/huespedes.json';
        this._datosHuespedes = [];
    }

    
    extraerDatosFormulario() {
        const formData = {
            apellido: document.getElementById('apellido')?.value.trim() || '',
            nombre: document.getElementById('nombre')?.value.trim() || '',
            tipoDocumento: document.getElementById('tipoDocumento')?.value || '',
            numeroDocumento: document.getElementById('numeroDocumento')?.value.trim() || ''
        };

        return formData;
    }

    
    async cargarHuespedes() {
        try {
            const respuesta = await fetch(this._rutaBD);
            if (!respuesta.ok) {
                throw new Error(`Error al cargar los datos: ${respuesta.status}`);
            }
      const datosCrudos = await respuesta.json();
      this._datosHuespedes = this.normalizarDatosHuespedes(datosCrudos);
            console.log(`Se cargaron ${this._datosHuespedes.length} huéspedes`);
            return this._datosHuespedes;
        } catch (error) {
            console.error('Error al cargar huéspedes:', error);
            mensajeError('Error al cargar los datos de huéspedes. Por favor, recarga la página.');
            this._datosHuespedes = [];
            return [];
        }
    }

    
    filtrarHuespedes(apellido, nombre, tipoDocumento, numeroDocumento) {
        
        const apellidoTrim = apellido ? apellido.trim() : '';
        const nombreTrim = nombre ? nombre.trim() : '';
        const tipoDoc = tipoDocumento ? tipoDocumento.trim() : '';
        const numDoc = numeroDocumento ? numeroDocumento.trim() : '';
        
        if (!apellidoTrim && !nombreTrim && !tipoDoc && !numDoc) {
            return this._datosHuespedes; 
        }
        
        let resultados = this._datosHuespedes;
        
        
        if (apellidoTrim !== '') {
            const apellidoLower = apellidoTrim.toLowerCase();
            resultados = resultados.filter(huesped => 
        (huesped.apellido || '').toLowerCase().startsWith(apellidoLower)
            );
        }
        
        
        if (nombreTrim !== '') {
            const nombreLower = nombreTrim.toLowerCase();
            resultados = resultados.filter(huesped => 
        (huesped.nombre || '').toLowerCase().startsWith(nombreLower)
            );
        }
        
        
        if (tipoDoc !== '') {
            resultados = resultados.filter(huesped => 
                huesped.tipoDocumento === tipoDoc
            );
        }
        
        
        if (numDoc !== '') {
            resultados = resultados.filter(huesped => 
        (huesped.numeroDocumento || '').toString().startsWith(numDoc)
            );
        }
        
        return resultados;
    }

    
    renderizarResultados(resultados) {
        const tbody = document.querySelector(".tabla-resultados tbody");
        if (!tbody) {
            console.error('No se encontró el tbody de la tabla');
            return;
        }
        
        
        tbody.innerHTML = '';
        
        
        if (resultados.length === 0) {
            const filaVacia = document.createElement('tr');
            const celdaVacia = document.createElement('td');
            celdaVacia.colSpan = 4;
            celdaVacia.textContent = 'No se encontraron resultados';
            celdaVacia.style.textAlign = 'center';
            celdaVacia.style.padding = '20px';
            celdaVacia.style.color = '#666';
            filaVacia.appendChild(celdaVacia);
            tbody.appendChild(filaVacia);
            return;
        }
        
        
        resultados.forEach(huesped => {
            const fila = document.createElement('tr');
            
            
            const celdaApellido = document.createElement('td');
            celdaApellido.textContent = huesped.apellido;
            
            
            const celdanombre = document.createElement('td');
            celdanombre.textContent = huesped.nombre;
            
            
            const celdaTipoDoc = document.createElement('td');
            celdaTipoDoc.textContent = huesped.tipoDocumento;
            
            
            const celdaNumDoc = document.createElement('td');
            celdaNumDoc.textContent = huesped.numeroDocumento;
            
            
            fila.appendChild(celdaApellido);
            fila.appendChild(celdanombre);
            fila.appendChild(celdaTipoDoc);
            fila.appendChild(celdaNumDoc);
            
            
            fila.setAttribute('data-huesped', JSON.stringify(huesped));
            
            
            tbody.appendChild(fila);
        });
        
        console.log(`Se renderizaron ${resultados.length} resultados`);
    }

    
    mostrarResultados() {
        const contenedorResultados = document.querySelector('.contenedor-resultados');
        const contenedorPrincipal = document.querySelector('.contenedor-principal');
        
        if (contenedorResultados && contenedorPrincipal) {
            contenedorPrincipal.style.width = '40vw';
            contenedorResultados.style.display = 'block';
        }
    }

    
    async procesarBusqueda() {
        try {
            
            if (this._datosHuespedes.length === 0) {
                await this.cargarHuespedes();
                if (this._datosHuespedes.length === 0) {
                    mensajeError('No se pudieron cargar los datos. Por favor, recarga la página.');
                    return false;
                }
            }
            
            
            const datosFormulario = this.extraerDatosFormulario();
            console.log('Datos extraídos del formulario:', datosFormulario);
            
            
            const resultados = this.filtrarHuespedes(
                datosFormulario.apellido,
                datosFormulario.nombre,
                datosFormulario.tipoDocumento,
                datosFormulario.numeroDocumento
            );
            
            console.log(`Se encontraron ${resultados.length} resultados`);
            
            
            this.renderizarResultados(resultados);
            
            
            this.mostrarResultados();
            
            
            setTimeout(() => {
                if (typeof inicializarTablaResultados === 'function') {
                    inicializarTablaResultados();
                } else {
                    console.error('La función inicializarTablaResultados no está disponible');
                }
            }, 200);
            
            return true;
        } catch (error) {
            console.error('Error al procesar la búsqueda:', error);
            mensajeError('Error al procesar la búsqueda: ' + error.message);
            return false;
        }
    }

    
    obtenerDatosHuespedes() {
        return this._datosHuespedes;
    }
}


export { GestorBuscarHuesped };

const gestorBuscarHuesped = new GestorBuscarHuesped();


window.gestorBuscarHuesped = gestorBuscarHuesped;



