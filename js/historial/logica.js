
  /**
   Armo div de acciones. que se ve de la siguiente manera
   <div class="input-group">
    <a style="margin: 0px 5px 0px 5px;" onclick="eliminarProducto('+producto.id+')" class="btn btn-outline-danger">
      <i class="fas fa-trash"></i>
    </a>
    <a style="margin: 0px 5px 0px 5px;" onclick="modificarProducto('+producto.id+')" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#modalProducto">
    <i class="fa-solid fa-pen-to-square"></i></a>
  </div>

  function armarAcciones(pedidoID){
    return `
    <div class="input-group">
      <input id="select_estado_fabrica" class="form-control w-24" type="text" style="width: 5em"
          placeholder="Frizado" />
      <a style="margin: 0px 5px 0px 5px;" onclick="actualizarEstadoFabrica('${pedidoID}')"
          class="btn btn-outline-success">
          <i class="fas fa-plus"></i>
      </a>
      <input id="select_estado_pago" class="form-control w-24" type="text" style="width: 5em"
          placeholder="Frizado" />
      <a style="margin: 0px 5px 0px 5px;" onclick="actualizarEstadoPago('${pedidoID}')"
          class="btn btn-outline-success">
          <i class="fas fa-plus"></i>
      </a>
    </div>
    `;
  }  */
/** 
        {
        "caja": 1,
        "tipo": "PED",
        "id": 2,
        "cliente_id": 1,
        "metodo_pago": "Efectivo",
        "fecha_entrega": "2022-01-05",
        "fecha_pago": "2022-01-05",
        "total": 200.0,
        "state": "ACTIVO",
        "created_at": "2023-01-05",
        "updated_at": "2023-01-05"
    },
    {
        "caja": 1,
        "tipo": "PED",
        "id": 3,
        "cliente_id": 1,
        "metodo_pago": "Efectivo",
        "fecha_entrega": null,
        "fecha_pago": null,
        "total": 500.0,
        "estado_pedido": "PRODUCCION",
        "estado_pago": "PAGADO",
        "state": "ACTIVO",
        "created_at": "2023-01-05",
        "updated_at": "2023-01-05"
    },
    {
        "caja": 1,
        "tipo": "MOV",
        "id": 1,
        "total": -200.0,
        "descripcion": "EGRESO",
        "state": "ACTIVO",
        "created_at": "2023-01-05",
        "updated_at": "2023-01-05"
    }
ID, TIPO, CLIENTE , FECHA/FECHAPAGO, METODOPAGO/(ingresoooo/egreso)DESC, TOTAL 
*/
function tipoToString(tipo){
    debugger;
    switch(tipo){
        case "SALÓN":
            return "Salon";
        case "DELIVERY":
            return "Delivery";
        case "P/llevar":
            return "Retira en local";
        case "LOCAL":
            return "Local";
    };
}
function getFechaAcorde(transac){
    if(transac.tipo == "PED"){
        return transac.fecha_pago.split('T')[0];;
    }else{
        return transac.created_at.split('T')[0];;
    }
}
function getDescripcionAcorde(transac){
    if(transac.tipo == "MOV"){
        if(Number(transac.total) < 0 ){
            return "Extraccion: " + transac.descripcion;
        }else{
            return "Ingreso: " + transac.descripcion;  
        } 
    }else{
        return transac.metodo_pago;
    }
}
function armarFilasTransacciones(transac){
    filas = [];
    for(i=0; i<transac.length;i++){
      col = []
      col[0] = transac[i].id;
      col[1] = tipoToString(transac[i].tipo);
      col[2] = transac[i].cliente_id != undefined ? transac[i].cliente_id :'';
      col[3] = getFechaAcorde(transac[i]);
      col[4] = getDescripcionAcorde(transac[i]);
      col[5] = transac[i].total;
    //  col[8] = armarAcciones(cajas[i].id);
      filas.push(col);
     // armarAcciones(p.id)
    }
    return filas;
  }	

  
/**
    Armo las filas de productos
*/
function armarFilasCajas(cajas){
    filas = [];
    for(i=0; i<cajas.length;i++){
      col = []
      col[0] = cajas[i].id;
      col[1] = cajas[i].created_at.split('T')[0];
      col[2] = cajas[i].dinero_inicial;
      col[3] = cajas[i].fecha_cierre == undefined ? '' : cajas[i].fecha_cierre.split('T')[0]; ; ;
      col[4] = cajas[i].dinero_total; 
      col[5] = cajas[i].fecha_cierre == undefined ? 'Abierta' : 'Cerrada' ; 
    //  col[8] = armarAcciones(cajas[i].id);
      filas.push(col);
     // armarAcciones(p.id)
    }
    return filas;
  }	



async function getCajaByID(){ 
    let caja = await getCaja()
    .then((res) =>{
        return res;
    })
    .catch((error) =>{
        return undefined;
    });
    if(caja){    
        //console.log(caja);
        let ruta = 'Caja/'+caja.id;
        let transacciones = await getQuery(ruta);
        if(transacciones && transacciones.length > 0){
            table = defaultTableModel("t0_tabla_transacciones","Movimientos de la Caja Abierta",
                                        ["ID","Tipo Transaccion","Cliente","Fecha del pago","Metodo pago/Descripcion","Total"],
                                        armarFilasTransacciones(transacciones),undefined)
            document.getElementById('t0_panelPrincipal').innerHTML=table;
            cambiarPag(1,'t0_tabla_transacciones',8,"t0_btnSig","t0_btnPrev","t0_indicePag");
        }else{
            //alert('No hay movimientos para mostrar');
        }
    }else{
        //alert('No hay una caja activa');
    }
    
}

function renderPanel(tab){
    if(!tab){ // tab 0
        document.getElementById("titulo").innerHTML = "Día de hoy";
        document.getElementById("filtro1").style.display = "none";
        document.getElementById("filtro2").style.display = "none";
        document.getElementById("btn_cargar_transacciones").style.display = "none";
        //document.getElementById("blank").className = "col-xl-5 col-md-5";
        getCajaByID()
    }else{
        document.getElementById("titulo").innerHTML = "Historial";
        document.getElementById("filtro1").style.display = "block";
        document.getElementById("filtro2").style.display = "block";
        document.getElementById("btn_cargar_transacciones").style.display = "block";
        //document.getElementById("blank").className = "col-xl-1 col-md-1";
        cargarCajas();
    }
}

function handleTab(){
    let bot = document.getElementById("tab-caja-historial")
    let list = bot.classList;
    for(i=0; i<list.length;i++){
        if(list[i] == "active"){ // Si esta seleccionada la tabla historial de caja 
            renderPanel(1);
        }else{
            renderPanel(0);
        }
    }

}

function controlCamposFiltros(from, to){
    ok = true;
    if(from!= undefined || to !=undefined){ // Por el momento no son obligatorias
        ok = from!= undefined && to !=undefined; // no puede haber solo una fecha setteada
    }
    return ok;
}

async function cargarCajas(){
    let ruta = 'Cajas';
    let from = document.getElementById('t1_from').value == "" ? undefined : document.getElementById('t1_from').value;
    let to = document.getElementById('t1_to').value == "" ? undefined : document.getElementById('t1_to').value;
    if(controlCamposFiltros(from,to)){ // ¿Los campos estan bien?
        //Armo la ruta
        if(from){//¿Filtra por fecha? 
            ruta += "?from="+from+"&to="+to;
        }
        console.log(ruta); 
        let cajas = await getQuery(ruta);
        if(cajas!=undefined){
            table = defaultTableModel("t1_tabla_cajas","Movimientos de la Caja Actual",
                                    ["ID","Fecha de apertura","Dinero inicial","Fecha de Cierre","Dinero total","Estado"],
                                    armarFilasCajas(cajas),undefined)
            document.getElementById('t1_panelPrincipal').innerHTML=table;
            cambiarPag(1,'t1_tabla_cajas',8,"t1_btnSig","t1_btnPrev","t1_indicePag");
        }else{
          console.log("EFE-Cajas");
        }
    }else
        alert("controle las fechas");    
    }

handleTab();