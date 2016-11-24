angular.module('starter')

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
            var nvUrl = url+obj.vehicle.owner_id+'/vehicles';
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
            var nvUrl = url+obj.vehicle.owner_id+'/vehicles/'+obj.vehicle.id;
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
});
