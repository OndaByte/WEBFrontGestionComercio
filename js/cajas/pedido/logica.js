var g_extraccion = true; // global 
var ItemsPedido = [];
    /**
     * 
     * @param {*} id 
     * @param {*} nombre 
     * @param {*} precio 
     * @param {*} ingredientes 
     * @param {*} booleano true si es para borrar item
     * @param {*} stock stock actual, NOTA descontar localmente el stock cuando se agrega un item
     * @returns 
     */
    function actualizarTablaItemsPedido(id,nombre,precio,ingredientes,booleano,stock){
        let item = {};
        let cantidad = document.getElementById("p_stock"+id).value; // Input de cantidad a vender
        let pos = ItemsPedido.findIndex((obj) => obj.producto_id === id);
        if(booleano){
            ItemsPedido = eliminarPorId(ItemsPedido,id);
        }
        else if(cantidad != 0){
            if(Number(cantidad)>Number(stock)){ 
                window.alert('No hay Stock disponible');
                return;
            }
            if(pos === -1){
                item.producto_id=id;
                item.cantidad= cantidad;
                item.subtotal=cantidad*precio;

                item.nombre=nombre;
                item.precio_venta=precio;
                item.ingredientes_receta=ingredientes;
                item.stock=stock;
                ItemsPedido.push(item);
            }else{ 
                ItemsPedido[pos].cantidad=cantidad;
                ItemsPedido[pos].subtotal=cantidad*ItemsPedido[pos].precio_venta;
            }

        }
        p_escribirTablaItemsPedido(ItemsPedido);
        let precioTotal = 0;
        for(let ob of ItemsPedido){
            precioTotal += ob.subtotal;
        }
        document.getElementById('p_label_total').innerHTML = precioTotal;
    }

    function controlFormPedido(){
        ok = true;
        if(document.getElementById('p_label_cliente').value.split('-')[0]==""){
            ok = false;
        }
        if(Number(document.getElementById('p_label_total').innerHTML)==NaN){
            ok = false;
        }
        if(document.getElementById('p_plazo_entrega').value==""){
            ok = false;
        }
        if(ItemsPedido.length == 0){
            ok = false;
        }
        // p.fecha_pago = document.getElementById('p_fecha_pago').value;
        return ok;
    }

    function armarBody(){
        let p = {};
        p.items = ItemsPedido;
        p.cliente_id = document.getElementById('p_label_cliente').value.split('-')[0]; // ID
        p.metodo_pago = document.getElementById('p_metodo_pago').value;
        p.total = Number(document.getElementById('p_label_total').innerHTML);
        //p.fecha_pago = document.getElementById('p_fecha_pago').value;
        p.plazo_entrega = document.getElementById('p_plazo_entrega').value;
        return p;
    }
/**
 * 
 * NOTA: Ver el envio de datos con FORM DATA 
 * 
 * 
 * @param {*} tipo ('VENTA','PEDIDO')
 * @param {*} estado ('PAGADO','PENDIENTE','','')
 * @param {*} descripcion 'Particular'
 * @param {*} metodo_pago 
 * @param {*} clienteID 
 */
async function nuevoPedido() {
    if(controlFormPedido()){
        let pedido = armarBody();
        console.log(pedido);
        let ruta = 'AltaPedido'
        postQuery(ruta,pedido).then(() => {
            window.location.reload();
        }).catch((error)=>{
            console.log(error);
        });
    }else{
        alert('Controle los campos')
    }    
}
function p_armarAcciones(producto){
    return `
    <div class="input-group">
        <input id="p_stock${producto.id}" class="form-control w-20" type="number" value="0" min="0" max="10000" step="1" style="width: 5em"/>
        <div class="input-group-append">
            <a href="#" onclick="actualizarTablaItemsPedido('${producto.id}','${producto.nombre}','${producto.precio_venta}','${producto.ingredientes_receta}',false,'${producto.stock_actual}')" class="btn btn-outline-success" >
                <i class="fas fa-plus"></i>
            </a>
        </div>
    </div>
    `;
  }
    /**
    Armo las filas de productos
*/
function p_armarFilas(productos){
    filas = [];
    for(i=0; i<productos.length;i++){
      col = []
      col[0] = productos[i].id;
      col[1] = productos[i].nombre;
      col[2] = productos[i].precio_venta;
      col[3] = productos[i].stock_actual; // Si es pedido poner el stock total
      col[4] = p_armarAcciones(productos[i]);
   //   col[4] = productos[i].stock_actual + productos[i].stock_frizado;
      filas.push(col);
      productosMap.set(""+productos[i].id,productos[i]); // Casteo a String pq JS se caga de miedo tanto q se la de de no tipado
    }
    return filas;
  }


function p_habilitarInputsPedido(productos){
    document.getElementById("p_btn_buscador_cliente").disabled = false;
    document.getElementById("p_busqueda_producto").disabled = false;
    document.getElementById("p_metodo_pago").disabled = false;
    document.getElementById("p_plazo_entrega").disabled = false;
    document.getElementById("p_label_total_text").innerText = "Total Pedido: $ ";
    document.getElementById('p_label_total').innerHTML = 0;
    limpiarForm('p_formPedido');
    p_escribirTablaProductos(productos);
    ItemsPedido = [];
    p_escribirTablaItemsPedido(ItemsPedido);

}

function p_armarAccionesItems(item){
    return `
    <div class="input-group">
        <a href="#" onclick="actualizarTablaItemsPedido('${item.producto_id}','',0,'',true,'${item.stock}')" class="btn btn-outline-danger w-100"><i class="fas fa-trash"></i></a>
    </div>
    `;
    }
    /**
    Armo las filas de productos
*/
function p_armarFilasItems(items){
    filas = [];
    for(i=0; i<items.length;i++){
      col = []
      col[0] = items[i].producto_id;
      col[1] = items[i].nombre;
      //col[2] = items[i].precio_venta;
      col[2] = items[i].cantidad; // Si es pedido poner el stock total
      col[3] = items[i].subtotal; // Si es pedido poner el stock total
      col[4] = p_armarAccionesItems(items[i]);
   //   col[5] = productos[i].stock_actual + productos[i].stock_frizado;
      filas.push(col);
     // armarAcciones(p.id)
    }
    return filas;
  }
function p_escribirTablaItemsPedido(items){
    tablaItems = document.getElementById('p_tablaItemsPedido');
    if(tablaItems.childElementCount >0){
        while (tablaItems.hasChildNodes()){
            tablaItems.removeChild(tablaItems.lastChild);
        }
    }
    tabla = defaultTableModel("p_tabla_items","Tabla de Items",["ID","Nombre","Cantidad","Total","Acciones"],p_armarFilasItems(items));
    document.getElementById('p_tablaItemsPedido').insertAdjacentHTML("afterbegin",tabla);
}


async function p_crearPanelPedido(){
    ruta = 'Productos';
    const productos = await getQuery(ruta);
    p_habilitarInputsPedido(productos);
}


function p_escribirTablaProductos(productos){
    tabla = defaultTableModel("p_tabla_productos","Tabla de Productos",["ID","Nombre","Precio","Stock","Cantidad"],p_armarFilas(productos));
    document.getElementById('p_tablaProductos').innerHTML = tabla;
   // cambiarPag(1,'p_tabla_productos',7,"p_btnSig","p_btnPrev","p_indicePag");
}

// MODAL CLIENTE 

/** El boton abre el panel */
async function crearPanelModalCliente(){
    ruta = 'Clientes';
    const clientes = await getQuery(ruta);
    escribirTablaClientes(clientes);

}
function seleccionarCliente(id,nombre){
    document.getElementById('p_label_cliente').value = id + "-" + nombre;
}
function armarAccionesClientes(clienteID,clienteNombre){
    return `
    <div class="input-group">
        <div class="input-group-append">
            <a href="#" onclick="seleccionarCliente('${clienteID}','${clienteNombre}')" class="btn btn-outline-success" data-bs-dismiss="modal">
                <i class="fas fa-plus"></i>
            </a>
        </div>
    </div>
    `;

}

function armarFilasClientes(clientes){
    filas = [];
    for(i=0; i<clientes.length;i++){
      col = []
      col[0] = clientes[i].id;
      col[1] = clientes[i].nombre;
      col[2] = clientes[i].dni;
      col[3] = clientes[i].cuit_cuil;
      col[4] = clientes[i].telefono; // Si es pedido poner el stock total
      col[5] = clientes[i].direccion;
      col[6] = armarAccionesClientes(clientes[i].id,clientes[i].nombre);
   //   col[4] = productos[i].stock_actual + productos[i].stock_frizado;
      filas.push(col);
    //  productosMap.set(""+productos[i].id,productos[i]); // Casteo a String pq JS se caga de miedo tanto q se la de de no tipado
    }
    return filas;
  }
function escribirTablaClientes(clientes){
    tabla = defaultTableModel("tabla_clientes","Tabla de Clientes",["ID","Nombre","DNI","CUIT-CUIL","Telefono","Direccion"],armarFilasClientes(clientes));
    document.getElementById('modal-body-cliente').innerHTML = tabla;
}