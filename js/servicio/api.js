const API_HOST = 'http://127.0.0.1:4567/';// 'http://192.168.1.107:8888/';
/**
 * El buen java swing <3
 *
 * @param {*} icon para ponerle iconito personalizado,
 * @param {""} nombre titulo de la tabla
 * @param {[]} columnas nombres de las columnas
 * @param {[]} filas los valores de las filas
 * @returns
 */
function defaultTableModel(id_tabla, nombre_panel, columnas, filas, icon = 'fa-table') {
  const conteiner = `
    <div class="card mb-4">
      <div class="card-header bg-primary">
        <i class="fas ${icon} me-1"></i>
        ${nombre_panel}
      </div>
      <div class="card-body">
        <table id="${id_tabla}" class="table table-striped">`;
  const cierreConteiner = `
        </table>
      </div>
    </div>`;

  let tableHead = `
    <thead>
      <tr>`;
  for (col of columnas) {
    tableHead += `
        <th>${col}</th>
      `;
  };
  tableHead += `
      </tr>
    </thead>`;
  let tableBody = `
    <tbody>`;

  for (fil of filas) {
    tableBody += `<tr id="producto${fil[0]}">`;
    for (let i = 0; i < fil.length; i++) {
      tableBody += `
                <td>${fil[i]}</td>
              `;
    }
    tableBody += `</tr>`;
  }
  tableBody += `</tbody>`;
  divTabla = conteiner + tableHead + tableBody + cierreConteiner;
  return divTabla;
}

function cambiarPag(pagina, idtabla, filasPag,btnSig="btnSig",btnPrev="btnPrev",indicePag="indicePag") {
  var btnSig = document.getElementById(btnSig);
  var btnPrev = document.getElementById(btnPrev);
  var tabla = document.getElementById(idtabla);
  var pagIndice = document.getElementById(indicePag);
  var l = document.getElementById(idtabla).rows.length
  let cantPag = Math.ceil((l - 1) / filasPag);
  // Validate pagina
  if (pagina < 1) pagina = 1;
  if (pagina > cantPag) pagina = cantPag;
  [...tabla.getElementsByTagName('tr')].forEach((tr) => {
    tr.style.display = 'none';
  });
  tabla.rows[0].style.display = "";
  for (var i = (pagina - 1) * filasPag + 1; i < (pagina * filasPag) + 1; i++) {
    if (tabla.rows[i]) {
      tabla.rows[i].style.display = ""
    } else {
      continue;
    }
  }
  pagIndice.innerHTML = pagina + "/" + cantPag;
  if (pagina == 1) {
    btnPrev.disabled = true;
  } else {
    btnPrev.disabled = false;
    btnPrev.onclick = function () {
      if (pagina > 1) {
        pagina--;
        cambiarPag(pagina, idtabla, filasPag);
      }
    }
  }
  if (pagina == cantPag) {
    btnSig.disabled = true;
  } else {
    btnSig.disabled = false;
    btnSig.onclick = function () {
      if (pagina < cantPag) {
        pagina++;
        cambiarPag(pagina, idtabla, filasPag);
      }
    }
  }
}

function filtrarTabla(busqueda, tabla) {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById(busqueda);
  filter = input.value.toUpperCase();
  table = document.getElementById(tabla);
  tr = table.getElementsByTagName("tr");

  for (i = 1; i < tr.length; i++) {
    tr[i].style.display = "none";
    td = tr[i].getElementsByTagName("td");
    for (var j = 0; j < td.length; j++) {
      cell = tr[i].getElementsByTagName("td")[j];
      if (cell) {
        if (cell.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break;
        }
      }
    }
  }
}

function limpiarForm(form) {
  document.getElementById(form).reset();
}

function eliminarPorId(arr, id) {
  const objeto = arr.findIndex((obj) => obj.id === id);
  arr.splice(objeto, 1);
  return arr;
}

async function deleteQuery(ruta) {
  let responseJSON = fetch(API_HOST + ruta, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return handleResponse(response.status, response);
    //return response.json(); //Retorno como JSON los datos de la API

  }).catch(function (reason) {
    console.log(reason); // Informar error, mucho no se puede hacer
    return undefined;
  });

  return responseJSON;
}

async function postQuery(ruta, data) {
  let responseJSON = await fetch(API_HOST + ruta, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(function (response) {
    return handleResponse(response.status, response);
    //return response.json(); //Retorno como JSON los datos de la API

  }).catch(function (reason) {
    console.log(reason); // Informar error, mucho no se puede hacer
    return undefined;
  });

  return responseJSON;
}

async function putQuery(ruta, data) {
  let responseJSON = await fetch(API_HOST + ruta, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(function (response) {
    return handleResponse(response.status, response);
    //return response.json(); //Retorno como JSON los datos de la API
  }).catch(function (reason) {
    console.log(reason); // Informar error, mucho no se puede hacer
    return undefined;
  });

  return responseJSON;
}

async function getQuery(ruta) {
  let responseJSON = await fetch(API_HOST + ruta, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      // 'Acept': '*/*'
      //'Content-Type': 'application/json'
    }
  }).then(function (res) {
    return handleResponse(res.status, res);
    //return response.json(); //Retorno como JSON los datos de la API

  }).catch(function (reason) {
    console.log(reason); // Informar error, mucho no se puede hacer
    return undefined;
  });
  return responseJSON;
}

async function parseJsonResponse(response) {
  let body;
  try {
    body = await response.text();
    // Attempt to parse body as JSON
    const jsonData = JSON.parse(body);
    console.log("Parsed JSON:", jsonData);
    return jsonData;
  } catch (e) {
    console.log("Failed to parse JSON:", e);
    console.log("Returning body as plain text:", body);
    debugger;
    return body;
  }
}

function handleResponse(code, response) {
  switch (code) {
    case 200:
      console.log("200-OK");
      return parseJsonResponse(response);  // This returns a promise but is handled asynchronously
      //   alert("Exito! \n" + response.message);
      //  document.getElementById(response.error);
      // location.reload();
      break;
    case 201:
      console.log("201");
      break;
    case 208:
      console.log("208-OK");
      return parseJsonResponse(response);  // This returns a promise but is handled asynchronously
      //   alert("Exito! \n" + response.message);
      //  document.getElementById(response.error);
      // location.reload();
      break;
    case 404:
      console.log("404-NOT");
      //alert("Error 404! \nNo se ha encontrado lo solicitado.");
      return undefined;
      break;
    case 422:
      console.log("422-INVALID FORM");
      //   var errores = response.errors;
      //  marcarErrores(errores);
      return undefined;
      break;
    default:
      console.log("DEFAULT");
      return undefined;
  }
}

function controlInput(idElem,num){
  let elem = document.getElementById(idElem);
  if(num){
    //expr
    elem.value=elem.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
  }else{
    elem.value=elem.value.replace(/[^A-Za-z .]/g, '').replace(/(\..*?)\..*/g, '$1');
  }
}
async function closeSystem(){
  console.log("Cerrandin");debugger;
  /*
  let responseJSON = await getQuery('Cerrar');
  open(location, '_self').close();
  */
}
