// Backbone.js Application Collection: CertificateWhitelist
/*global define, RequireJS */

;(function(define){
    'use strict';
    define([
            'backbone',
            'gettext',
            'js/groups/models/certificate_exception'
        ],

        function(Backbone, gettext, CertificateException){

            var CertificateWhitelist =  Backbone.Collection.extend({
                model: CertificateException,

                url: '',

                initialize: function(attrs, options){
                    this.url = options.url;
                },

                containsModel: function(attrs){
                    var model = this.findWhere({user_name: attrs.user_name});
                    if(attrs.user_name && model){
                        return true;
                    }
                    else if (attrs.user_email){
                        return typeof this.findWhere({user_email: attrs.user_email}) !== 'undefined';
                    }
                    else{
                        return false;
                    }
                },

                getModel: function(attrs){
                    var model = this.findWhere({user_name: attrs.user_name});
                    if(attrs.user_name && model){
                        return model;
                    }
                    else if(attrs.user_email){
                        return this.findWhere({user_email: attrs.user_email});
                    }
                    else{
                        return undefined;
                    }
                },

                newCertificateWhitelist: function(url_appendage){
                    var filtered = this.filter(function(certificate_exception){
                        return !certificate_exception.get('id');
                    });

                    return new CertificateWhitelist(filtered, {url: this.url + "/"+ url_appendage});
                },

                parse: function (certificate_whitelist_json) {
                    // Transforms the provided JSON into a CertificateWhitelist collection
                    var modelArray = this.certificate_whitelist(certificate_whitelist_json);

                    for (var i in modelArray) {
                        if (modelArray.hasOwnProperty(i)) {
                            this.push(modelArray[i]);
                        }
                    }
                    return this.models;
                },

                certificate_whitelist: function(certificate_whitelist_json) {
                    var return_array;

                    try {
                        return_array = JSON.parse(certificate_whitelist_json);
                    } catch (ex) {
                        // If it didn't parse, and `certificate_whitelist_json` is an object then return as it is
                        // otherwise return empty array
                        if (typeof certificate_whitelist_json === 'object'){
                            return_array = certificate_whitelist_json;
                        }
                        else {
                            console.error(
                                gettext('Could not parse certificate JSON. %(message)s'),
                                {message: ex.message},
                                true
                            );
                            return_array = [];
                        }
                    }
                    return return_array;
                },

                update: function(data){
                    _.each(data, function(item){
                        var certificate_exception_model =
                            this.getModel({user_name: item.user_name, user_email: item.user_email});
                        certificate_exception_model.set(item);
                    }, this);
                }
            });

            return CertificateWhitelist;
        }
    );
}).call(this, define || RequireJS.define);