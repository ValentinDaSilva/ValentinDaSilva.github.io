// JS/gestor-buscar-huesped.js
import { GestorHuesped } from "/Clases/Dominio/GestorHuesped.js";

class UIBuscarHuesped {

    // -----------------------------------------
    // LEER CRITERIOS
    // -----------------------------------------
    static extraerCriteriosBusqueda() {
        return {
            apellido: document.getElementById("apellido").value.trim(),
            nombre: document.getElementById("nombre").value.trim(),
            tipoDocumento: document.getElementById("tipoDocumento").value.trim(),
            numeroDocumento: document.getElementById("numeroDocumento").value.trim()
        };
    }

    // -----------------------------------------
    // MOSTRAR RESULTADOS
    // -----------------------------------------
    static mostrarResultados(lista) {
        const tbody = document.querySelector(".tabla-resultados tbody");
        tbody.innerHTML = "";

        if (!lista || lista.length === 0) {
            const fila = document.createElement("tr");
            const celda = document.createElement("td");
            celda.colSpan = 4;
            celda.textContent = "No se encontraron coincidencias";
            celda.style.textAlign = "center";
            fila.appendChild(celda);
            tbody.appendChild(fila);
            return;
        }

        lista.forEach(h => {
            const fila = document.createElement("tr");

            const tdApe = document.createElement("td");
            tdApe.textContent = h.apellido;

            const tdNom = document.createElement("td");
            tdNom.textContent = h.nombre;

            const tdTipo = document.createElement("td");
            tdTipo.textContent = h.tipoDocumento;

            const tdNum = document.createElement("td");
            tdNum.textContent = h.numeroDocumento || h.nroDocumento;

            fila.appendChild(tdApe);
            fila.appendChild(tdNom);
            fila.appendChild(tdTipo);
            fila.appendChild(tdNum);

            fila.dataset.huesped = JSON.stringify(h);

            fila.addEventListener("click", () => {
                UIBuscarHuesped.marcarSeleccion(fila);
            });

            tbody.appendChild(fila);
        });
    }

    static marcarSeleccion(fila) {
        document.querySelectorAll(".tabla-resultados tbody tr").forEach(f => {
            f.classList.remove("fila-seleccionada");
            f.style.backgroundColor = "";
        });

        fila.classList.add("fila-seleccionada");
        fila.style.backgroundColor = "yellow";
    }

    static mostrarSeccionResultados() {
        document.querySelector(".contenedor-resultados").style.display = "block";
        document.querySelector(".contenedor-principal").style.width = "40vw";
    }

    // -----------------------------------------
    // SELECCIÓN
    // -----------------------------------------
    static devolverSeleccion() {
        const fila = document.querySelector(".fila-seleccionada");
        if (!fila) return null;
        return JSON.parse(fila.dataset.huesped);
    }

    // -----------------------------------------
    // MODALES para el DIAGRAMA
    // -----------------------------------------
    static async mostrarSinResultadosYOfrecerAlta() {
        pregunta(
            "No se encontraron huéspedes.\n¿Desea dar de alta uno nuevo?",
            "SI",
            "NO",
            () => UIBuscarHuesped.irAPantallaAlta(),
            () => {}
        );
    }

    static mostrarErrorBusqueda(msg) {
        pregunta(
            msg,
            "OK",
            "CERRAR",
            () => {},
            () => {}
        );
    }

    static irAPantallaAlta() {
        window.location.href = "../AltaHuesped/altaHuesped.html";
    }

    static irAPantallaModificar(huesped) {
        sessionStorage.setItem("huespedSeleccionado", JSON.stringify(huesped));
        window.location.href = "../ModificarHuesped/modificarHuesped.html";
    }

    // -----------------------------------------
    // INICIALIZAR
    // -----------------------------------------
    static inicializar() {
        const form = document.getElementById("form-buscar-huesped");
        const botonSiguiente = document.querySelector(".boton-siguiente");

        // SUBMIT
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            let ok = true;
            if (typeof validarTodosLosCampos === "function") {
                ok = validarTodosLosCampos();
            }

            if (!ok) return;

            const criterios = UIBuscarHuesped.extraerCriteriosBusqueda();
            await GestorHuesped.buscarHuesped(criterios, UIBuscarHuesped);
        });

        // SIGUIENTE
        botonSiguiente.addEventListener("click", () => {
            const seleccion = UIBuscarHuesped.devolverSeleccion();
            GestorHuesped.procesarSeleccion(seleccion, UIBuscarHuesped);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    UIBuscarHuesped.inicializar();
});

export { UIBuscarHuesped };
