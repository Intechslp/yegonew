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

    var url_u = 'http://production-yego-backoffice.herokuapp.com/api/v1/app_users/'; // production
    return {
        registerUser: function(obj){
          return $http.post(url_u,obj).then(function(response){
            var data = response.data;
            return data;
          }).catch(function(err){
            console.log(err)
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
                return data;
            });
        },
        updateUser: function(userId,obj){
          console.log('update user service');
            var finalUrl = url_u+userId;
            var userObj = {};
            userObj.app_user = obj;
            console.log(finalUrl);
            return $http.patch(finalUrl,obj).then(function(response){
                var data = response.data;
                return data;
            }).catch(function(err){
                console.log(err)
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
    var url = 'http://production-yego-backoffice.herokuapp.com/api/v1/app_users/'; // production
    var urlInv = 'http://production-yego-backoffice.herokuapp.com/api/v1/family_requests/'; // production
    var urlPI = 'http://production-yego-backoffice.herokuapp.com/api/v1/my_family_requests/'; // production

    return {
        getTeam: function(usrId){
            var getUrl = url+usrId+'/families';
            console.log(getUrl);
            return $http.get(getUrl).then(function(response){
                var data = response.data;
                return data;
            });
        },
        crearTeam: function(teamData){
            var ctUrl = url+teamData.administrator_id+'/families';
            return $http.post(ctUrl,teamData).then(function(response){
            }).catch(function(err){
                console.log(err);
            });
        },
        eliminarTeam: function(team){
            var ctUrl = url+team.administrator.id+'/families/'+team.id;
            return $http.delete(ctUrl).then(function(response){
              console.log(response);
            }).catch(function(err){
                console.log(err);
            });
        },
        enviarInvitacion: function(obj){
            return $http.post(urlInv,obj).then(function(response){
            }).catch(function(err){
                console.log(err);
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
            }).catch(function(err){
                console.log(err)
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
    var url_p = 'http://production-yego-backoffice.herokuapp.com/api/v1/countries/';//pais // production
    var url_e = 'http://production-yego-backoffice.herokuapp.com/api/v1/countries/';//estado // production
    var url_c = 'http://production-yego-backoffice.herokuapp.com/api/v1/state/';//ciudad // production

    return{
        getCountries: function(){
            return $http.get(url_p).then(function(response){
                var data = response.data;
                return data;
            });
        },
        getStates: function(countryId){
            return $http.get(url_p+countryId+'/states/').then(function(response){
                var data = response.data;
                return data;
            });
        },
        getCities: function(countryId,stateId){
            return $http.get(url_p+countryId+'/states/'+stateId+'/cities/').then(function(response){
                var data = response.data;
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
    var url = 'http://production-yego-backoffice.herokuapp.com/api/v1/city_establishments/'; //production
    var url2 = 'http://production-yego-backoffice.herokuapp.com/api/v1/categories'; //production
    var url3 = 'http://production-yego-backoffice.herokuapp.com/api/v1/establishments/'; //production

    var subcategorias = {};
    var categorias = {};
    var singleStablishment = {};

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
        setSingleForMap: function(obj){
            singleStablishment = obj;
        },
        getSingleForMap: function(){
            return singleStablishment;
        },
        createSucursal: function(sucursal){
            var obj = {};
            obj.establishment = sucursal;
            return $http.post(url3,obj).then(function(response){
              console.log(response);
            }).catch(function(err){
              console.log(err);
            });
        },
        editSucursal: function(sucursal){
          var obj = {};
          obj.establishment = {};
          obj.establishment = sucursal;
          var f_url = url3+sucursal.id;
          return $http.patch(url, obj).then(function(response){
            var data = response.data;
            return data;
          }).catch(function(err){
            console.log(err);
          });
        },
        deleteSucursal: function(idSuc){
          f_url = url3+idSuc;
          return $http.delete(f_url).then(function(response){
            console.log(response);
          }).catch(function(err){
            console.log(err);
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
    var url = 'http://production-yego-backoffice.herokuapp.com/api/v1/businesses'; // production
    var url2 = 'http://production-yego-backoffice.herokuapp.com/api/v1/my_businesses/'; // production
    var bisne = {};

    return {
        getNegocios: function(){
          return $http.get(url).then(function(response){
              var data = response.data;
              return data;
          });
        },
        getUserNegocios: function(userId){
            var urlFinal = url2+userId;
            return $http.get(urlFinal).then(function(response){
              var data = response.data;
              return data;
            });
        },
        createNegocio: function(negocio){
            var obj = {};
            obj.business = {};
            obj.business = negocio;
            console.log(obj);
            return $http.post(url,obj).then(function(response){
                var data = response.data;
                return data;
            }).catch(function(err){
                console.log(err);
            });
        },
        editNegocio: function(negocio){
          var obj = {};
          obj.business = {};
          obj.business = negocio;
          console.log(obj);
          var f_url = url+'/'+negocio.id;
          return $http.patch(f_url, obj).then(function(response){
            var data = response.data;
            console.log(response);
            return data;
          }).catch(function(err){
            console.log(err);
          });
        },
        deleteNegocio: function(idNeg){
          f_url = url+idNeg;
          return $http.delete(f_url).then(function(response){
            console.log(response);
          }).catch(function(err){
            console.log(err);
          });
        },
        setSingleNegocio: function(obj){
          bisne = obj;
        },
        getSingleNegocio: function(){
          return bisne;
        },
        getNegocioFromUrl: function(idNeg){
            var f_url = url+'/'+idNeg;
            return $http.get(f_url).then(function(response){
                var data = response.data;
                return data;
                console.log(response);
            }).catch(function(err){
                console.log(err);
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
    var url = 'http://production-yego-backoffice.herokuapp.com/api/v1/services'; // production
    return {
        getServicios: function(){
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
    var url = 'http://production-yego-backoffice.herokuapp.com/api/v1/insurances/'; // production

    var theCar = {};
    return {
        getInsurance: function(insuranceId){
          return $http.get(url).then(function(response){
              var data = response.data;
              return data;
          });
        },
        newInsurance: function(objS){
            return $http.post(url,objS).then(function(response){
              var data = response.data;
              return data;
            }).catch(function(err){
              console.log(err);
            });
        },
        editInsurance: function(insId,objS){
            return $http.patch(url+insId,objS).then(function(response){
              var data = response.data;
              return data;
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
    var url_fuels = 'http://production-yego-backoffice.herokuapp.com/api/v1/fuels/'; // production
    var url_gas_stations = 'http://production-yego-backoffice.herokuapp.com/api/v1/city_gas_stations/'; // production
    var url_fuel_refills = 'http://production-yego-backoffice.herokuapp.com/api/v1/app_users/'; // production
    var url_sg = 'http://production-yego-backoffice.herokuapp.com/api/v1/gas_stations/' // production

    var gasolinera = {};

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
          return $http.get(url_fuels).then(function(response){
              var data = response.data;
              return data;
          }).catch(function(err){
              console.log(err);
          });
        },
        getGasStations: function(cityId){
            return $http.get(url_gas_stations+cityId).then(function(response){
                var data = response.data;
                return data;
            }).catch(function(err){
                console.log(err);
            });
        },
        setGasolineraSingle: function(obj){
            gasolinera = obj;
        },
        getGasolineraSingle: function(){
            return gasolinera;
        },
        getOneGasolinera: function(id){
            var urlFinal = url_sg+id;
            return $http.get(urlFinal).then(function(response){
                var data = response.data;
                return data;
          }).catch(function(err){
              console.log(err);
          });
        },
        getFuelRefills: function(userId,carId){
            var urlFinal = url_fuel_refills+userId+'/vehicles/'+carId+'/fuel_refills/';
            return $http.get(urlFinal).then(function(response){
                console.log(response);
                var data = porMeses(response.data);
                return data;
          }).catch(function(err){
              console.log(err);
          });
        },
        NewFuelRefill: function(userId,objG){
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
    var url = 'http://production-yego-backoffice.herokuapp.com/api/v1/reviews/'; // production
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
    var url = 'http://production-yego-backoffice.herokuapp.com/api/v1/cupons'; // production

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
    var emiteOTData = {};

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
          console.log("Set Data:");
          console.log(datos);
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
                    "Edad": parseInt(datos.Edad),
                    "Marca": datos.Marca,
                    "CPostal": datos.CPostal,
                    "Genero": datos.Genero,
                    "tipoAuto": datos.tipoAuto,
                    "Modelo": parseInt(datos.Modelo),
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
                "Modelo": parseInt(auto.Modelo),
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
                    "Edad": parseInt(datos.Edad),
                    "Genero": datos.Genero,
                    "TipoAuto": datos.tipoAuto,
                    "Marca": datos.Marca,
                    "Modelo": parseInt(datos.Modelo),
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
        },
        setEmiteOTData: function(data){
            emiteOTData = data;
            console.log("setEmiteOTData: ");
            console.log(emiteOTData);
        },
        getEmiteOTData: function(){
            return emiteOTData;
        },
        sendEmiteOT: function(datos){
            return $soap.post(base_url,"EmiteOT", {
              "RespuestaCotizacion": datos.RespuestaCotizacion,
              "Nombre": datos.Nombre,
              "ApellidoP": datos.ApellidoP,
              "ApellidoM": datos.ApellidoM,
              "Email": datos.Email,
              "FechaNac": datos.FechaNac,
              "LugarNac": datos.LugarNac,
              "Nacionalidad": datos.Nacionalidad,
              "RFC": datos.RFC,
              "Telefono": datos.Telefono,
              "Celular": datos.Celular,
              "TipoPersona": datos.TipoPersona,
              "Calle": datos.Calle,
              "NoExt":datos.NoExt,
              "NoInt": datos.NoInt,
              "Colonia": datos.Colonia,
              "CPostal": datos.CPostal,
              "Estado":datos.Estado,
              "Ciudad": datos.Ciudad,
              "Banco": datos.Banco,
              "TipoTarjeta": datos.TipoTarjeta,
              "Carrier": datos.Carrier,
              "NombrePlastico": datos.NombrePlastico,
              "NumeroPlastico":datos.NumeroPlastico,
              "MesVigencia": datos.MesVigencia,
              "AnioVigencia": datos.AnioVigencia,
              "CodSeguridad": datos.CodSeguridad,
              "Serie": datos.Serie,
              "Motor": datos.Motor,
              "Placas":datos.Placas,
              "NoInt": datos.NoInt,
              "Alianza": "YEGO",
              "FormatInput": "JSON"
            });
        },
        validaUsuario: function(credentials){
            console.log("VALIDAR USUARIO");

          return $soap.post(base_url,"validaUsuario", {
            "usuario": credentials.email,
            "contrasena": credentials.pass
          });
        },
        crearUsuario: function(data){
            console.log("CREAR USUARIO");
            the_pass = ""+data.Email;
            the_pass = the_pass.replace("@","")
            the_pass = the_pass.replace(".","")
            userData = {
                "usuario":the_pass,
                "contrasena":the_pass,
                "tipoEnt":data.TipoPersona,
                "apellidoP":data.ApellidoP,
                "apellidoM":data.ApellidoM,
                "Nombre":data.Nombre,
                "fechaNac":data.FechaNac,
                "sexo":data.Genero,
                "NombreCompleto":data.ApellidoP+" "+data.ApellidoM+" "+data.Nombre,
                "rfc":data.RFC,
                "telParticular":data.Telefono,
                "telCelular":data.Celular,
                "eMail1":data.Email,
                "Nacionalidad":data.Nacionalidad,
                "lugarNac":data.LugarNac,
                "calle":data.Calle,
                "cPostal":data.CPostal,
                "colonia":data.Colonia,
                "poblacion":data.Ciudad,
                "ciudad":data.Ciudad,
                "pais":"MEXICO"
            }
            console.log(userData);

            return $soap.post(base_url,"creaUsuario", userData);
        }
    }
}]);
