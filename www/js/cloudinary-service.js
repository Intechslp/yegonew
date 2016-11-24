angular.module('starter')
.factory('ImageUploadFactory', function ($q, $ionicLoading, $cordovaFileTransfer) {

  return {
    uploadImage: function (imageURI , preset) {
      console.log('start upload image.');
      var deferred = $q.defer();

      uploadFile();

      function uploadFile() {
        // $ionicLoading.show({template : 'Uploading image...'});
        // Add the Cloudinary "upload preset" name to the headers
        var uploadOptions = {
          params : { 'upload_preset': preset}
        };
        console.log(uploadOptions);
      $cordovaFileTransfer
        // Your Cloudinary URL will go here
        .upload('https://api.cloudinary.com/v1_1/omakase/image/upload', imageURI, uploadOptions)

        .then(function(result) {
          // Let the user know the upload is completed
          // $ionicLoading.show({template : 'Done.', duration: 1000});
          console.log(result);
          var response = JSON.parse(decodeURIComponent(result.response));
          deferred.resolve(response);
        }, function(err) {
          // Uh oh!
          // $ionicLoading.show({template : 'Failed.', duration: 3000});
          deferred.reject(err);
        }, function (progress) {

        });
      }
      return deferred.promise;
    },
  }
});
