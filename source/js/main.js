// const {iniciarSession} = require('../js/sqlLiteManager');
// const cargando = document.getElementById('cargando');
const inputUsername = select('username');
const inputPassword = select('password');
const containerLogIn  = select('container__log-in');
const tableCrud = select('container-crud');
const btnLogIn = select('btn-log-in');
const alertPassword = $('#alert-password');
const containerFormPrestarLibro = $('#form-prestar-libro');
$('#alert-guardado').hide();
alertPassword.toggle();

let isInDarkList = false;
// setTimeout(()=>{
//     cargando.style.display = 'none';
//     containerLogIn.style.display = 'flex';
// }, 1000 * 3);


const username = "admin";
const password = "admin123";


function select(id) {
    return document.getElementById(id);
}

let dataOfPrestamos;
btnLogIn.addEventListener('click', ()=>{

    const dataSession = {
        username: inputUsername.value,
        password: inputPassword.value
    }
    window.api.iniciarSession(dataSession, (row, isLoggin)=>{
        if(isLoggin){
            containerLogIn.style.display = 'none';
            window.api.obtenerPrestados((row, isTrue)=>{
               if(isTrue && row !== null) {
                    row.forEach((data)=>{
                        console.log(data);

                        addDataToTable(data);
                    })
                    dataOfPrestamos = row;
                    $('#form-prestar-libro').css('display', 'flex');
                    tableCrud.style.display = 'flex';
                    containerFormPrestarLibro.toggle();
               }else{
                   tableCrud.style.display = 'flex';
               }
            })
        }else{
            alertPassword.fadeToggle();
            setTimeout(()=>{
                alertPassword.fadeToggle();
            }, 1000 * 3);
        };
    });
});



// fetch('../data.json').then(data => data.json()).then(data=>{
//     console.log(data);
// })

//-------------------------

//-------------------------------------------------------
const cursos = {
        paralelos : ["A", "B", "C", "D"],
        especialidad : ["NINGUNA", "INFORMÁTICA", "CONTABILIDAD", "BGU"],
        cursos : ["OCTAVO","NOVENO","DÉCIMO","PRIMERO","SEGUNDO","TERCERO"]
        }

//---------------------------------------------




$('#btn-prestar-libro').on('click', ()=>{
    $('.container__mas-opciones').hide();
    containerFormPrestarLibro.toggle();
})


$('#btn-cancelar-prestar-libro').on('click', ()=>{
    containerFormPrestarLibro.toggle();
});


function addDataToTable(data){
    const dataItem = $('<tr></tr>');
    const tdNombre = $(`<td>${data.NOMBRE_ETS}</td>`);
    const tdCurso =  $(`<td>${data.CURSO}</td>`);
    const tdFechaPrestado =  $(`<td>${data.FECHA_PRESTADO}</td>`);
    const tdFechaEntrega =  $(`<td>${data.FECHA_ENTREGA}</td>`);
    const tdDiasFaltantes =  $(`<td>${data.DIAS_FALTANTES}</td>`);
    const tdNombreLibro = $(`<td>${data.NOMBRE_LIBRO}</td>`);
    const btnRecogido = $(`<button class="btn btn-success btn-prestamo"><img class="check-ico" src="./img/check-circle.svg"></button>`);
    const btnMasOpciones = $(`<button class="btn btn-primary btn-prestamo btn-mas-opciones"><img class="check-ico" src="./img/three-dots.svg"></button>`);
    const divBtnMasOpciones = $('<div class="container__mas-opciones"></div>');
    const btnMasDias = $(`<button class="btn btn-warning mb-1 btn-mas-dias">Editar Fecha</button>`);
    const btnAddBlackList = $(`<button class="btn btn-dark">Add black-list</button>`);
    const divMasDias = $(`
    <div class="form-group container__agregar-mas-dias">
    </div>`);
    const inputUpDate = $('<input class="form-control" type="date">');
    const btnActualizarDate = $('<button class="btn btn-success" id="">Confirmar cambio</button>');
    divBtnMasOpciones.toggle();
    divMasDias.append(inputUpDate);
    divMasDias.append(btnActualizarDate);
    divMasDias.toggle();
    divBtnMasOpciones.append(btnMasDias);
    divBtnMasOpciones.append(divMasDias);
    divBtnMasOpciones.append(btnAddBlackList);
    const crudBtns =  $(`<td class="crud-btn-container"></td>`);
    crudBtns.append(btnRecogido);
    crudBtns.append(btnMasOpciones);
    crudBtns.append(divBtnMasOpciones);
    dataItem.append(tdNombre);
    dataItem.append(tdNombreLibro);
    dataItem.append(tdCurso);
    dataItem.append(tdFechaPrestado);
    dataItem.append(tdFechaEntrega);
    dataItem.append(tdDiasFaltantes);
    dataItem.append(crudBtns);
    inputUpDate.val(data.FECHA_ENTREGA);
    const diasFaltantes = data.DIAS_FALTANTES;
    if(diasFaltantes <= 0) tdDiasFaltantes.css('background-color', 'red');
    else if(diasFaltantes <= 4 && diasFaltantes >= 1) tdDiasFaltantes.css('background-color', 'rgb(255, 255, 74)');
    else tdDiasFaltantes.css('background-color', 'rgb(146, 255, 103)');
    $('#data-prestados').append(dataItem);
    btnRecogido.on('click', ()=> {
        window.api.deletePrestadosById(data.ID);
        dataItem.remove();
        const play = new Audio('./audio/campana.wav');
        play.play();
    });

    btnMasOpciones.on('click', ()=>{
        divBtnMasOpciones.slideToggle();
    })

    btnMasDias.on('click', ()=>{
        divMasDias.slideToggle();
    });

    btnActualizarDate.on('click', ()=>{
        if(inputUpDate.val() != '')
        {
            window.api.updateDate({id: data.ID, dateUpdated: inputUpDate.val()}, (isOk)=>{
                if(isOk)
                {
                    $('#data-prestados').empty();
                    window.api.obtenerPrestados((row, isTrue)=>{
                        if(isTrue) {
                             row.forEach((data)=>{
                                 console.log(data);
                                 addDataToTable(data);
                             });
                        }
                     });
                     $('#alert-guardado').fadeToggle();
                     setTimeout(()=>{
                         $('#alert-guardado').fadeToggle();
                    }, 1000 * 2);
                }
            });
        }
    });
    btnAddBlackList.on('click', ()=>{
        window.api.addOrRemoveBlackList({
            id: data.ID,
            setDark: 1
        }, (isOk)=>{
            if(isOk)
            {
                $('#data-prestados').empty();
                window.api.obtenerPrestados((row, isTrue)=>{
                    if(isTrue) {
                         row.forEach((data)=>{
                             console.log(data);
                             addDataToTable(data);
                         });
                    }
                 })
            }
        })
    })
}


addOpcionesToContainer(cursos);

//-----------VARIABLE PARA SELECIONAR CURSO--------------
//------------------------
function addOpcionesToContainer(cursos)
{
    $('#alert-campos-vacios').fadeToggle();
    const diaActualInput = select('input-dia-prestado');
    putTheActualDate(diaActualInput);
    const inputCursoContainer = $('#input-curso-container');
    const curso = addOpciones(cursos.cursos, inputCursoContainer);
    const paralelos = addOpciones(cursos.paralelos, inputCursoContainer);
    const especialidad = addOpciones(cursos.especialidad, inputCursoContainer);
    $('#btn-agregar-new-prestamo').on('click', ()=>{
        let cursoJoined = '';
        let inputNombreValue = select('input-nombre');
        let inputNombreLibroValue = select('input-nombre-libro');
        let inputDiaEntregaValue = select('input-dia-entregar');
        if(especialidad.val() != 'NINGUNA') {
            cursoJoined = `${curso.val()} ${ paralelos.val()} ${especialidad.val()}`;
        }
        else cursoJoined = `${curso.val()} ${ paralelos.val()}`;
        if(inputNombre.value.trim() !== '' && inputNombreLibroValue.value.trim() !== '' && diaActualInput.value.trim() !== '' && inputDiaEntregaValue.value.trim() !== '')
        {
            const nuevoPrestamoData = {
                nombre_ets: inputNombreValue.value.toUpperCase(),
                curso: cursoJoined.toUpperCase(),
                diaActual : diaActualInput.value,
                diaEntregar : inputDiaEntregaValue.value,
                nombreLibro : inputNombreLibroValue.value.toUpperCase()
            }
            window.api.registrarPrestamo(nuevoPrestamoData, (isOk)=>{
                if(isOk) {
                    $('#data-prestados').empty();
                    window.api.obtenerPrestados((row, isTrue)=>{
                        if(isTrue) {
                             row.forEach((data)=>{
                                 console.log(data);
                                 addDataToTable(data);
                             });
                             inputDiaEntregaValue.value = '';
                             inputNombreValue.value = '';
                             inputNombreLibroValue.value = '';
                             containerFormPrestarLibro.toggle();
                        }
                     })
                }
            })
        }else{
            $('#alert-campos-vacios').fadeToggle();
            setTimeout(()=>{
                $('#alert-campos-vacios').fadeToggle();
            }, 1000 * 2)
        }
    });
}

function removeAndAddData(container, data)
{
    container.empty();
    data.forEach(dataPerson=>{
        addDataToTable(dataPerson);
    })
}
function addOpciones(datos, inputCursoContainer)
{
    const optionCurso = $(`<select class="option-select__curso"></select>`);
    datos.forEach((data)=>{
        const option = $(`<option>${data}</option>`);
        option.value = data;
        optionCurso.append(option);
    });
    inputCursoContainer.append(optionCurso);
    // optionCurso.on('click', ()=>{
    //    console.log(optionCurso.val()); 
    // });
    return optionCurso;
}
$('btn-agregar-new-prestamo').on('click', ()=>{
});




//-------------FORMULARIO PARA PRESTAR MAS LIBROS----------------------------

//----Declaración de variables y constantes del form-------

const inputNombre = select('input-nombre');


function putTheActualDate(inputDate)
{
    const diaActual = new Date();
    let dia = diaActual.getDate();
    let mes = diaActual.getMonth() + 1;
    let year = diaActual.getFullYear();
    if(dia<10)
    dia='0'+dia; //agrega cero si el menor de 10
    if(mes<10)
    mes='0'+mes //agrega cero si el menor de 10
    let fechaDeHoy = `${year}-${mes}-${dia}`;
    inputDate.value = fechaDeHoy;
}

let result;
//--------------INPUT BUSCADOR CÓDIGO--------------------
const inputBuscador = $('#input-buscador');
inputBuscador.on('keyup', ()=>{
    const valorBuscador = inputBuscador.val().toUpperCase();
    // if(dataOfPrestamos.length != 0){
    //     let resultado = dataOfPrestamos.filter(data => data.NOMBRE_ETS.includes(valorBuscador));
    //     if(resultado.length != 0) removeAndAddData($('#data-prestados'), resultado);
    //     console.log(dataOfPrestamos, valorBuscador, resultado);
    // }else{
    //     console.log('aaaaa no hay nada')
    // }  

    if(isInDarkList)
    {
        window.api.obtenerPrestadosDark((row, isTrue)=>{
            if(isTrue) {
                if(row.length != 0){
    
                    let resultado = row.filter(data => data.NOMBRE_ETS.includes(valorBuscador));
                    console.log(resultado.length);
                    if(resultado.length != 0) removeAndAddData($('#data-prestados'), resultado);
                }else removeAndAddData($('#data-prestados'), row);
                
            }  
        })
    }else{
        window.api.obtenerPrestados((row, isTrue)=>{
            if(isTrue) {
                if(row.length != 0){
    
                    let resultado = row.filter(data => data.NOMBRE_ETS.includes(valorBuscador));
                    console.log(resultado.length);
                    if(resultado.length != 0) removeAndAddData($('#data-prestados'), resultado);
                }else removeAndAddData($('#data-prestados'), row);
                
            }  
        })
    }
});


//----cambiar contraseña logic------------------
$('#btn-open-change-password-container').on('click', ()=>{
    $('#container__change-password').css('display', 'flex');
});
$('#btn-cancelar-cambiar-password').on('click', ()=>{
    $('#container__change-password').css('display', 'none');
});

const alertChangePassword = $('#alert-change-password');
alertChangePassword.fadeToggle();

$('#btn-cambiar-password').on('click', ()=>{
    const usernameChangePassword = select('username-change-password');
    const oldPasswordChangePassword = select('old-password-change-password');
    const newPasswordChangePassword = select('new-password-change-password');
    const repeatNewPasswordChangePassword = select('repeat-new-password-change-password');
    const dataSession = {
        username: usernameChangePassword.value,
        password: oldPasswordChangePassword.value
    }
    window.api.iniciarSession(dataSession, (row, isLoggin)=>{
        if(isLoggin && (newPasswordChangePassword.value === repeatNewPasswordChangePassword.value)){
            window.api.chagePassword({
                username: usernameChangePassword.value,
                newPassword: newPasswordChangePassword.value
            }, (isOk)=>{
                if(isOk) $('#container__change-password').css('display', 'none');
            })
        }
        else{
            alertChangePassword.fadeToggle();
            setTimeout(()=>{
                alertChangePassword.fadeToggle();
            }, 1000 * 3);
        }
    });
});


$('#lista-prestados-btn').on('click', ()=>{
    isInDarkList = false;
    $('#data-prestados').empty();
    $('#lista-title').text('Lista Normal');
    $('#lista-title').css('color', '#0000ff');
    window.api.obtenerPrestados((row, isTrue)=>{
        if(isTrue) {
             row.forEach((data)=>{
                 console.log(data);
                 addDataToTable(data);
             });
        }
     })
});

$('#lista-dark-btn').on('click', ()=>{
    isInDarkList = true;
    $('#data-prestados').empty();
    $('#lista-title').text('Lista Negra');
    $('#lista-title').css('color', '#000');
    window.api.obtenerPrestadosDark((row, isTrue)=>{
        if(isTrue) {
             row.forEach((data)=>{
                 console.log(data);
                 addDataToTable(data);
             });
        }
     })
});


let contador = 0;
$('#logo').on('click', ()=>{
    if(contador > 4) $('#logo').html('Library Manager ' + contador);
    if(contador > 9){
        alert('This app is made by Cajas Molina Robinson Stalin from 3td A informatic period 2021-2022, and I just wanna say, I did it!, It was very hard to make this app :3, After this alert you might have an error please close and re-open the app :3');
        contador = 0;
    }else contador++;
})