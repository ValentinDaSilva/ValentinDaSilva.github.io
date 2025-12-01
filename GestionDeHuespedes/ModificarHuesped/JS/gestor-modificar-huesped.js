// JS/gestor-modificar-huesped.js
import GestorHuesped from "/GestionDeHuespedes/GestorHuesped.js";

class UIModificarHuesped {
    constructor() {
        this.mostrarDatos();
    }

    mostrarDatos() {
        const huesped = obtenerHuespedDeSessionStorage();
        if (!huesped) {
            mensajeError("Primero debes seleccionar un huésped", () => {
                window.location.href = '../BuscarHuesped/buscarHuesped.html';
            });
            return;

        }
        window.huespedOriginalModificar = JSON.parse(JSON.stringify(huesped));
        cargarDatosEnFormulario(huesped);


        const botonBorrar = document.querySelector(".boton-borrar");
        if (botonBorrar) {
            botonBorrar.addEventListener("click", () => {
                GestorHuesped.eliminarHuesped(this);
            });
        }

        const botonCancelar = document.querySelector(".boton-cancelar");
        if (botonCancelar) {
            botonCancelar.addEventListener("click", GestorHuesped.eliminarHuesped);
        }   
        
        const botonGuardar = document.querySelector(".boton-guardar");
        if (botonGuardar) {
            console.log("Asignando evento al botón Guardar");
            botonGuardar.addEventListener("click", (e) => {
                e.preventDefault();
                GestorHuesped.modificarHuesped(this);
            });
        }   
    }

    extraerDatosDeUI() {
        const apellido       = document.getElementById('apellido')?.value.trim() || '';
        const nombre         = document.getElementById('nombre')?.value.trim() || '';
        const tipoDocumento  = document.getElementById('tipoDocumento')?.value.trim() || '';
        const numeroDocumento= document.getElementById('numeroDocumento')?.value.trim() || '';
        const cuit           = document.getElementById('cuit')?.value.trim() || null;
        const fechaNacimiento= document.getElementById('fechaNacimiento')?.value || '';
        const caracteristica = document.getElementById('caracteristica')?.value.trim() || '';
        const telefonoNumero = (document.getElementById('celular') || document.getElementById('telefonoNumero'))?.value.trim() || '';
        const email          = document.getElementById('email')?.value.trim() || null;
        const ocupacion      = document.getElementById('ocupacion')?.value.trim() || '';
        const nacionalidad   = document.getElementById('nacionalidad')?.value.trim() || '';

        const calle          = document.getElementById('calle')?.value.trim() || '';
        const numero         = document.getElementById('numero')?.value.trim() || '';
        const departamento   = document.getElementById('departamento')?.value.trim() || '';
        const piso           = document.getElementById('piso')?.value.trim() || '';
        const codigoPostal   = document.getElementById('codigoPostal')?.value.trim() || '';
        const localidad      = document.getElementById('localidad')?.value.trim() || '';
        const provincia      = document.getElementById('provincia')?.value.trim() || '';
        const pais           = document.getElementById('pais')?.value.trim() || '';

        const telefono = caracteristica && telefonoNumero
            ? `${caracteristica}-${telefonoNumero}`
            : telefonoNumero || '';

        return {
            apellido,
            nombre,
            tipoDocumento,
            numeroDocumento,
            cuit,
            fechaNacimiento,
            caracteristica,
            telefonoNumero,
            telefono,
            email,
            ocupacion,
            nacionalidad,
            calle,
            numero,
            departamento,
            piso,
            codigoPostal,
            localidad,
            provincia,
            pais
        };
    }

    mostrarErrores(errores) {
        if (!Array.isArray(errores)) errores = [errores];
        const mensaje = errores.join("<br>");
        mensajeError(mensaje);
    }

    mostrarError(mensaje) {
        mensajeError(mensaje);
    }

    preguntarDocumentoExistente() {
        return new Promise((resolve) => {
            advertencia(
                "¡CUIDADO! Ya existe un huésped con ese número de documento.<br>¿Deseás modificarlo igual?",
                "CORREGIR ✏️",
                "ACEPTAR ✅"
            );

            const btnCorregir = document.getElementById("boton-advertencia-aceptar");
            const btnAceptar  = document.getElementById("boton-advertencia-corregir");

            if (btnCorregir) {
                btnCorregir.addEventListener("click", () => {
                    resolve("corregir");
                }, { once: true });
            }

            if (btnAceptar) {
                btnAceptar.addEventListener("click", () => {
                    resolve("aceptar");
                }, { once: true });
            }
        });
    }

    enfocarCampoDocumento() {
        const campo = document.getElementById('numeroDocumento');
        if (campo) campo.focus();
    }

    async mostrarModificacionExitosa(huespedDominio) {
        
        const nombre   = huespedDominio.getNombre();
        const apellido = huespedDominio.getApellido();
        mensajeCorrecto(
            `El huésped<br>${nombre} ${apellido}<br>ha sido modificado correctamente.<br><br>Presione cualquier tecla para continuar...`,
            this.irAPantallaPrincipal
        );
    }

    irAPantallaPrincipal() {
        window.location.href = '/index.html';
    }

    confirmarBorrado(datos) {
        return new Promise((resolve) => {
            const nombre = datos.nombre || '';
            const apellido = datos.apellido || '';
            const tipoDocumento = datos.tipoDocumento || '';
            const numeroDocumento = datos.numeroDocumento || '';

            advertencia(
                `Los datos del huésped <br> ${nombre} ${apellido}, ${tipoDocumento}: ${numeroDocumento} <br> serán eliminados del sistema`,
                "Cancelar",
                "Eliminar"
            );

            const btnCancelar = document.getElementById("boton-advertencia-aceptar");
            const btnEliminar = document.getElementById("boton-advertencia-corregir");

            if (btnCancelar) {
                btnCancelar.addEventListener("click", () => {
                    resolve(false);
                }, { once: true });
            }

            if (btnEliminar) {
                btnEliminar.addEventListener("click", () => {
                    resolve(true);
                }, { once: true });
            }
        });
    }

    async mostrarNoEliminable() {
        mensajeError("El huésped no puede ser eliminado pues se ha alojado en el Hotel en alguna oportunidad. PRESIONE CUALQUIER TECLA PARA CONTINUAR…");
    }

    async mostrarBorradoExitoso(datos) {
        const nombre = datos.nombre || '';
        const apellido = datos.apellido || '';
        const tipoDocumento = datos.tipoDocumento || '';
        const numeroDocumento = datos.numeroDocumento || '';

        mensajeCorrecto(
            `Los datos del huésped <br> ${nombre} ${apellido}, ${tipoDocumento}: ${numeroDocumento}<br> han sido eliminados del sistema. <br><br> PRESIONE CUALQUIER TECLA PARA CONTINUAR…`
        );
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const uiModificarHuesped = new UIModificarHuesped();
    window.uiModificarHuesped = uiModificarHuesped;
});

