angular.module('starter')

.factory('HeadersSave', function(){
    var headers = {};
    return{
        setHeaders: function(heads){
            headers = heads;
        },
        getHeaders: function(){
            return headers;
        }
    }
})

.factory('UserData', function($http){

    var url_u = 'http://stage-yego-backoffice.herokuapp.com/api/v1/app_users/';
    return {
        getUserData: function(id,uid){
            console.log('getUserData('+id+','+uid+')');
            var ops = {
                method: 'GET',
                url: url_u+id,
                header: {
                    'Uid': uid
                }
            }
            return $http(ops).then(function(response){
                var data = response.data;
                console.log(data);
                //do something exciting with the data
                return data;
            });
        },
        updateUser: function(userId,obj){
            console.log('updateUser()');
            var finalUrl = url_u+userId;
            console.log(finalUrl);
            console.log(obj);
            return $http.patch(finalUrl,obj).then(function(response){
                console.log('lo logramos!');
                console.log(response)
            }).catch(function(response){
                console.log('no lo logramos :(');
                console.log(response)
            });
        }
    }
})

.factory('AutosData', function($http){
    var url = 'http://stage-yego-backoffice.herokuapp.com/api/v1/app_users/';
    var url2 = 'http://stage-yego-backoffice.herokuapp.com/api/v1/app_users/';
    var selected_car = {};

    return {
        getMisAutos: function(id,uid){
            console.log('getMisAutos('+id+','+uid+')');
            var ops = {
                method: 'GET',
                url: url+id+'/vehicles',
                header: {
                    'Uid': uid
                }
            }
            console.log(ops)
            return $http(ops).then(function(response){
                var data = response.data;
                return data;
            });
            // return $http.get(url+id+'/vehicles').then(function(response){
            //     var data = response.data;
            //     return data;
            // });
        },
        nuevoAuto: function(obj){
            console.log('nuevoAuto()');
            console.log(obj);
            var nvUrl = url+obj.owner_id+'/vehicles';
            return $http.post(nvUrl,obj).then(function(response){
                console.log('lo logramos!');
                console.log(response)
            }).catch(function(response){
                console.log('no lo logramos :(');
                console.log(response)
            });
        },
        editarAuto: function(obj){
            console.log('editarAuto()');
            console.log(obj);
            var nvUrl = url+obj.owner_id+'/vehicles/'+obj.id;
            return $http.patch(nvUrl,obj).then(function(response){
                console.log('lo logramos!');
                console.log(response)
            }).catch(function(response){
                console.log('no lo logramos :(');
                console.log(response)
            });
        },
        borrarAuto: function(obj){
            console.log('borrarAuto()');
            console.log(obj);
            var dvUrl = url+obj.owner_id+'/vehicles/'+obj.id;
            return $http.delete(dvUrl).then(function(response){
                console.log('lo logramos!');
                console.log(response)
            }).catch(function(response){
                console.log('no lo logramos :(');
                console.log(response)
            });
        },
        setTheCar: function(obj){
            selected_car = obj;
        },
        getTheCar: function(){
            return selected_car;
        },
        getTheCarFromUrl: function(userId,autoId){
            return $http.get(url+userId+'/vehicles/'+autoId).then(function(response){
                var data = response.data;
                return data;
            });
        }

    }
})

.factory('TeamData', function($http){
    var url = 'http://stage-yego-backoffice.herokuapp.com/api/v1/app_users/';
    var urlInv = 'http://stage-yego-backoffice.herokuapp.com/api/v1/family_requests';
    var urlPI = 'http://stage-yego-backoffice.herokuapp.com/api/v1/my_family_requests/';

    return {
        getTeam: function(usrId){
            console.log('getTeam()');
            var getUrl = url+usrId+'/families';
            console.log(getUrl);
            return $http.get(getUrl).then(function(response){
                var data = response.data;
                return data;
            });
        },
        crearTeam: function(teamData){
            console.log('crearTeam()');
            console.log(teamData);
            var ctUrl = url+teamData.administrator_id+'/families';
            return $http.post(ctUrl,teamData).then(function(response){
                console.log('lo logramos!');
                console.log(response);
            }).catch(function(response){
                console.log('no lo logramos :(');
                console.log(response);
            });
        },
        enviarInvitacion: function(obj){
            console.log('enviarInvitacion()');
            console.log(obj);
            return $http.post(urlInv,obj).then(function(response){
                console.log('lo logramos, enviamos la invitación!');
                console.log(response);
            }).catch(function(response){
                console.log('no lo logramos :(');
                console.log(response);
            });
        },
        preguntarInvitacion: function(usrId){
            console.log('preguntarInvitacion()');
            var askUrl = urlPI+usrId;
            console.log(askUrl);
            return $http.get(askUrl).then(function(response){
                var data = response.data;
                return data;
            });
        },
        eliminarInvitacion: function(famId){
            console.log('eliminarInvitacion()');
            var finalUrl = urlInv+famId;
            console.log(finalUrl)
            return $http.delete(finalUrl).then(function(response){
                console.log('lo logramos!');
                console.log(response)
            }).catch(function(response){
                console.log('no lo logramos :(');
                console.log(response)
            });
        }
    }
})

.factory('LocationData', function($http){
    var url_p = 'http://stage-yego-backoffice.herokuapp.com/api/v1/countries/';//pais
    var url_e = 'http://stage-yego-backoffice.herokuapp.com/api/v1/countries/';//estado
    var url_c = 'http://stage-yego-backoffice.herokuapp.com/api/v1/state/';//ciudad

    return{
        getCountries: function(){
            return $http.get(url_p).then(function(response){
                var data = response.data;
                console.log(data);
                return data;
            });
        },
        getStates: function(countryId){
            return $http.get(url_p+countryId+'/states/').then(function(response){
                var data = response.data;
                console.log(data);
                return data;
            });
        },
        getCities: function(countryId,stateId){
            console.log('getCities('+countryId+','+stateId+')');
            return $http.get(url_p+countryId+'/states/'+stateId+'/cities/').then(function(response){
                var data = response.data;
                console.log(data);
                return data;
            });
        }
    }
})

.factory('SomeDataFactory', function($http){
    var url = 'http://private-3c6f3-tracto.apiary-mock.com/resumen';

    return {
    getSomeData: function(){
        return $http.get(url).then(function(response){
            var data = response.data;
            //do something exciting with the data
            return data;
            });
        }
    }
})

.factory('EstablecimientosData', function($http){
    var url = 'http://stage-yego-backoffice.herokuapp.com/api/v1/city_establishments/';
    var url2 = 'http://stage-yego-backoffice.herokuapp.com/api/v1/categories';
    var url3 = 'http://stage-yego-backoffice.herokuapp.com/api/v1/establishments/';

    var subcategorias = {};

    return {
        getCategorias: function(){
            console.log('Service: getCategorias()');
            return $http.get(url2).then(function(response){
                console.log(response);
                var data = response.data;
                return data;
            });
        },
        getEstablecimientosGral: function(){
            return $http.get(url+'2').then(function(response){
                var data = response.data;
                return data;
            });
        },
        getEstablecimientos: function(subcat){
            return $http.get(url+'2/subcategory/'+subcat).then(function(response){
                var data = response.data;
                return data;
            });
        },
        setSubcategorias: function(obj){
            // console.log("setSubcategorias()");
            // console.log(obj);
            subcategorias = obj;
        },
        getSubcategorias: function(){
            // console.log("getSubcategorias()");
            // console.log(subcategorias);
            return subcategorias;
        },
        getSingle: function(id){
            console.log("getSingle()");
            return $http.get(url3+id).then(function(response){
                var data = response.data;
                return data;
            });
        }
    }

})

.factory('NegociosData', function($http){
    var url = 'http://stage-yego-backoffice.herokuapp.com/api/v1/businesses';
    return {
        getNegocios: function(){
            return $http.get(url).then(function(response){
                var data = response.data;
                return data;
            });
        }
    }
})

.factory('CuponesData', function($http){
    var url = 'http://stage-yego-backoffice.herokuapp.com/api/v1/cupons';
    return {
        getCupones: function(){
            return $http.get(url).then(function(response){
                var data = response.data;
                return data;
            });
        }
    }
})

.factory('SegurosData', ['$soap',function($soap){
    var user = "Yego";
    var pass = "WS_Yego#2016";
    var tipo = "JSON";
    var base_url = "http://yego.segurointeligente.mx/Segurointeligente.asmx";
    var seguro = {};
    var datosEnv = {};
    var la_cotizacion = {};
    var data_recotizacion = {};

    return {
        getMarcas: function(){
            return $soap.post(base_url,"ObtenerMarcas",
                {
                    "Usuario": user,
                    "Pass": pass,
                    "TipoRegreso": tipo
                });
        },
        getModelos: function(marca){
            return $soap.post(base_url,"ObtenerModelos", {"Usuario": user, "Pass": pass, "TipoRegreso": tipo, "Marca":marca});
        },
        getDescripciones: function(marca,modelo){
            return $soap.post(base_url,"ObtenerDescripciones",
            {
                "Usuario": user,
                "Pass": pass,
                "TipoRegreso": tipo,
                "Marca":marca,
                "Modelo": modelo
            });
        },
        setData: function(datos){
            datosEnv = datos;
        },
        getData: function(){
            return datosEnv;
        },
        setCotizacion: function(datos){
            la_cotizacion = datos;
        },
        getCotizacion: function(datos){
            if (datos==='already'){
                return la_cotizacion;
            }else{
                return $soap.post(base_url,"Cotizacion", {
                    "Usuario": user,
                    "Pass": pass,
                    "TipoRegreso": tipo,
                    "Edad": datos.Edad,
                    "Marca": datos.Marca,
                    "CPostal": datos.CPostal,
                    "Genero": datos.Genero,
                    "tipoAuto": datos.tipoAuto,
                    "Modelo": datos.Modelo,
                    "Descripcion": datos.Descripcion,
                    "Plan": datos.Plan,
                    "perioricidadPago": datos.perioricidadPago,
                    "Grupo":datos.Grupo
                });
            }
        },
        getDescripcionesDetalle: function(auto,aseguradora){

            return $soap.post(base_url,"ObtenerDescripcionesDetalle", {
                "Usuario": user,
                "Pass": pass,
                "TipoRegreso": tipo,
                "Marca":auto.Marca,
                "Modelo": auto.Modelo,
                "Descripcion": auto.Descripcion,
                "Aseguradora": aseguradora
            });
        },
        setDataForRC: function(datos){
            data_recotizacion = datos;
        },
        getDataForRC: function(){
            return data_recotizacion;
        },
        setReCotizacion: function(datos){
            la_recotizacion = datos;
        },
        getReCotizacion: function(datos){
            if (datos==='already'){
                return la_recotizacion;
            }else{
                return $soap.post(base_url,"ReCotizacion", {
                    "Usuario": user,
                    "Pass": pass,
                    "CPostal": datos.CPostal,
                    "Edad": datos.Edad,
                    "Genero": datos.Genero,
                    "TipoAuto": datos.tipoAuto,
                    "Marca": datos.Marca,
                    "Modelo": datos.Modelo,
                    "Descripcion": datos.Descripcion,
                    "Plan": datos.Plan,
                    "PerioricidadPago": datos.perioricidadPago,
                    "CveVehic": datos.CveVehic,
                    "Aseguradora": datos.Aseguradora,
                    "Grupo":datos.Grupo,
                    "TipoRegreso": tipo
                });
            }
        },
        setSingle: function(datos){
            seguro = datos;
        },
        getSingle: function(){
            return seguro;
        }
    }
}]);
