/*--Tutorial
Realtime Database
productos
--cantidad;
--codigo;
--descripcion;--*/
$(document).ready(function() {
        const config = {
          apiKey: "AIzaSyBbrVhQRmu_Kei0lAUwkZV7yLQ8WZzzPK8",
          authDomain: "productslist-538e3.firebaseapp.com",
          databaseURL: "https://productslist-538e3-default-rtdb.firebaseio.com",
          projectId: "productslist-538e3",
          storageBucket: "productslist-538e3.appspot.com",
          messagingSenderId: "815311969473",
          appId: "1:815311969473:web:6b62bd3ec9fd9a5ec60840"
    };    
    firebase.initializeApp(config); //inicializamos firebase
    
    var filaEliminada; //para capturara la fila eliminada
    var filaEditada; //para capturara la fila editada o actualizada

    //creamos constantes para los iconos editar y borrar    
    const iconoEditar = '<svg class="bi bi-pencil-square" width="22px" height="22px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
    const iconoBorrar = '<svg class="bi bi-trash" width="22px" height="22px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';

    var db = firebase.database();
    var coleccionProductos = db.ref().child("productos");
         
    var dataSet = [];//array para guardar los valores de los campos inputs del form
    var table = $('#tablaProductos').DataTable({
                pageLength : 5,
                lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
                data: dataSet,
                columnDefs: [
                    {
                        targets: [0], 
                        visible: false, //ocultamos la columna de ID que es la [0]                        
                    },
                    {
                        targets: -1,        
                        defaultContent: "<div class='wrapper text-center'><div class='container><div class='btn-group'><button class='btnEditar' data-toggle='tooltip' title='Edit'>"+iconoEditar+"</button><button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Delete'>"+iconoBorrar+"</button></div></div>"
                    }
                ]      
            });

    coleccionProductos.on("child_added", datos => {        
        dataSet = [datos.key, datos.child("codigo").val(), datos.child("descripcion").val(), datos.child("cantidad").val()];
        table.rows.add([dataSet]).draw();
    });
    coleccionProductos.on('child_changed', datos => {           
        dataSet = [datos.key, datos.child("codigo").val(), datos.child("descripcion").val(), datos.child("cantidad").val()];
        table.row(filaEditada).data(dataSet).draw();
    });
    coleccionProductos.on("child_removed", function() {
        table.row(filaEliminada.parents('tr')).remove().draw();                     
    });
          
    $('form').submit(function(e){                         
        e.preventDefault();
        let id = $.trim($('#id').val());        
        let codigo = $.trim($('#codigo').val());/*--firebase sados --*/
        let descripcion = $.trim($('#descripcion').val());    /*--firebase sados --*/      
        let cantidad = $.trim($('#cantidad').val());         /*--firebase sados --*/                
        let idFirebase = id;        
        if (idFirebase == ''){                      
            idFirebase = coleccionProductos.push().key;
        };                
        data = {codigo:codigo, descripcion:descripcion, cantidad:cantidad};             
        actualizacionData = {};
        actualizacionData[`/${idFirebase}`] = data;
        coleccionProductos.update(actualizacionData);
        id = '';        
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('hide');
    });

    //Botones
    $('#btnNuevo').click(function() {
        $('#id').val('');        
        $('#codigo').val('');
        $('#descripcion').val('');         
        $('#cantidad').val('');      
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('show');
    });        

    $("#tablaProductos").on("click", ".btnEditar", function() {    
        filaEditada = table.row($(this).parents('tr'));           
        let fila = $('#tablaProductos').dataTable().fnGetData($(this).closest('tr'));               
        let id = fila[0];
        console.log(id);
            let codigo = $(this).closest('tr').find('td:eq(0)').text(); 
        let descripcion = $(this).closest('tr').find('td:eq(1)').text();        
        let cantidad = parseInt($(this).closest('tr').find('td:eq(2)').text());        
        $('#id').val(id);        
        $('#codigo').val(codigo);
        $('#descripcion').val(descripcion);                
        $('#cantidad').val(cantidad);                
        $('#modalAltaEdicion').modal('show');
    });  
  
    $("#tablaProductos").on("click", ".btnBorrar", function() {   
        filaEliminada = $(this);
        Swal.fire({
        title: 'Are you sure you want to remove the product?',
        text: "This operation cannot be reversed!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#cf2727',
        cancelButtonColor: '#02577A',
        confirmButtonText: 'Delete'
        }).then((result) => {
        if (result.value) {
            let fila = $('#tablaProductos').dataTable().fnGetData($(this).closest('tr'));            
            let id = fila[0];            
            db.ref(`productos/${id}`).remove()
            Swal.fire('Removed!', 'The product has been removed.','Success')
        }
        })        
    });  

});