angular.module('starter')

.factory('MailingService', function($http){
	var base_url = 'https://api.sendinblue.com/v2.0';
	var api_key = "IV7pLvhgbXwPSNMC";
	var timeout = 30000;
	return {
		do_request:function(resource,method,input) {
			console.log('Do Request');
			console.log('Resource: '+resource)
			var called_url = base_url + "/" + resource;
			console.log('URL: '+called_url);
			var content_type = "application/json";
			var config = {method:method, timeout: timeout, headers:{'api-key':api_key,"content-type":content_type},data:input}
			console.log('CONFIG');
			console.log(config);

			timeout = timeout!=null ? timeout: 30000; //default timeout: 30 secs
			if(timeout!=null && (timeout <= 0 || timeout > 60000))
				throw new Error('value not allowed for timeout')

			// Make the call
			return $http({method:method, url: called_url, timeout: timeout, headers:{'api-key':api_key,"content-type":content_type},data:input}).then(function(response){
				console.log(response);
			}).catch(function(err){
					console.log(err);
			});
			// return this.request(called_url,{method:method, timeout: this.timeout, headers:{'api-key':this.api_key,"content-type":content_type},data:input});
		},
		get_request:function(resource,input) {
			return this.do_request(resource,"GET",input);
		},
		post_request:function(resource,input) {
			console.log('Resource');
			console.log(resource);
			console.log('Input');
			console.log(input);
			return this.do_request(resource,"POST",input);
		},

		/*
			Send Transactional Email.
			@param {Object} data contains json object with key value pair.
			@options data {Array} to: Email address of the recipient(s). It should be sent as an associative array. Example: array("to@example.net"=>"to whom"). You can use commas to separate multiple recipients [Mandatory]
			@options data {String} subject: Message subject [Mandatory]
			@options data {Array} from Email address for From header. It should be sent as an array. Example: array("from@email.com","from email") [Mandatory]
			@options data {String} html: Body of the message. (HTML version) [Mandatory]. To send inline images, use <img src="{YourFileName.Extension}" alt="image" border="0" >, the 'src' attribute value inside {} (curly braces) should be same as the filename used in 'inline_image' parameter
			@options data {String} text: Body of the message. (text version) [Optional]
			@options data {Array} cc: Same as to but for Cc. Example: array("cc@example.net","cc whom") [Optional]
			@options data {Array} bcc: Same as to but for Bcc. Example: array("bcc@example.net","bcc whom") [Optional]
			@options data {Array} replyto: Same as from but for Reply To. Example: array("from@email.com","from email") [Optional]
			@options data {Array} attachment: Provide the absolute url of the attachment/s. Possible extension values = gif, png, bmp, cgm, jpg, jpeg, txt, css, shtml, html, htm, csv, zip, pdf, xml, doc, xls, ppt, tar and ez. To send attachment/s generated on the fly you have to pass your attachment/s filename & its base64 encoded chunk data as an associative array. Example: array("YourFileName.Extension"=>"Base64EncodedChunkData"). You can use commas to separate multiple attachments [Optional]
			@options data {Array} headers: The headers will be sent along with the mail headers in original email. Example: array("Content-Type"=>"text/html; charset=iso-8859-1"). You can use commas to separate multiple headers [Optional]
			@options data {Array} inline_image: Pass your inline image/s filename & its base64 encoded chunk data as an associative array. Possible extension values = gif, png, bmp, cgm, jpg and jpeg. Example: array("YourFileName.Extension"=>"Base64EncodedChunkData"). You can use commas to separate multiple inline images [Optional]
		*/
		send_email: function(data) {
			console.log('send_email');
			console.log(data);
			return this.post_request("email",JSON.stringify(data));
		},

		/*
			Get Account.
			No input required
		*/
		get_account:function() {
			return this.get_request("account","");
		},

		/*
			Get SMTP details.
			No input required
		*/
		get_smtp_details:function() {
			return this.get_request("account/smtpdetail","");
		}
	}
});
