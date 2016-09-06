angular.module('starter')
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

    return {
        getMarcas: function(){
            return $soap.post(base_url,"ObtenerMarcas", {"Usuario": user, "Pass": pass, "TipoRegreso": tipo});
        },
        getModelos: function(marca){
            return $soap.post(base_url,"ObtenerModelos", {"Usuario": user, "Pass": pass, "TipoRegreso": tipo, "Marca":marca});
        },
        getCotizacion: function(datos){
            return $soap.post(base_url,"Cotizacion", {
                "Usuario": user, "Pass": pass, "TipoRegreso": tipo, "Edad": datos.edad, "Marca": datos.marca, "CPostal": datos.cp,
                "Genero": datos.genero, "tipoAuto": datos.tipo, "Modelo": datos.modelo, "Descripcion": datos.descripcion,
                "Plan": datos.plan, "perioricidadPago": datos.periodo, "Grupo":datos.grupo});
        },
        setSingle: function(datos){
            seguro = datos;
        },
        getSingle: function(){
            return seguro;
        }
    }
}]);
