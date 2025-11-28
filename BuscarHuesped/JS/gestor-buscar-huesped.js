export default class GestorBuscarHuesped {
    constructor() {
    }

    
    static extraerDatosFormulario() {
        const formData = {
            apellido: document.getElementById('apellido')?.value.trim() || '',
            nombre: document.getElementById('nombre')?.value.trim() || '',
            tipoDocumento: document.getElementById('tipoDocumento')?.value || '',
            numeroDocumento: document.getElementById('numeroDocumento')?.value.trim() || ''
        };

        return formData;
    }

    
    // async cargarHuespedes() {
    //     try {
    //         const respuesta = await fetch(this._rutaBD);
    //         if (!respuesta.ok) {
    //             throw new Error(`Error al cargar los datos: ${respuesta.status}`);
    //         }
            
    //         const datosCrudos = await respuesta.json();
                
    //         console.log(`Se cargaron ${this._datosHuespedes.length} huéspedes`);
                
    //         return this._datosHuespedes;
    //     } catch (error) {
    //         console.error('Error al cargar huéspedes:', error);
    //         mensajeError('Error al cargar los datos de huéspedes. Por favor, recarga la página.');
    //         this._datosHuespedes = [];
    //         return [];
    //     }
    // }

    
    static async buscarHuespedesEnAPI(apellido, nombre, tipoDocumento, numeroDocumento) {
        try {
            const params = new URLSearchParams({
                apellido: apellido || '',
                nombre: nombre || '',
                tipoDocumento: tipoDocumento || '',
                numeroDocumento: numeroDocumento || ''
            });

            const url = `http://localhost:8080/api/huespedes/buscar?${params.toString()}`;
            console.log('URL de búsqueda:', url);

            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || data || 'Error al buscar huéspedes');
            }

            console.log('Resultados de la búsqueda:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Error al buscar huéspedes en la API:', error);
            return {
                error: error.message || "Error inesperado de conexión. Por favor, verifica que el servidor esté corriendo."
            };
        }
    }

    static renderizarResultados(resultados) {
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

    
    static mostrarResultados() {
        const contenedorResultados = document.querySelector('.contenedor-resultados');
        const contenedorPrincipal = document.querySelector('.contenedor-principal');
        
        if (contenedorResultados && contenedorPrincipal) {
            contenedorPrincipal.style.width = '40vw';
            contenedorResultados.style.display = 'block';
        }
    }
}

window.GestorBuscarHuesped = GestorBuscarHuesped;



