const clientesMap = new Map();
/**
    Armo las filas de clientes
*/
function armarFilas(clientes){
  filas = [];
  for(i=0; i<clientes.length;i++){
    col = []
    col[0] = clientes[i].id;
    col[1] = clientes[i].nombre;
    col[2] = clientes[i].telefono;
    col[3] = clientes[i].direccion;
    col[4] = clientes[i].dni;
    col[5] = clientes[i].cuit_cuil;
    col[6] = armarAcciones(clientes[i].id);
    filas.push(col);
    clientesMap.set(""+clientes[i].id,clientes[i]); // Casteo a String pq JS se caga de miedo tanto q se la de de no tipado
  }
  return filas;
}

/**
  Armo div de acciones
*/
function armarAcciones(clienteID){
  return `
  <div class="input-group">
    <a style="margin: 0px 5px 0px 5px;" onclick="eliminarCliente('${clienteID}')" class="btn btn-outline-danger">
      <i class="fas fa-trash"></i>
    </a>
    <a style="margin: 0px 5px 0px 5px;" onclick="modificarCliente('${clienteID}')" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#modalCliente">
      <i class="fa-solid fa-pen-to-square"></i>
    </a>
  </div>
  `;
}

async function cargarClientes(){
  let ruta = 'Clientes';
  let responseJSON = await getQuery(ruta);
  if(responseJSON!=undefined){
      clientes = responseJSON;
      table = defaultTableModel("tabla_clientes","Listado de clientes",["ID","Nombre","Teléfono","Dirección","Dni","Cuit-Cuil","Cliente ADMIN"],armarFilas(clientes),undefined)
      document.getElementById('panelPrincipal').innerHTML = table;
      cambiarPag(1,'tabla_clientes',8);

  }else{
    console.log("EFE-Clientes");
  }
}

async function altaCliente(){
  let data = getCampos({});
  let ruta = 'Clientes';
  postQuery(ruta,data).then(() => {
    window.location.reload();
    })
}

async function eliminarCliente(id) {
  if (!confirm('¿Desea eliminar este cliente?')) {
      return;
  }
  let ruta = 'Clientes/' + id;
  deleteQuery(ruta).then(() => {
      window.location.reload();
  })
}

function initModal(alta){
  if(alta){
    document.getElementById("modalTitulo").innerText='Ingresar Cliente';
    document.getElementById("botonAlta").innerHTML="Crear Cliente";
  }else{
    document.getElementById("modalTitulo").innerText='Modificar Cliente';
    document.getElementById("botonAlta").innerHTML="Guardar Cambios";
  }

}

function modificarCliente(id){
  cliente = clientesMap.get(id);
  initModal(false);
  setCampos(cliente);
  botonAlta = document.getElementById("botonAlta");
  botonAlta.onclick = function(){
      postQuery('Clientes/'+id+'/Modificar',getCampos(cliente)).then(() => {
      window.location.reload();
      })
  }
}

function setCampos(data){
  document.getElementById("nombre").value=data.nombre;
  document.getElementById("telefono").value=data.telefono;
  document.getElementById("direccion").value=data.direccion;
  document.getElementById("dni").value=data.dni;
  document.getElementById("cuit_cuil").value=data.cuit_cuil; 
}

function getCampos(data){
  data.nombre=document.getElementById("nombre").value;
  data.telefono=document.getElementById("telefono").value;
  data.direccion=document.getElementById("direccion").value;
  data.dni=document.getElementById("dni").value ;
  data.cuit_cuil=document.getElementById("cuit_cuil").value; 
  return data;
}



function limpiarForm(form){
  document.getElementById(form).reset();
}

/* TUKI */
cargarClientes();
