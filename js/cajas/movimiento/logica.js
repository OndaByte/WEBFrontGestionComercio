var g_extraccion = true; // global 

/**
 * 
 */
async function movimientoCash() {
    if(g_CAJA!=undefined){
        let mov = {};
        // mov.caja_id = document.getElementById('caja_id').value; ID DE LA GAJA CON GET CAJA 
        mov.total = document.getElementById('total_mov').value;
        mov.descripcion = document.getElementById('descripcion_mov').value; // ID    
        if(g_extraccion){
            mov.total = mov.total * -1;
        }else{
            mov.total = mov.total * 1; // para que qde en int
        }
        if(mov.total==0){
            alert('No puede realizar un movimiento de dinero cero')
        }
        console.log(mov)
        let ruta = 'AltaMovimiento'
        postQuery(ruta,mov).then(() => {
            window.location.reload();
        }).catch((error) => {
            console.log(error);
        });
    }else{
        alert('No puede realizar un Movimiento de dinero sin una caja abierta')
    }
}

function limpiarCampos(){
    document.getElementById("total_mov").disabled = true;

    // Reset Form to another change 
}

function setButtonLabel(extraer){
    if(extraer){
        document.getElementById("botonMovimiento").textContent = "Extraer Dinero";
    }else{
        document.getElementById("botonMovimiento").textContent = "Ingresar Dinero";
    }
}
function habilitarInputsMovimiento(extraer){
    g_extraccion = extraer;
    setButtonLabel(extraer);
    document.getElementById("total_mov").disabled = false;
}

/*function crearPanelMovimiento(extraer){
    if(Caja!=undefined){
        habilitarInputsMovimiento(extraer);
    }else{
        alert('No puede realizar un Movimiento de dinero sin una caja abierta')
    }
}*/