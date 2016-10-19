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

    var url_u = 'https://stage-yego-backoffice.herokuapp.com/api/v1/users/';
    return {
        getUserData: function(id,uid){
            console.log('getUserData()');
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
        getUserLength: function(id,uid){
            console.log('getUserLength()');
            var ops = {
                method: 'GET',
                url: url_u+id,
                header: {
                    'Uid': uid
                }
            }
            return $http(ops).then(function(response){
                var data = response.data.length;
                //do something exciting with the data
                return data;
            });
        }
    }
})

.factory('LocationData', function($http){
    var url_p = 'https://stage-yego-backoffice.herokuapp.com/api/v1/countries/';//pais
    var url_e = 'https://stage-yego-backoffice.herokuapp.com/api/v1/country/';//estado
    var url_c = 'https://stage-yego-backoffice.herokuapp.com/api/v1/state/';//ciudad

    return{
        getCountries: function(){
            return $http.get(url_p).then(function(response){
                var data = response.data;
                console.log(data);
                return data;
            });
        },
        getStates: function(countryId){
            return $http.get(url_e+countryId+'/states/').then(function(response){
                var data = response.data;
                console.log(data);
                return data;
            });
        },
        getCities: function(stateId){
            return $http.get(url_c+stateId+'/cities/').then(function(response){
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
    var url = 'https://stage-yego-backoffice.herokuapp.com/api/v1/city_establishments/';
    var url2 = 'https://stage-yego-backoffice.herokuapp.com/api/v1/categories';
    var url3 = 'https://stage-yego-backoffice.herokuapp.com/api/v1/establishments/';

    var subcategorias = {};

    return {
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
        getCategorias: function(){
            return $http.get(url2).then(function(response){
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
    var url = 'https://stage-yego-backoffice.herokuapp.com/api/v1/cupons';
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
