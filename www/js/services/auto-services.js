angular.module('starter')

.factory('AutosData', function($http){
    var url = 'http://production-yego-backoffice.herokuapp.com/api/v1/app_users/'; // production
    var url2 = 'http://production-yego-backoffice.herokuapp.com/api/v1/app_users/'; // production
    var selected_car = {};

    return {
        getMisAutos: function(id,uid){
            var ops = {
                method: 'GET',
                url: url+id+'/vehicles',
                header: {'Uid': uid}
            }
            return $http(ops).then(function(response){
                var data = response.data;
                return data;
            });
        },
        nuevoAuto: function(obj){
            var nvUrl = url+obj.vehicle.owner_id+'/vehicles';
            return $http.post(nvUrl,obj).then(function(response){
            }).catch(function(response){
                console.log(response);
            });
        },
        editarAuto: function(obj){
          console.log('Editar Auto Service');
          console.log(obj);
            var nvUrl = url+obj.vehicle.owner_id+'/vehicles/'+obj.vehicle.id;
            console.log(nvUrl);
            return $http.patch(nvUrl,obj).then(function(response){
              console.log(response);
            }).catch(function(response){
                console.log(response);
            });
        },
        borrarAuto: function(obj){
            var dvUrl = url+obj.owner_id+'/vehicles/'+obj.id;
            return $http.delete(dvUrl).then(function(response){
            }).catch(function(response){
                console.log(response);
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
});
