
var x = document.getElementById("demo");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this device.";
    }
}
function showPosition(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  console.log(position);
  $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lon+"&key=AIzaSyA5aHL4fkW6IYWiqogkDrRsSNewLXFhJrU", function(data, status){
    var address = data.results[0].formatted_address;
      console.log(address);
    $('.address').html(address);
  });
  x.innerHTML = "<i class='fa fa-map-marker'></i> Mi ubicación: <span class='address'></span><br>Latitud: <b>" + lat.toFixed(4) + 
  "</b> &nbsp;&nbsp;&nbsp;&nbsp;Longitud: <b>" + lon.toFixed(4)+" </b><br> Precisión: "+position.coords.accuracy+" (m)"; 
}


function checkInit() {
  
  var request = indexedDB.open(dbName);

  request.onsuccess = function(event) {
    var db = event.target.result;
    
    var usuario = [];

    var objectStore = db.transaction("usuario").objectStore("usuario");


    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        usuario.push(cursor.value);
        cursor.continue();
      }else{
        console.log(usuario);

        if(usuario.length < 1){

          register();

        }

      }
    }
    

  }
    
  request.onerror = function(event) {
    // Handle errors!
  };


}

function register() {
  console.log("vamo a registrarte");
  iziToast.warning({
      title: 'No haz iniciado sesión',
      position: 'bottomRight',
      message: 'Registra tus datos para continuar.',
  });
  myApp.popup('.popup-login');

}


$(function(){
    console.log("inicia functions.js");
    getLocation();
    // GEO
    // 
    checkInit();


    var count = 0;
    var wordsArray = ["Conectate", "Previene", "Ayuda", "Avisa"];
    setInterval(function () {
      count++;
      $("#changeText").fadeOut(400, function () {
        $(this).text(wordsArray[count % wordsArray.length]).fadeIn(400);
      });
    }, 3000);


    if (!window.indexedDB) {
    window.alert("Su navegador no soporta una versión estable de indexedDB.Tal y como las características no serán validas");
    }else{
      console.log("this works.--.");
    }

  });

// Así se ve nuestra información de clientes.
const customerData = [
  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
];

const dbName = "Desarrollo2";

var request = indexedDB.open(dbName, 3);

request.onerror = function(event) {
  // Manejar errores.
  console.log(event);
};

request.onupgradeneeded = function(event) {
  var db = event.target.result;

  // Se crea un almacén para contener la información de nuestro usuario
  var objectStore = db.createObjectStore("usuario", { keyPath: "telefono" });
  // Se crea un índice para buscar clientes por nombre. Se podrían tener duplicados
  objectStore.createIndex("nombre", "nombre", { unique: false });
  objectStore.createIndex("fecha_nac", "fecha_nac", { unique: false });
  // objectStore.createIndex("telefono", "telefono", { unique: false });
  objectStore.createIndex("padecimientos", "padecimientos", { unique: false });

  // Se usa transaction.oncomplete para asegurarse que la creación del almacén 
  // haya finalizado antes de añadir los datos en el.
  objectStore.transaction.oncomplete = function(event) {
    
    console.log("tabla creada");
    
  }
};

function insertData(formData, table='usuario'){
  
  console.log("insertando....");
  console.log(formData);
  
  var request = indexedDB.open(dbName);
  request.onsuccess = function(event) {
    var db = event.target.result;
    var objectStore = db.transaction(table).objectStore(table);

    objectStore.transaction.oncomplete = function(event) {

      var customerObjectStore = db.transaction(table, "readwrite").objectStore(table);
        for (var i in formData) {
          customerObjectStore.add(formData[i]);

        }
        
        iziToast.success({
            title: 'OK',
            position: 'topRight',
            message: 'Usuario registrado!',
        });

        
        return true;
    }
  } 
}


function update_data(ssn, customerData){
  
  var request = indexedDB.open(dbName);

    request.onsuccess = function(event) {
        var db = event.target.result;

      var objectStore = db.transaction(["customers"], "readwrite").objectStore("customers");
      var request = objectStore.get(ssn);
      request.onerror = function(event) {
        // Handle errors!
      };
      request.onsuccess = function(event) {
        // Get the old value that we want to update
        var data = request.result;
        
        data.name = customerData.name;
        data.email = customerData.email;
        data.age = customerData.age;

        // Put this updated object back into the database.
        var requestUpdate = objectStore.put(data);
         requestUpdate.onerror = function(event) {
           // Do something with the error
           console.log(event);
         };
         requestUpdate.onsuccess = function(event) {
           // Success - the data is updated!
           loadData();
           iziToast.success({
            title: 'OK',
            position: 'topRight',
            message: 'Información del Cliente actualizada!',
        });
         };
      };
    }
}


function loadData(){
  var request = indexedDB.open(dbName);

  $('#tblBody').html('<tr id="spinner"><td colspan="5" class="text-center"> <i class="fa fa-spinner fa-spin fa-fw"></i> Cargando....</td></tr>').fadeIn();
  
  request.onsuccess = function(event) {
      // Success - the data is updated!
      
    var db = event.target.result;

    var customers = [];
    var tblBody = document.getElementById('tblBody');

    var objectStore = db.transaction("customers").objectStore("customers");


    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        customers.push(cursor.value);
        cursor.continue();
      }
      else {
        setTimeout(function() {

        for (var i in customers) {
           var hilera = document.createElement("tr");
           var ssn = document.createElement("td");
           var name = document.createElement("td");
           var age = document.createElement("td");
           var email = document.createElement("td");
           var actions = document.createElement("td");

           var textoSsn = document.createTextNode(customers[i].ssn);
           ssn.appendChild(textoSsn);
           var textoName = document.createTextNode(customers[i].name);
           name.appendChild(textoName);
           var textoAge = document.createTextNode(customers[i].age);
           age.appendChild(textoAge);
           var textoEmail = document.createTextNode(customers[i].email);
           email.appendChild(textoEmail);

           var textoActions = '<button onclick="eliminar('+"'"+customers[i].ssn+"'"+')" class="btn btn-danger btn-xs"><i class="fa fa-trash-o"></i></button>'+
            ' <button onclick="editar('+"'"+customers[i].ssn+"'"+')" class="btn btn-primary btn-xs"><i class="fa fa-pencil"></i></button>';
           actions.innerHTML =textoActions;

           hilera.appendChild(ssn);
           hilera.appendChild(name);
           hilera.appendChild(age);
           hilera.appendChild(email);
           hilera.appendChild(actions);
          
          $('#spinner').fadeOut(5);
          tblBody.appendChild(hilera)
           
        }
        }, 350);
        if(customers.length < 1){
          $('#spinner').fadeOut(300);
          $('#tblBody').html('<tr><td colspan="5" class="text-center">No hay clientes registrados</td></tr>')
          console.log("No hay ");
        }
      }
    };
   };
}

function eliminar( ssn) {
    
  var txt;
  var r = confirm("¿Desea eliminar el cliente con SSN: "+ssn+' ?');
  if (r == true) {
     
      var request = indexedDB.open(dbName);

    request.onsuccess = function(event) {
        var db = event.target.result;

        var request = db.transaction(["customers"], "readwrite")
                  .objectStore("customers")
                  .delete(ssn);
      request.onsuccess = function(event) {
          // alert('Cliente eliminado');
          iziToast.warning({
            title: 'OK',
            position: 'topRight',
            message: 'El Cliente ha sido eliminado!',
        });
        loadData();
      };
    }

  } else {
      txt = "You pressed Cancel!";
  }
}

function send_data(type) {
  var form = document.getElementById("form_data").value;
  ssn = document.getElementById("input_ssn").value;
  name = document.getElementById("input_name").value;
  age = document.getElementById("input_age").value;
  email = document.getElementById("input_email").value;
  var customer = {ssn: ssn, name: name, age:age, email:email};
  
  
  if(type==1){
    var customerData = {customer};
    insertData(customerData);
  }else{
    // ssnAnterior = document.getElementById("input_ssnAnterior").value;
    update_data(ssn, customer);
  }

  $('#myModal').iziModal('close', {
      transition: 'bounceOutDown' // Here transitionOut is the same property.
  });

}

function modalAdd(e) {

  var form = getForm(1);

  $.createModal({
        title: 'Customers | Agregar',
        message: form,
        closeButton:false,
        sizeModal: 'lg'
    });
}

function modalUpdate(e) {
  var form = getForm(2);

  $.createModal({
        title: 'Customers | Editar',
        message: form,
        closeButton:false,
        sizeModal: 'lg'
    });

}

function editar(ssn) {
  
  modalUpdate();
  var data2 = get_data(ssn);

  
}

function cargar_values(data) {
  // var form = document.getElementById("form_data").value;
  
  document.getElementById("input_ssn").value = data.ssn;
  // document.getElementById("input_ssnAnterior").value = data.ssn;
  document.getElementById("input_name").value = data.name;
  document.getElementById("input_age").value = data.age;
  document.getElementById("input_email").value = data.email;
}


function get_data(ssn) {

  var request = indexedDB.open(dbName);
  var data=null;
  request.onsuccess = function(event) {
      var db = event.target.result;

    var objectStore = db.transaction(["customers"], "readwrite").objectStore("customers");
    var request = objectStore.get(ssn);
    request.onerror = function(event) {
      // Handle errors!
    };
    request.onsuccess = function(event) {
      // Get the old value that we want to update
      data = request.result;
      
      cargar_values(data);
    };
  }
}

function getForm(type){

  message = "Registrando"
  if(type == 2)
    message = "Actualizando";
  

  var html = '<div class="col-lg-10 col-lg-offset-1">'+
        '<h4>'+message+' Cliente</h4>'+
          '<div class="hline"></div>'+
          '<br>'+
          '<form role="form" id="form_data">'+
            '<div class="form-group">'+
              '<label for="ssn">SSN:</label>';
              if(type == 2){
                html += '<input type="text" name="ssn" class="form-control" readonly id="input_ssn">';
              }else{
                
              html +='<input type="text" name="ssn" class="form-control" id="input_ssn">';

              }

            html += '</div>'+
            '<div class="form-group">'+
              '<label for="name">Nombre:</label>'+
              '<input type="text" name="name" class="form-control" id="input_name">'+
            '</div>'+
            '<div class="form-group">'+
              '<label for="age">Edad:</label>'+
              '<input type="text" name="age" class="form-control" id="input_age">'+
            '</div>'+
            '<div class="form-group">'+
              '<label for="email">Email:</label>'+
              '<input type="email" name="email" class="form-control" id="input_email">'+
            '</div>'+
            '<button type="button" onclick="send_data('+type+')" class="btn btn-theme">Guardar</button>'+
          '</form><br>'+
          '</div>';
  return html;
}


$('#LoginForm').submit(function(e) {
  e.preventDefault();
  console.log("login button");
  $this = $(this);

  form = $this.serializeArray();

  console.log(form);
  data = [];
  for(i in form){
    usuario = {};
    value = form[i].value;
    name = form[i].name;

    console.log(name);
    console.log(value);

    if(value == "" && name != "padecimientos" ){
      iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'El campo '+name+' es obligatorio',
      }); 
      return false;  
    }
  }
  usuario.nombre = form[0].value;
  usuario.telefono = form[1].value;
  usuario.fecha_nac = form[2].value;
  usuario.padecimientos = form[3].value;
  data.push(usuario);

  insertData(data);

  myApp.closeModal('.popup-login');
});