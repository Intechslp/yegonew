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
/***************
****************
****************
 USER DATA
–––––––––––––––––––––––*/
.factory('UserData', function($http){

    var url_u = 'http://stage-yego-backoffice.herokuapp.com/api/v1/app_users/'; // stage
    // var url_u = 'http://production-yego-backoffice.herokuapp.com/api/v1/app_users/'; // production
    return {
        registerUser: function(obj){
          return $http.post(url_u,obj).then(function(response){
            var data = response.data;
            return data;
          }).catch(function(response){
            console.log(response)
          });
        },
        getUserData: function(id,uid){
            var ops = {
                method: 'GET',
                url: url_u+id,
                header: {'Uid': uid}
            }
            return $http(ops).then(function(response){
                var data = response.data;
                console.log(data);
                return data;
            });
        },
        updateUser: function(userId,obj){
            var finalUrl = url_u+userId;
            return $http.patch(finalUrl,obj).then(function(response){
                var data = response.data;
                return data;
            }).catch(function(response){
                console.log(response)
            });
        }
    }
})
/***************
****************
****************
 TEAM DATA
–––––––––––––––––––––––*/
.factory('TeamData', function($http){
    var url = 'http://stage-yego-backoffice.herokuapp.com/api/v1/app_users/'; // stage
    // var url = 'http://production-yego-backoffice.herokuapp.com/api/v1/app_users/'; // production
    var urlInv = 'http://stage-yego-backoffice.herokuapp.com/api/v1/family_requests/'; // stage
    // var urlInv = 'http://production-yego-backoffice.herokuapp.com/api/v1/family_requests/'; // production
    var urlPI = 'http://stage-yego-backoffice.herokuapp.com/api/v1/my_family_requests/'; // stage
    // var urlPI = 'http://production-yego-backoffice.herokuapp.com/api/v1/my_family_requests/'; // production

    return {
        getTeam: function(usrId){
            var getUrl = url+usrId+'/families';
            return $http.get(getUrl).then(function(response){
                var data = response.data;
                return data;
            });
        },
        crearTeam: function(teamData){
            var ctUrl = url+teamData.administrator_id+'/families';
            return $http.post(ctUrl,teamData).then(function(response){
            }).catch(function(response){
                console.log(response);
            });
        },
        eliminarTeam: function(team){
            var ctUrl = url+team.administrator.id+'/families/'+team.id;
            return $http.delete(ctUrl).then(function(response){
            }).catch(function(response){
                console.log(response);
            });
        },
        enviarInvitacion: function(obj){
            return $http.post(urlInv,obj).then(function(response){
            }).catch(function(response){
                console.log(response);
            });
        },
        preguntarInvitacion: function(usrId){
            var askUrl = urlPI+usrId;
            return $http.get(askUrl).then(function(response){
                var data = response.data;
                return data;
            });
        },
        eliminarInvitacion: function(reqId){
            var finalUrl = urlInv+reqId;
            return $http.delete(finalUrl).then(function(response){
                console.log(response)
            }).catch(function(response){
                console.log(response)
            });
        }
    }
})
/***************
****************
****************
 LOCATION DATA
–––––––––––––––––––––––*/
.factory('LocationData', function($http){
    var url_p = 'http://stage-yego-backoffice.herokuapp.com/api/v1/countries/';//pais // stage
    // var url_p = 'http://production-yego-backoffice.herokuapp.com/api/v1/countries/';//pais // production
    var url_e = 'http://stage-yego-backoffice.herokuapp.com/api/v1/countries/';//estado // stage
    // var url_e = 'http://production-yego-backoffice.herokuapp.com/api/v1/countries/';//estado // production
    var url_c = 'http://stage-yego-backoffice.herokuapp.com/api/v1/state/';//ciudad // stage
    // var url_c = 'http://production-yego-backoffice.herokuapp.com/api/v1/state/';//ciudad // production

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
/***************
****************
****************
 SEGUROS DATA
–––––––––––––––––––––––*/
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
/***************
****************
****************
 ESTABLECIMIENTOS DATA
–––––––––––––––––––––––*/
.factory('EstablecimientosData', function($http){
    var url = 'http://stage-yego-backoffice.herokuapp.com/api/v1/city_establishments/'; //stage
    // var url = 'http://production-yego-backoffice.herokuapp.com/api/v1/city_establishments/'; //production
    var url2 = 'http://stage-yego-backoffice.herokuapp.com/api/v1/categories'; //stage
    // var url2 = 'http://production-yego-backoffice.herokuapp.com/api/v1/categories'; //production
    var url3 = 'http://stage-yego-backoffice.herokuapp.com/api/v1/establishments/'; //stage
    // var url3 = 'http://production-yego-backoffice.herokuapp.com/api/v1/establishments/'; //production

    var subcategorias = {};
    var categorias = {};

    return {
        getCategorias: function(){
            return $http.get(url2).then(function(response){
                var data = response.data;
                return data;
            });
        },
        getEstablecimientosGral: function(city){
            return $http.get(url+city).then(function(response){
                var data = response.data;
                return data;
            });
        },
        getEstablecimientos: function(subcat,city){
            return $http.get(url+city+'/subcategory/'+subcat).then(function(response){
                var data = response.data;
                return data;
            });
        },
        setCategorias: function(obj){
            categorias = obj;
        },
        setSubcategorias: function(obj){
            subcategorias = obj;
        },
        getSubcategorias: function(){
            return subcategorias;
        },
        getSingle: function(id){
            return $http.get(url3+id).then(function(response){
                var data = response.data;
                return data;
            });
        },
        createSucursal: function(sucursal){
            return $http.post(url3,sucursal).then(function(response){
            }).catch(function(response){
            });
        }
    }

})
/***************
****************
****************
 NEGOCIOS DATA
–––––––––––––––––––––––*/
.factory('NegociosData', function($http){
    var url = 'http://stage-yego-backoffice.herokuapp.com/api/v1/businesses'; // stage
    // var url = 'http://production-yego-backoffice.herokuapp.com/api/v1/businesses'; // production
    var url2 = 'http://stage-yego-backoffice.herokuapp.com/api/v1/my_businesses/'; // stage
    // var url2 = 'http://production-yego-backoffice.herokuapp.com/api/v1/my_businesses/'; // production
    return {
        getNegocios: function(){
          return $http.get(url).then(function(response){
              var data = response.data;
              return data;
          });
        },
        getUserNegocios: function(userId){
            var urlFinal = url2+userId;
            console.log(urlFinal);
            return $http.get(urlFinal).then(function(response){
              var data = response.data;
              return data;
            });
        },
        createNegocio: function(negocio){
            console.log('crearNegocio()');
            console.log(negocio);
            var obj = {};
            obj.business = {};
            obj.business = negocio;
            return $http.post(url,obj).then(function(response){
                console.log('lo logramos!');
                console.log(response.data);
                var data = response.data;
                return data;
            }).catch(function(response){
                console.log('no lo logramos :(');
                console.log(response);
            });
        }
    }
})
/***************
****************
****************
 SERVICIOS DATA
–––––––––––––––––––––––*/
.factory('ServiciosData', function($http){
    var url = 'http://stage-yego-backoffice.herokuapp.com/api/v1/services'; // stage
    // var url = 'http://production-yego-backoffice.herokuapp.com/api/v1/services'; // production
    return {
        getServicios: function(){
            console.log('getServicios()');
          return $http.get(url).then(function(response){
              var data = response.data;
              return data;
          });
        }
    }
})
/***************
****************
****************
 MIS SEGUROS DATA
–––––––––––––––––––––––*/
.factory('MisSegurosData', function($http){
    var url = 'http://stage-yego-backoffice.herokuapp.com/api/v1/insurances/'; // stage
    // var url = 'http://production-yego-backoffice.herokuapp.com/api/v1/insurances/'; // production

    var theCar = {};
    return {
        getInsurance: function(insuranceId){
            console.log('getInsurance()');
          return $http.get(url).then(function(response){
              var data = response.data;
              return data;
          });
        },
        newInsurance: function(objS){
            console.log('newInsurance()');
            console.log(objS);
            return $http.post(url,objS).then(function(response){
              var data = response.data;
              return data;
              console.log('lo logramos');
            }).catch(function(err){
              console.log(err);
            });
        },
        editInsurance: function(insId,objS){
            console.log('editInsurance()');
            console.log(objS);
            return $http.patch(url+insId,objS).then(function(response){
              var data = response.data;
              return data;
              console.log('lo logramos');
            }).catch(function(err){
              console.log(err);
            });
        },
        setTheCar: function(objC){
            theCar = objC;
        },
        getTheCar: function(){
            return theCar;
        }
    }
})
/***************
****************
****************
 GASOLINAS DATA
–––––––––––––––––––––––*/
.factory('GasolinasData', function($http){
    var url_fuels = 'http://stage-yego-backoffice.herokuapp.com/api/v1/fuels/'; // stage
    // var url_fuels = 'http://production-yego-backoffice.herokuapp.com/api/v1/fuels/'; // production
    var url_gas_stations = 'http://stage-yego-backoffice.herokuapp.com/api/v1/gas_stations/'; // stage
    // var url_gas_stations = 'http://production-yego-backoffice.herokuapp.com/api/v1/gas_stations/'; // production
    var url_fuel_refills = 'http://stage-yego-backoffice.herokuapp.com/api/v1/app_users/'; // stage
    // var url_fuel_refills = 'http://production-yego-backoffice.herokuapp.com/api/v1/app_users/'; // production


    var porMeses = function(refills){
        var allRefills = [];
        var years = [];
        var months = [];
        for(var i = 0 ; i < refills.length; i++){
            var date = new Date(refills[i].created_at);
            date.setHours(date.getHours()+6);
            refills[i].month = date.getMonth();
            refills[i].month_name = setMonthName(date.getMonth());
            refills[i].year = date.getFullYear();
            refills[i].month_year = setMonthName(date.getMonth())+' '+date.getFullYear();
        }
        return refills;
    }

    var setMonthName = function(key){
        switch (key) {
          case 0:return 'Enero'; break;
          case 1:return 'Febrero'; break;
          case 2:return 'Marzo'; break;
          case 3:return 'Abril'; break;
          case 4:return 'Mayo'; break;
          case 5:return 'Junio'; break;
          case 6:return 'Julio'; break;
          case 7:return 'Agosto'; break;
          case 8:return 'Septiembre'; break;
          case 9:return 'Octubre'; break;
          case 10:return 'Noviembre'; break;
          case 11:return 'Diciembre'; break;
          default: return 'N/A'; break;
        }
    }

    var monthRefills = {};

    return {
        setSingleMonth: function(key,month,carga,costo){
            monthRefills.name = key;
            monthRefills.data = month;
            monthRefills.refill = carga;
            monthRefills.cost = costo;
        },
        getSingleMonth: function(){
            return monthRefills;
        },
        getFuels: function(){
            console.log('getFuels()');
          return $http.get(url_fuels).then(function(response){
              var data = response.data;
              return data;
          }).catch(function(err){
              console.log(err);
          });
        },
        getGasStations: function(){
            console.log('getGasStations()');
            return $http.get(url_gas_stations).then(function(response){
                var data = response.data;
                return data;
            }).catch(function(err){
                console.log(err);
            });
        },
        getFuelRefills: function(userId,carId){
            console.log('getFuelRefills('+userId+','+carId+')');
            var urlFinal = url_fuel_refills+userId+'/vehicles/'+carId+'/fuel_refills/'
            console.log(urlFinal);
            return $http.get(urlFinal).then(function(response){
                var data = porMeses(response.data);
                return data;
          }).catch(function(err){
              console.log(err);
          });
        },
        NewFuelRefill: function(userId,objG){
            console.log('NewFuelRefill()');
            return $http.post(
                url_fuel_refills+userId+'/vehicles/'+objG.fuel_refill.vehicle_id+'/fuel_refills/',
                objG
            ).then(function(response){
              var data = response.data;
              return data;
          }).catch(function(err){
              console.log(err);
          });
        }

    }
})
/***************
****************
****************
 RATING DATA
–––––––––––––––––––––––*/
.factory('RatingData', function($http){
    var url = 'http://stage-yego-backoffice.herokuapp.com/api/v1/reviews/'; // stage
    // var url = 'http://production-yego-backoffice.herokuapp.com/api/v1/reviews/'; // production
    return {
        postRating: function(obj){
            console.log('postRating()');
            console.log(obj);
          return $http.post(url,obj).then(function(response){
              var data = response.data;
              return data;
          }).catch(function(response){
              console.log(response);
          });
        },
        getRating: function(){
            console.log('getServicios()');
          return $http.get(url).then(function(response){
              var data = response.data;
              return data;
          }).catch(function(response){
              console.log(response);
          });
        }
    }
})
/***************
****************
****************
 CUPONES DATA
–––––––––––––––––––––––*/
.factory('CuponesData', function($http){
    var url = 'http://stage-yego-backoffice.herokuapp.com/api/v1/cupons'; // stage
    // var url = 'http://production-yego-backoffice.herokuapp.com/api/v1/cupons'; // production

    var el_cupon = {};
    return {
        getCupones: function(){
            return $http.get(url).then(function(response){
                var data = response.data;
                return data;
            });
        },
        setCupon: function(obj){
            console.log('setCupon');
            console.log(obj);
            el_cupon = obj;
        },
        getCupon: function(){
            console.log('getCupon');
            console.log(el_cupon);
            return el_cupon;
        }
    }
})
/***************
****************
****************
 SEGUROS DATA
–––––––––––––––––––––––*/
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
