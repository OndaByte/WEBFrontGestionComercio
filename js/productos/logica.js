var modalModificado = false;
var productosArr = [];

window.addEventListener('DOMContentLoaded', event => {
	cargarProductos();

});

function salirModal(){
    if(modalModificado){
        document.getElementById("botonAlta").onclick = function (){agregarProducto()};
        document.getElementById("modalTitulo").innerText='Nuevo Producto';
        modalModificado = false;
    }
    limpiarForm('formProducto')
    cargarProductos();
}

function agregarProducto(){
    altaProducto();
    limpiarForm('formProducto');
    cargarProductos();
}

/*

  Cargar Stock es cuando hago click en la huevada y aparecer la tabla el stock del producto y
  cargo los campos del json

*/

function modificarProducto(id){
    modalModificado = true;
    let producto = productosArr[id];
    let valores = ["id","nombre","precio_costo","precio_venta","ingredientes_receta","stock_actual"];
    
    setCampos(producto);
    document.getElementById("modalTitulo").innerText='Modificar Producto';
    botonAlta = document.getElementById("botonAlta");
    botonAlta.onclick = function(){
        // productosArr[id] = producto
        putQuery('Productos/'+id+'/Modificar',getCampos(producto)).then(() => {
            // debugger;
            window.location.reload();
        })
    }
}

async function actualizarStock(id,cant){
    let ruta = 'Productos/'+id+'/SumarStock?cant='+cant;
    console.log(ruta);
    postQuery(ruta,'').then(() => {
        window.location.reload();
    })
}

async function actualizarStockEmpaquetado(id){
    cant = document.getElementById("stock_empaquetado"+id).value; 
    actualizarStock(id,cant,0);
}
/*
  async function actualizarStockFrizado(id){
  cant = document.getElementById("stock_frizado"+id).value; 
  actualizarStock(id,0,cant);
  }*/

async function cargarProductos(){
    let ruta = 'Productos';
    let responseJSON = await getQuery(ruta);
    if(responseJSON!=undefined){
        productos = responseJSON;
        table = defaultTableModel("tabla_productos","LISTADO PRODUCTOS",["ID","Nombre","Precio costo","Precio","Ingredientes","Stock","Producto ADMIN"],armarFilas(productos),undefined)
        document.getElementById('panelPrincipal').innerHTML=table;
        cambiarPag(1,'tabla_productos',8);
    }else{
        
        console.log("no hay productos");
    }
}

async function eliminarProducto(id) {
    if (!confirm('¿Desea eliminar este producto?')) {
        return;
    }

    let ruta = 'Productos/' + id;
    deleteQuery(ruta).then(() => {
        window.location.reload();
    })
}

async function actualizarStock(id,cant){
    let ruta = 'Productos/'+id+'/SumarStock?cant='+cant;
    console.log(ruta);
    postQuery(ruta,'').then(() => {
        window.location.reload();
    })
}


function setCampos(data){
    document.getElementById("inputProductoName").value=data.nombre;
    document.getElementById("inputProductoCosto").value=data.precio_costo;
    document.getElementById("inputProductoVenta").value=data.precio_venta;
    document.getElementById("inputProductoStock").value=data.stock_actual;
    //  document.getElementById("inputProductoFrizado").value=data.stock_frizado;
    document.getElementById("inputProductoIngredientes").value=data.ingredientes_receta;
}

function getCampos(data){
    data.nombre=document.getElementById("inputProductoName").value;
    data.precio_costo=document.getElementById("inputProductoCosto").value;
    data.precio_venta=document.getElementById("inputProductoVenta").value;
    data.stock_actual=document.getElementById("inputProductoStock").value;
    //  data.stock_frizado=document.getElementById("inputProductoFrizado").value;
    data.ingredientes_receta=document.getElementById("inputProductoIngredientes").value;
    return data;
}

async function altaProducto() {
    let data = getCampos({});
    let ruta = 'Productos/Alta';
    postQuery(ruta,data);
}

/**
   Armo las filas de productos
*/
function armarFilas(productos){
    let filas = [];
    let minFilas = 8;
    
    for(i=0; i<productos.length;i++){
        productosArr[productos[i].id]=productos[i];
        col = []
        col[0] = productos[i].id;
        col[1] = productos[i].nombre;
        col[2] = productos[i].precio_costo;
        col[3] = productos[i].precio_venta;
        col[4] = productos[i].ingredientes_receta;
        col[5] = productos[i].stock_actual;
        //  col[6] = productos[i].stock_frizado;
        //  col[7] = productos[i].stock_actual + productos[i].stock_frizado;
        col[6] = armarAcciones(productos[i].id);
        filas.push(col);
        // armarAcciones(p.id)
    }
    while (filas.length < minFilas) {
        let col = ["-", "-", "-", "-", "-", "-", "-"];
        filas.push(col);
    }
    
    return filas;
}

/**
   Armo div de acciones. que se ve de la siguiente manera
   <div class="input-group">
   <a style="margin: 0px 5px 0px 5px;" onclick="eliminarProducto('+producto.id+')" class="btn btn-outline-danger">
   <i class="fas fa-trash"></i>
   </a>
   <a style="margin: 0px 5px 0px 5px;" onclick="modificarProducto('+producto.id+')" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#modalProducto">
   <i class="fa-solid fa-pen-to-square"></i></a>
   </div>
*/
function armarAcciones(productoID){
    return `
  <div class="input-group">
    <a style="margin: 0px 5px 0px 5px;" onclick="eliminarProducto('${productoID}')" class="btn btn-outline-danger">
      <i class="fas fa-trash"></i>
    </a>
    <a style="margin: 0px 5px 0px 5px;" onclick="modificarProducto('${productoID}')" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#modalProducto">
    <i class="fa-solid fa-pen-to-square"></i></a>
    <input id="stock_empaquetado${productoID}" class="form-control w-24" type="text" style="width: 5em"
        placeholder="Agregar Stock" />
    <a style="margin: 0px 5px 0px 5px;" onclick="actualizarStockEmpaquetado('${productoID}')"
        class="btn btn-outline-success">
        <i class="fas fa-plus"></i>
    </a>

    <!--input id="stock_frizado${productoID}" class="form-control w-24" type="text" style="width: 5em"
        placeholder="Frizado" />
    <a style="margin: 0px 5px 0px 5px;" onclick="actualizarStockFrizado('${productoID}')"
        class="btn btn-outline-success">
        <i class="fas fa-plus"></i>
    </a-->
  </div>
  `;
}
