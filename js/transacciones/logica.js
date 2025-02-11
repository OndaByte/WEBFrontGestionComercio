var SG_suma_total=0;
function tipoToString(tipo){
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
        return transac.fecha_pago != null?transac.fecha_pago.split('T')[0]:'PAGO PENDIENTE';
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
      col[6] = armarAcciones(transac[i].items,transac[i].id);
      filas.push(col);
     SG_suma_total+=transac[i].total;
    }
    return filas;
  }	


function controlCamposFiltros(from, to){
    ok = true;
    if(from!= undefined || to !=undefined){ // Por el momento no son obligatorias
        ok = from!= undefined && to !=undefined; // no puede haber solo una fecha setteada
    }
    return ok;
}

async function cargarTransacciones(){
    let ruta ='Transacciones?';
    let from = document.getElementById('from').value == "" ? undefined : document.getElementById('from').value;
    let to = document.getElementById('to').value == "" ? undefined : document.getElementById('to').value;
    let tipo = document.getElementById('tipo_venta').value == "-1" ? undefined : document.getElementById('tipo_venta').value;
    let pago = document.getElementById('metodo_pago').value == "-1" ? undefined : document.getElementById('metodo_pago').value;
    if(tipo!= undefined){
        ruta +="tipo="+tipo+"&";
    }
    if(pago!=undefined){
        ruta +="pago="+pago+"&";
    }
    
    if(controlCamposFiltros(from,to)){
        if(from){//¿Filtra por fecha? 
            ruta += "&from="+from+"&to="+to;
        }
    }
    debugger;
    let responseJSON = await getQuery(ruta);

    // PONER TRANSACCIONES 
    SG_suma_total=0;
    transacs = responseJSON;
    if(transacs!=undefined){
        table = defaultTableModel("tabla_transacciones","Menú transacciones",
                                ["ID","Tipo Transaccion","Cliente","Fecha del pago","Metodo pago/Descripcion","Total","Transacciones ADMIN"],
                                armarFilasTransacciones(transacs),undefined)
        document.getElementById('panelPrincipal').innerHTML=table;
        cambiarPag(1,'tabla_transacciones',8);
        let parrafo = document.getElementById("sumaTotal");
        parrafo.textContent = "Total : $"+SG_suma_total;
        parrafo.style.textAlign = "right";
        parrafo.style.fontWeight = "bold";
        parrafo.style.fontSize = "42px";
    }else{
        console.log("EFE-Transacciones");
    }
}

async function eliminarTransaccion(id) {
    if (!confirm('¿Desea eliminar esta transacción?')) {
        return;
    }

    let ruta = 'Transacciones/' + id;
    deleteQuery(ruta).then(() => {
        debugger;
        window.location.reload();
    })
}

function salirModal(){
    if(modalModificado){
        document.getElementById("botonAlta").onclick = function (){agregarProducto()};
        document.getElementById("modalTitulo").innerText='Nuevo Producto';
        modalModificado = false;
    }
    limpiarForm('formProducto')
    cargarProductos();
}
/**
 * 
 * @param {cantidad: 1
​​
created_at: "2024-06-22T01:59:49.920+00:00"
​​
id: 1
​​
producto_id: 1
​​
state: "ACTIVO"
​​
subtotal: 213123120
​​
updated_at: "2024-06-22T01:59:49.920+00:00"
​​
venta: 1} items 
 * @returns 
 */
function armarAcciones(items,transaccionID){
    items = encodeURIComponent(JSON.stringify(items)); // Convertimos el objeto a cadena JSON y a Uricomponent pra que no joda el html
    console.log(items);
    return `
    <div class="input-group">

      <button style="margin: 0px 5px 0px 5px;" onclick="cargarDetalleTransacciones('${items}')" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#modalDetalleTransaccion">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
      <button style="margin: 0px 5px 0px 5px;" onclick="eliminarTransaccion('${transaccionID}')" class="btn btn-outline-danger">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    `;
  }


/* 
  DetalleVenta Tabla item venta
*/
function armarFilasDetalleTransacciones(itemVenta){
    filas = [];
    for(i=0; i<itemVenta.length;i++){
      col = []
      col[0] = itemVenta[i].id;
      col[1] = itemVenta[i].producto_nombre;
      col[2] = itemVenta[i].cantidad;
      col[3] = itemVenta[i].precio;
      col[4] = itemVenta[i].subtotal;
      //col[5] = armarAcciones(transac[i].id);
      filas.push(col);
     // armarAcciones(p.id)
    }
    return filas;
  }	


async function cargarDetalleTransacciones(items){
/*
    console.log("Estoy cargando detalles de transacciones{
        "id": 1,
        "created_at": "2024-06-22T01:59:37.218+00:00",
        "updated_at": "2024-06-22T01:59:37.218+00:00",
        "state": "ACTIVO",
        "nombre": "asdasd",
        "precio_costo": 123123,
        "precio_venta": 213123120,
        "stock_actual": 213122,
        "ingredientes_receta": "asdasedasdasd"
    }");
    */
    items = JSON.parse( decodeURIComponent(items) );
    for(i = 0; i< items.length; i++){
            let ruta = 'Productos/'+items[i].producto_id;
            let responseJSON = await getQuery(ruta);
            if(responseJSON!=undefined){
                producto = responseJSON;
                items[i].producto_nombre = producto.nombre; 
                items[i].precio = producto.precio_venta; 
            }else{
                console.log("EFE-Productos");
            }
    }

    if(items!=undefined){
        table = defaultTableModel("tabla_detalleTransacciones","Menú detalle de transacciones",
                                ["ID-item","Nombre Producto","Cantidad","Precio","Subtotal"],
                                armarFilasDetalleTransacciones(items),undefined)
        document.getElementById('panelModalDetalleItemsVenta').innerHTML=table;
        cambiarPag(1,'tabla_detalleTransacciones',8);

    }else{
        console.log("EFE-Transacciones");
    }
}


/* 
  DetalleVenta
*/


cargarTransacciones();
