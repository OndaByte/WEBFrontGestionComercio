    var ItemsVenta = [];
    var stockLocal = {};
    const productosMap = new Map();
    /**
     * @param {*} id 
     * @param {*} nombre 
     * @param {*} precio 
     * @param {*} ingredientes 
     * @param {*} booleano true si es para borrar item
     * @param {*} stock stock actual, NOTA descontar localmente el stock cuando se agrega un item
     * @returns 
     */
    function actualizarTablaItemsVenta(id,nombre,precio,ingredientes,booleano,stock){
        let item = {};
        let cantidad = document.getElementById("stock"+id).value; // Input de cantidad a vender
        let pos = ItemsVenta.findIndex((obj) => obj.producto_id === id);
        if(booleano){
            ItemsVenta = eliminarPorId(ItemsVenta,id);
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
                ItemsVenta.push(item);
            }else{ 
                ItemsVenta[pos].cantidad=cantidad;
                ItemsVenta[pos].subtotal=cantidad*ItemsVenta[pos].precio_venta;
            }

        }
        escribirTablaItemsVenta(ItemsVenta);
        let precioTotal = 0;
        for(let ob of ItemsVenta){
            precioTotal += ob.subtotal;
        }
        document.getElementById('label_total').innerHTML = precioTotal;
    }
    
    function controlFormVenta(){
        ok = true;
        if(Number(document.getElementById('label_total').innerHTML)==NaN){
            ok = false;
        }
        if(Number(document.getElementById('tipo_venta').value)==NaN){
            ok = false;
        } 
        if(ItemsVenta.length == 0){
            ok = false;
        }
        // p.fecha_pago = document.getElementById('p_fecha_pago').value;
        return ok;
    }
    /**
     * ACA SE ENVIA LA VENTA DESDE MODAL    
     * NOTA: Ver el envio de datos con FORM DATA 
     * @param {*} tipo ('VENTA','PEDIDO')
     * @param {*} estado ('PAGADO','PENDIENTE','','')
     * @param {*} descripcion 'Particular'
     * @param {*} metodo_pago 
     * @param {*} clienteID 
     */
async function nuevaVenta() {
    if (ItemsVenta.length != 0) {
        // IF NO CAJA NO VENTA IF NO FORM NO VENTA
        if (controlFormVenta()) {
            //Armo JSON
            let venta = {};
            venta.items = ItemsVenta;

            venta.tipo = document.getElementById('tipo_venta').value;
            venta.metodo_pago = document.getElementById('metodo_pago').value;
            venta.pago = document.getElementById('monto').value; //cambiar por monto
            venta.domicilio = document.getElementById('direccion').value;
            venta.total = Number(document.getElementById('label_total').innerHTML);
            console.log(venta);
            let ruta = 'Venta'
            postQuery(ruta, venta).then(() => {
                window.location.reload();
            }).catch((error) => {
                console.log(error);
            });
        } else {
            alert('Controle los campos');
        }
    } else { 
        alert('Agregue al menos un item');
    }
} 

function habilitarInputsVenta(productos){
      
    //document.getElementById("busqueda_producto").disabled = false;
    //document.getElementById("metodo_pago").disabled = false;
    document.getElementById("label_total_text").innerText = "Total Venta: $ ";
    document.getElementById('label_total').innerHTML = 0;
    limpiarForm('formVenta');
    document.getElementById("fecha_pago").valueAsDate = new Date();
    // Carga la tabla 
    escribirTablaProductos(productos);
    ItemsVenta = [];
    escribirTablaItemsVenta(ItemsVenta);

}

function escribirTablaItemsVenta(items){
    tabla = defaultTableModel("tabla_items","Tabla de Items",["ID","Nombre","Cantidad","Total","Acciones"],armarFilasItems(items));
    document.getElementById('tablaItemsVenta').innerHTML = tabla;
}

/**
    Armo las filas de productos
*/
function armarFilasItems(items){
    filas = [];
    for(i=0; i<items.length;i++){
      col = []
      col[0] = items[i].producto_id;
      col[1] = items[i].nombre;
      col[2] = items[i].cantidad;
      //col[3] = items[i].cantidad; // Si es pedido poner el stock total
      col[3] = items[i].subtotal; // Si es pedido poner el stock total
      col[4] = armarAccionesItems(items[i]);
   //   col[5] = productos[i].stock_actual + productos[i].stock_frizado;
      filas.push(col);
     // armarAcciones(p.id)
    }
    return filas;
  }


function armarAccionesItems(item){
    return `
    <div class="input-group">
        <a href="#" onclick="actualizarTablaItemsVenta('${item.producto_id}','',0,'',true,'${item.stock}')" class="btn btn-outline-danger w-100"><i class="fas fa-trash"></i></a>
    </div>
    `;
    }
    function armarAcciones(producto){
        return `
        <div class="input-group">
            <input id="stock${producto.id}" class="form-control w-20" type="number" value="0" min="0" max="10000" step="1" style="width: 5em"/>
            <div class="input-group-append">
                <a href="#" onclick="actualizarTablaItemsVenta('${producto.id}','${producto.nombre}','${producto.precio_venta}','${producto.ingredientes_receta}',false,'${producto.stock_actual}')" class="btn btn-outline-success" >
                    <i class="fas fa-plus"></i>
                </a>
            </div>
        </div>
        `;
      }
    /**
    Armo las filas de productos
*/
function armarFilas(productos){
    filas = [];
    for(i=0; i<productos.length;i++){
      col = []
      col[0] = productos[i].id;
      col[1] = productos[i].nombre;
      col[2] = productos[i].precio_venta;
      col[3] = productos[i].stock_actual; // Si es pedido poner el stock total
      col[4] = armarAcciones(productos[i]);
   //   col[4] = productos[i].stock_actual + productos[i].stock_frizado;
      filas.push(col);
      productosMap.set(""+productos[i].id,productos[i]); // Casteo a String pq JS se caga de miedo tanto q se la de de no tipado
    }
    return filas;
  }
function escribirTablaProductos(productos){
    tabla = defaultTableModel("tabla_productos","Tabla de Productos",
                            ["ID","Nombre","Precio","Stock","Cantidad"],armarFilas(productos),undefined);
    document.getElementById('tablaProductos').innerHTML = tabla;
 //   cambiarPag(1,'tabla_productos',7);
}


async function crearPanelVenta(){
   // if(g_CAJA){ //Hay caja
        ruta = 'Productos';
        const productos = await getQuery(ruta);
        habilitarInputsVenta(productos);
   // }else{
     //   alert('No puede realizar una Venta sin una caja abierta')
   // }

    
}
crearPanelVenta();