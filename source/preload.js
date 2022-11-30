const {obtenerPrestadosDark, iniciarSession, obtenerPrestados, deletePrestadosById, registrarPrestamo, chagePassword, updateDate, addOrRemoveBlackList} = require('./sqlLiteManager');
const {contextBridge} = require('electron');


contextBridge.exposeInMainWorld('api',{
    iniciarSession: iniciarSession,
    obtenerPrestados: obtenerPrestados,
    deletePrestadosById : deletePrestadosById,
    registrarPrestamo: registrarPrestamo,
    chagePassword: chagePassword,
    updateDate: updateDate,
    addOrRemoveBlackList: addOrRemoveBlackList,
    obtenerPrestadosDark: obtenerPrestadosDark
    
});