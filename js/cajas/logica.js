var g_CAJA = undefined;

async function getCaja(){
    ruta = 'Caja';
    return await getQuery(ruta);
}
/**
 * 1- Actualiza La Variable Global
 * 2- Muestra Los datos de la Caja 
 */
async function initCaja(){ // RECARGAR
    g_CAJA = await getCaja() // Actualizo variable global
    .then((res) =>{
        return res;
    }).catch((error) => {
        return undefined;
    });
    console.log(g_CAJA);
    //abrirCajaCerrar();
    showPanelCaja(); //Hay caja abierta

}

/** 
 * Handle Caja Panel
 ** 
 */
function showPanelCaja(){
    try{
        if(g_CAJA && g_CAJA!=""){ 
            document.getElementById('dinero_inicial').disabled = true;
            document.getElementById('dinero_inicial').value = g_CAJA.dinero_inicial;
            document.getElementById('dinero_total').innerText = "Saldo : $"+ g_CAJA.dinero_total;
            document.getElementById('btnInicializarCaja').innerText='Cerrar Caja';
            document.getElementById('btn_venta').style.display='block';
        }else{//No hay caja
            document.getElementById('dinero_inicial').disabled = false; // Habilito input caja 
            document.getElementById('btnInicializarCaja').innerText='Abrir Caja';
            document.getElementById('btn_venta').style.display='none';
        }
    }catch(e){
        console.log("Tiro un error de que no ha encontrado el elemento por que han llamado el script de otra pantala ... (a menos que posteriormente a este log se modifique y de verdad no lo encuentre")
    }
}
 

function abrirCajaCerrar(){
    let ruta = '';
    debugger;

    if(g_CAJA==undefined || g_CAJA===""){ // Abro caja 
        ruta = 'AbrirCaja?inicial='+document.getElementById("dinero_inicial").value;
        debugger;
        body = {}
 //       body.dinero_inicial = Number(0);
        postQuery(ruta,body)
        .then((res) =>{
            debugger;
            //if(res){
                window.location.reload();
            //}else{
            //    throw new Error('Error al abrir caja. Contacte con el administrador.');
           // }
        })
        .catch(function(reason) {
            console.log(reason);
        }); 
    }else{ // Cierro caja
        ruta = 'CerrarCaja'
        body = {}
        putQuery(ruta,body)
        .then(() => {
            window.location.reload();  
        })
        .catch(function(reason) {
            console.log(reason);
        }); 
    }
    //initCaja(); con el reload ya esta
}

initCaja();