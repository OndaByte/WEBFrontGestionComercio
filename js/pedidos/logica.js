
var estados = [undefined,undefined];
/**
`
    <div class="input-group">
      <select id="estado_pedido_${pedidoID}" class="form-control rounded" >
          <option value="produccion">EN PRODUCCION</option>
          <option value="entregado">ENTREGADO</option>
      </select>
      <a style="margin: 0px 5px 0px 5px;" onclick="actualizarEstadoPedido('${pedidoID}')"
          class="btn btn-outline-success">
          <i class="fas fa-plus"></i>
      </a>
      <select id="estado_pago_${pedidoID}" class="form-control w-24" >
          <option value="pendiente">PENDIENTE</option>
          <option value="pagado">PAGADO</option>
      </select>
      <a style="margin: 0px 5px 0px 5px;" onclick="actualizarEstadoPago('${pedidoID}')"
          class="btn btn-outline-success">
          <i class="fas fa-plus"></i>
      </a>
    </div>
    `;
*/
function armarAcciones(pedidoID,fecha_entrega,fecha_pago){
    let estado_entrega;
    let estado_pago;
    if(fecha_entrega){
      estado_entrega = `
      <select id="estado_pedido_${pedidoID}" class="form-control rounded" >
        <option value="entregado">ENTREGADO</option>
      </select>
      <a style="margin: 0px 5px 0px 5px; display:none;" 
          class="btn btn-outline-success">
          <i class="fas fa-plus"></i>
      </a>
      `;
    }else{
        estado_entrega = `
        <select id="estado_pedido_${pedidoID}" class="form-control rounded" >
            <option value="produccion">EN PRODUCCION</option>
            <option value="entregado">ENTREGADO</option>
        </select>
        <a style="margin: 0px 5px 0px 5px;" onclick="actualizarEstadoPedido('${pedidoID}')"
            class="btn btn-outline-success">
            <i class="fas fa-plus"></i>
        </a>
        `; 
    }
    if(fecha_pago){
        estado_pago = `
        <select id="estado_pago_${pedidoID}" class="form-control w-24" >
            <option value="pagado">PAGADO</option>
        </select>
        <a style="margin: 0px 5px 0px 5px; display:none;" 
            class="btn btn-outline-success">
            <i class="fas fa-plus"></i>
        </a>`
    }else{
      estado_pago = `
        <select id="estado_pago_${pedidoID}" class="form-control w-24" >
            <option value="pendiente">PENDIENTE</option>
            <option value="pagado">PAGADO</option>
        </select>
        <a style="margin: 0px 5px 0px 5px;" onclick="actualizarEstadoPago('${pedidoID}')"
            class="btn btn-outline-success">
            <i class="fas fa-plus"></i>
        </a>`
    }



    return `
    <div class="input-group">`
        +estado_entrega
        +estado_pago
    +`</div>
    `;
  }
 

function armarFilas(pedidos){
    filas = [];
    for(i=0; i<pedidos.length;i++){

      col = []
      col[0] = pedidos[i].id;
      col[1] = pedidos[i].cliente_id;
      col[2] = pedidos[i].created_at.split('T')[0];
      col[3] = pedidos[i].metodo_pago;
      col[4] = pedidos[i].plazo_entrega.split('T')[0];
      col[5] = pedidos[i].fecha_entrega?pedidos[i].fecha_entrega.split('T')[0]:'';
      col[6] = pedidos[i].fecha_pago?pedidos[i].fecha_pago.split('T')[0]:'';     
      col[7] = pedidos[i].total;
      col[8] = armarAcciones(pedidos[i].id,pedidos[i].fecha_entrega,pedidos[i].fecha_pago);
      filas.push(col);
     // armarAcciones(p.id)
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

async function cargarPedidos(){
    let ruta ='Pedidos?';
    let from = document.getElementById('from').value == "" ? undefined : document.getElementById('from').value;
    let to = document.getElementById('to').value == "" ? undefined : document.getElementById('to').value;
    if(controlCamposFiltros(from,to)){
        if(from){//¿Filtra por fecha? 
            ruta += "from="+from+"&to="+to+"&";
        }
        if(estados[0]){
            ruta += "estado_pedido="+estados[0]+"&";
        }
        if(estados[1]){
            ruta += "estado_pago="+estados[1]+"&";
        }
    }
    console.log(ruta); 
    let responseJSON = await getQuery(ruta);
    pedidos = responseJSON;
    if(pedidos!=undefined){
        table = defaultTableModel("tabla_pedidos","Menú pedidos",
                                ["ID","ID cliente","Fecha","Forma Pago","A entregar","Fecha de Entrega","Fecha de Pago","Total","Pedido ADMIN"],
                                armarFilas(pedidos),undefined)
        document.getElementById('panelPrincipal').innerHTML=table;
        cambiarPag(1,'tabla_pedidos',8);

    }else{
        console.log("EFE-Pedidos");
    }
}
/**
 * Retorna los 2 estados filtros (estados = var global)
 * @param {*} ID_check ID DEL INPUT-CHECK 
 */
function handleCheckSelected(ID_check){
    let produccion = document.getElementById('produccion')
    let entregado = document.getElementById('entregado')
    let pagado = document.getElementById('pagado')
    let pendiente = document.getElementById('pendiente')
    switch(ID_check){
        case 'produccion':
            entregado.checked = false; 
            if(produccion.checked){// Si esta seleccionado lo desselecciona
                produccion.checked = false;
                estados[0] = undefined;
            }else{
                produccion.checked = true;
                estados[0] = produccion.value;
            }
            break;
        case 'entregado':
            produccion.checked = false; 
            if(entregado.checked){
                entregado.checked = false;
                estados[0] = undefined;
            }else{
                entregado.checked = true;
                estados[0] = entregado.value;
            } 
            break;
        case 'pagado':
            pendiente.checked = false; 
            if(pagado.checked){ 
                pagado.checked = false;
                estados[1] = undefined;
            }else{
                pagado.checked = true;
                estados[1] = pagado.value;
            } 
            break;
        case 'pendiente':
            pagado.checked = false; 
            if(pendiente.checked){ 
                pendiente.checked = false;
                estados[1] = '-';
            }else{
                pendiente.checked = true;
                estados[1] = pendiente.value;
            } 
            break;   
    }
    cargarPedidos();
}
function actualizarEstadoPedido(id){
    //Tomar value del select estado_pedido y hacer un put a la API 
    console.log(    document.getElementById('estado_pedido_'+id).value)

    putQuery('Pedidos/'+id+'/Entregar',{}).then(() => {
        window.location.reload();
        })

}

function actualizarEstadoPago(id){
    //Tomar value del select estado_pedido y hacer un put a la API 
    console.log(    document.getElementById('estado_pago_'+id).value)
    putQuery('Pedidos/'+id+'/Pagar',{}).then(() => {
        window.location.reload();
        })
}

cargarPedidos();
