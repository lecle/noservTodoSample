/*********************
 * File Info
 * *************
 * noserv.js
 * creator : 100c
 * version : 0.0.3
 *
 **********************/

// ======================================================
// Map
Map = function(){
    this.map = new Object();
};
Map.prototype = {
    put : function(key, value){
        this.map[key] = value;
    },
    putMap : function(key, value){
        this.map[key] = value.map;
    },
    putMapList : function(key, value){
        var list = new Array();
        for(var i=0;i<value.length;i++){
            list.push(value[i].map);
        }
        this.map[key] = list;
    },
    get : function(key){
        return this.map[key];
    },
    containsKey : function(key){
        return key in this.map;
    },
    containsValue : function(value){
        for(var prop in this.map){
            if(this.map[prop] == value) return true;
        }
        return false;
    },
    isEmpty : function(key){
        return (this.size() == 0);
    },
    clear : function(){
        for(var prop in this.map){
            delete this.map[prop];
        }
    },
    remove : function(key){
        delete this.map[key];
    },
    keys : function(){
        var keys = new Array();
        for(var prop in this.map){
            keys.push(prop);
        }
        return keys;
    },
    values : function(){
        var values = new Array();
        for(var prop in this.map){
            values.push(this.map[prop]);
        }
        return values;
    },
    size : function() {
        var count = 0;
        for (var prop in this.map) {
            count++;
        }
        return count;
    },
    getJsonString : function(){
        return JSON.stringify(this.map);
    }
};
// Map
// ======================================================


// ======================================================
// 1. Functions
function inheritPrototype(subType, superType){
    var prototype = Object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}

function unique (array) {
    var o = {}, i, l = array.length, r = [];
    for(i=0; i<l;i++) o[array[i]] = array[i];
    for(i in o) r.push(o[i]);
    return r;
};
// 1. Functions
// ======================================================

// ======================================================
// Initialize App Info
var _NoservInit = function(param0, param1){

    if( typeof this._map == 'undefined'){
        this._map = new Map();
    }

    this.put = function(param0, param1){

        if( arguments.length > 0){
            if( arguments.length >= 2 ){
                this._map = new Map();
                this._map.put(param0, param1);
            }  else{
                //json 처리
            }

        }
        else{

        }
    }

    this.get = function(appId){
        return this._map.get(appId);
    }

    this.print = function(){
        console.log( 'NoservInit.print ==================================' );
        console.log( 'NoservInit.size:' + this._map.size() );

        // NoservInit -> this
        for ( var key in keys = this._map.keys() ){
            console.log( 'appId[' + key + ']:' + keys[key] );
            console.log( 'appKey[' + key + ']:' + this.get(keys[key]) );
        }

        console.log( 'NoservInit.print ================================== <<' );
    }
};

var NoservInit = new _NoservInit();

var testGetAppKey = function(appId){
    console.log( 'NoservInit.size:' + NoservInit._map.size() );
//    NoservInit.getAppKey(appId);
    console.log( 'testGetAppKey:' + NoservInit.get(appId) );
};

// Initialize App Info
// ======================================================

// ======================================================
// 2. Core-1 SuperType, SubType

var SuperType = function(className, sessionToken, appId, appKey, masterKey) {
    this._serverUrl = "https://api.noserv.io";
    this._className = className;
    this._sessionToken =  sessionToken;
    this._appId = appId;
    this._appKey = appKey;
    this._masterKey = masterKey;

    if( appId == null || appId == ''){
        if( NoservInit._map.size() > 0 ){
            console.log( NoservInit._map.keys() );
            console.log( NoservInit._map.keys()[0] );
            console.log( NoservInit.get(NoservInit._map.keys()[0]) );

            this._appId = NoservInit._map.keys()[0];
            this._appKey = NoservInit.get(NoservInit._map.keys()[0]);
        }
    }

    if( appKey == null || appKey == ''){
        if ( appId != null && appId != '' ){
            if( NoservInit._map.isEmpty(appId) == false ){
                this._appId = appId;
                this._appKey = NoservInit.get(appId);
            }
        }
    }

};

SuperType.localStorage = sessionStorage;
SuperType.serverUrl = "https://api.noserv.io";

SuperType.prototype.getClassName = function(){
    console.log(this._className);
    return this._className;
}

SuperType.prototype.getAppId = function(){
    console.log(this._appId);
    return this._appId;
}

SuperType.prototype.set = function(key, value){
    console.log('set value:' + value );
    Object.defineProperty(this, key, { value : value, configurable: true });
}

SuperType.prototype.get = function(key){
    console.log( eval( 'this.' + key ) );
    return eval( 'this.' + key );
};

// 2. Core-1 SuperType, SubType
// ======================================================

// ======================================================
// 3. Core-2. Core Extension

SuperType.prototype.extend = function(props){

    var prop, obj;
    obj = Object.create(this);
//        obj['super'] = this;

    for(prop in props) {
//            console.log('0---');
        if(props.hasOwnProperty(prop)) {
//                console.log('1---');
            obj[prop] = props[prop];
        }
    }

    var propsDefault = {

        set: function(key, value) {

            // if(this.hasOwnProperty(key)) => cannot redefine without configurable true.

            Object.defineProperty(this, key, { value : value, configurable: true });

//            if(this.hasOwnProperty(key)) {
//                console.log ('_0');
//
//
//                var ele = eval( 'this.' + key );
//                ele = value;
//
//                console.log ('_00');
//            }
//            else{
//                console.log ('1');
//                Object.defineProperty(this, key, { value : value, configurable: true });
//            }
        },

        get: function(key){
            console.log( eval( 'this.' + key ) );
            return eval( 'this.' + key );
        }
    };

    for(prop in propsDefault) {
        if(propsDefault.hasOwnProperty(prop)) {
            obj[prop] = propsDefault[prop];
        }
    }

    return obj  || {};
};

SuperType.prototype.getJson = function(){

    // Considering a possible duplicate member case ( not general ) : Add a member to Sub Object which is exist in Super Object as a same name.

    //delete this.route;          //modified
    delete this.className;      //modified

    var subObj = this;

    var subPropNames = Object.getOwnPropertyNames(subObj);
    delete subPropNames.route;

    /*
     var superObj = eval(this._className);
     var superPropNames = Object.getOwnPropertyNames(superObj);
     console.log( 'superPropNames:' + superPropNames);
     */
    var allKeys = [];


    for ( var prop in propNames = subPropNames ){

        if( ( typeof eval('this.' + propNames[prop]) ) != 'function' && ( typeof eval('subObj.' + propNames[prop]) ) != 'undefined' ){
            allKeys.push(propNames[prop]);
        }
    }
    /*
     for ( var prop in propNames = superPropNames ){

     if( ( typeof eval('this.' + propNames[prop]) ) != 'function' && ( typeof eval('superObj.' + propNames[prop]) ) != 'undefined' ){
     console.log ( 'prop:' + propNames[prop] + ' value:' + eval('superObj.' + propNames[prop]) );
     allKeys.push(propNames[prop]);
     }
     }
     */

    var uniqueKeys = unique(allKeys);

    var map= new Map();

    for ( var e in uniqueKeys ){
        map.put( uniqueKeys[e], eval('subObj.' + uniqueKeys[e] ));
    }

    return map.getJsonString();
};


SuperType.chkBrowser = function() {
    if (typeof(XDomainRequest) !== "undefined") {
        // We're in IE 8+.
        if ('withCredentials' in new XMLHttpRequest()) {
            // We're in IE 10+.
            return false;
        }
        return true;
    }
    return false;
};

/**
 * Options:
 *   route: is classes, users, login, etc.
 *   objectId: null if there is no associated objectId.
 *   method: the http method for the REST API.
 *   dataObject: the payload as an object, or null if there is none.
 *   useMasterKey: overrides whether to use the master key if set.
 * @ignore
 */
SuperType._request = function(options, callF, addF) {

    var route = options.route;
    var className = options.className;
    var objectId = options.objectId;
    var method = options.method;
    var useMasterKey = options.useMasterKey;
    var dataObject = JSON.parse(options.data);

    if(className == "User"){
        route = "users";
        className = null;
    }

    if (!dataObject._appId) {
        if( NoservInit._map.size() > 0 ){
            dataObject._appId = NoservInit._map.keys()[0];
            dataObject._appKey = NoservInit.get(NoservInit._map.keys()[0]);
        }else{
            throw "applicationId not exist.";
        }

    }

    if (!dataObject._appKey && !dataObject._masterKey) {
        throw "javascriptKey not exist.";
    }

    if (!sessionToken) {
        if(SuperType.localStorage.n_sessionToken)
            sessionToken = SuperType.localStorage.n_sessionToken;
        //throw "sessionToken not exist.";
    }


    if (route !== "batch" &&
        route !== "classes" &&
        route !== "schedule" &&    // added for schedule service
        route !== "apps" &&         // added for app service
        route !== "analytics" &&         // added for analytics service
        route !== "installations" &&         // added for installations service
        route !== "events" &&
        route !== "files" &&
        route !== "functions" &&
        route !== "login" &&
        route !== "push" &&
        route !== "requestPasswordReset" &&
        route !== "rest_verify_analytics" &&
        route !== "users" &&
        route !== "jobs") {
        throw "Bad route: '" + route + "'.";
    }

    var url = dataObject._serverUrl || SuperType.serverUrl;

    if (url.charAt(url.length - 1) !== "/") {
        url += "/";
    }
    url += "1/" + route;
    if (className) {
        url += "/" + className;
    }
    if (objectId) {
        url += "/" + objectId;
    }

    dataObject._method = method;
    if (method !== "POST") {
        method = "POST";
    }


    dataObject._ApplicationId = dataObject._appId;
    if (!useMasterKey) {
        dataObject._JavaScriptKey = dataObject._appKey;
    } else {
        dataObject._MasterKey = dataObject._masterKey;
    }

    if (sessionToken) {
        dataObject._SessionToken = sessionToken;
    }

    delete dataObject._appId;
    delete dataObject._appKey;
    delete dataObject._masterKey;
    delete dataObject._sessionToken;
    delete dataObject._serverUrl;
    delete dataObject._className;

    var dataobj = JSON.stringify(dataObject);
    console.log("***  request body : "+dataobj);
    console.log("***  URL  : "+url);
    return SuperType.sendAjax(method, url, dataobj, callF, addF);
};

SuperType.sendXdr = function(method, url, data, callF, addF){
    var xdr = new XDomainRequest();

    var dataObject = JSON.parse(data);
    var dataMethod = dataObject._method;

    xdr.onload = function() {
        var response;
        try {
            if(dataMethod != null && dataMethod != 'DELETE' && xdr.responseText !==  ''){
                response = JSON.parse(xdr.responseText);
            } else if( xdr.responseText ===  '' ){
                response = null;
            }
        } catch (e) {
            console.log(e);
        }

        if (response) {
            if(addF)
                addF(response);
            if(callF && callF.success)
                return callF.success(response);
            return response;
        }
        return null;
    };
    xdr.onerror = xdr.ontimeout = function() {
        // Let's fake a real error message.
        var error = '익스플로러는 에러를 확인할 수 없습니다.\n데이터 입력시에 난 에러라면 이미 존재하는 키값을 사용했을 가능성이 있습니다. 보낸데이터 확인해 주십시오.';
        console.error('익스플로러는 에러를 확인할 수 없습니다.');
        if(callF && callF.error)
            return callF.error(data, error);
    };
    xdr.onprogress = function() {console.log('onprogress');};
    xdr.open(method, url);
    xdr.send(data);
};

SuperType.sendAjax = function(method, url, data, callF, addF){
    //var options = {
    //    success: success,
    //    error: error
    //};

    if (SuperType.chkBrowser()) {
        return SuperType.sendXdr(method, url, data, callF, addF);
    }

    var dataObject = JSON.parse(data);
    var dataMethod = dataObject._method;

    var handled = false;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {

        if (xhr.readyState === 4) {
            if (handled) {
                return;
            }
            handled = true;

            console.log( 'xhr.status:' + xhr.status );
            if (xhr.status >= 200 && xhr.status < 300){
                var response;
                try {
                    if(dataMethod != null && dataMethod != 'DELETE' &&  xhr.responseText !==  '' ){
                        response = JSON.parse( xhr.responseText );
                    } else if( xhr.responseText ===  '' ){ // for setTableACL button
                        response = null;
                        return callF.success(response);
                    }
                } catch (e) {
                    console.log(e);
                }
                if (response || dataMethod === 'DELETE'){  //  modified from if ( response ) for function and schedule service
                    if(addF){
                        addF(response);
                    }
                    if(callF && callF.success){
                        return callF.success(response);
                    }
                    return response;
                }
                return null;
            } else {
                var error = '실패 - 응답상태값 :'+ xhr.status+'  응답본문 : '+xhr.responseText;
                console.error('실패 - 응답상태값 :'+ xhr.status+'  응답본문 : '+xhr.responseText);

                if(callF && callF.error)
                    return callF.error(data, error);
            }
        }
    };
    xhr.open(method, url, true);
    //xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send(data);
};
// 3. Core-2. Core Extension
// ======================================================

// ======================================================
// User Class
SuperType.User = function(sessionToken, appId, appKey ){

    var User = new SuperType('User', sessionToken, appId, appKey);

//    User.username = '';
//    User.password = '';
//    User.email = '';

    User.signUp = function(attrs, options) {
        var error;
        options = options || {};


        var username = (attrs && attrs.username) || this.get("username");
        if (!username || (username === "")) {
            error = "Cannot sign up user with an empty name.";
            console.log(error);
            if (options && options.error) {
                options.error(this, error);
            }
            return error;
        }

        var password = (attrs && attrs.password) || this.get("password");
        if (!password || (password === "")) {
            error = "Cannot sign up user with an empty password.";
            if (options && options.error) {
                return options.error(this, error);
            }
            // return error;
        }
        /*
         var newOptions = options;
         newOptions.success = function() {
         if (options.success) {
         options.success.apply(this, arguments);
         }
         };*/
        return this.save(attrs, options);
    };

    User.save = function(attrs, options) {

        var method = (attrs && attrs.objectId) ? 'PUT' : 'POST';
        var json = this.getJson();
        var route = "users";
        var className = null;



        var request = SuperType._request({
            route: route,
            className: className,
            objectId: (attrs && attrs.objectId) ? attrs.objectId : null,
            method: method,
            useMasterKey: options.useMasterKey,
            data: json
        },options);

        return request;
    };

    User.logIn = function(username, password, options) {
        options = options || {};
        //console.log(User.get("username"));
        //this.set("username", encodeURIComponent(username));
        //this.set("password", encodeURIComponent(password));
        this.set("username", username);
        this.set("password", password);
        //console.log(User.get("username"));
        var request =  SuperType._request({
            route: "login",
            method: "GET",
            useMasterKey: options.useMasterKey,
            data: this.getJson()
        },options, User.saveLoginSession);

        return request;
    }

    User.saveLoginSession = function(data){
        if(data.sessionToken)
            SuperType.localStorage.sessionToken = data.sessionToken;
    }

    User.currentUser = function(options) {
        options = options || {};

        var request =  SuperType._request({
            route: "users",
            method: "GET",
            className: "me",
            useMasterKey: options.useMasterKey,
            data: this.getJson()
        },options);

        return request;
    }

    User.delete = function(objId, options) {
        options = options || {};

        var request =  SuperType._request({
            route: "users",
            method: "DELETE",
            objectId: objId,
            useMasterKey: options.useMasterKey,
            data: this.getJson()
        },options);

        return request;
    }

    User.getUser = function(objId, options) {
        options = options || {};

        var request =  SuperType._request({
            route: "users",
            method: "GET",
            objectId: objId,
            useMasterKey: options.useMasterKey,
            data: this.getJson()
        },options);

        return request;
    }



    return User || {};
}
// User Class End

// ======================================================
// Object Class
SuperType.Object = function(objectName, sessionToken, appId, appKey ){

    var Object = new SuperType(objectName, sessionToken, appId, appKey);
    Object.route = 'classes';
    Object.save = function(attrs, options) {

        if( !attrs ){
            if( options && options.error )
                return options.error(attrs, "객체데이터를 넘기지 않았습니다.");
            else
                return "객체데이터를 넘기지 않았습니다.";
        }

        if(attrs._className)                        // ->
            Object.className = attrs._className;    // <- added for function and schedule service

        var method = (attrs && attrs.objectId) ? 'PUT' : 'POST';

        var request = SuperType._request({
            route: Object.route,            // -> modified from route : "classes"
            className: Object._className,    // <- modified from className: attrs._className for function and schedule service
            objectId: (attrs && attrs.objectId) ? attrs.objectId : null,
            method: method,
            useMasterKey: options.useMasterKey,
            data: this.getJson()
        },options);

        return request;
    };

    Object.delete = function(attrs, options) {
        if(!attrs || !attrs.objectId){
            if(options && options.error)
                return options.error(attrs, "객체 ID값이 없습니다.");
            else
                return "객체 ID값이 없습니다.";
        }

        if(attrs._className)                    // ->
            Object.className = attrs._className;// <- added for function and schedule service

        options = options || {};

        var request =  SuperType._request({
            route: Object.route,            // -> modified from route : "classes"
            className: Object.className,    // <- modified from className: attrs._className for function and schedule service
            method: "DELETE",
            objectId: (attrs && attrs.objectId) ? attrs.objectId : null,
            useMasterKey: options.useMasterKey,
            data: this.getJson()
        },options);

        return request;
    };

    return Object || {};
};
// Object Class End

// ======================================================
// Query Class
SuperType.Query = function(obj){
    this.objectClass = obj;
    this.className = obj._className;

    this._where = {};
    this._include = [];
    this._limit = -1; // negative limit means, do not send a limit
    this._skip = 0;
    this._extraOptions = {};
    this.route = obj.route; // added for function and schedule service
};

SuperType.Query.or = function() {
    var queries = toArray(arguments);
    var className = null;
    each(queries, function(q) {
        if (className == null) {
            className = q.className;
        }

        if (className !== q.className) {
            throw "All queries must be for the same class";
        }
    });
    var query = new SuperType.Query(className);
    query._orQuery(queries);
    return query;
};

SuperType.Query.prototype = {
    sessionToken : "",
    equalTo: function(key, value) {
        if (!value) {
            return "value not exist";
        }

        this._where[key] = value;
        return this;
    },

    get: function(objectId, options) {
        var self = this;
        var route = this.route || "classes";    // -> modified from var route = "classes";

        if(route !== 'classes')
            this.className = null;              // <- added for schedule and function service

        if(this.className == 'User'){
            route = "users";
            this.className = null;
        }

        self.equalTo( 'objectId', objectId );
        options = options || {};

        var params = JSON.parse(this.toJSON());
        params.limit = 1;

        if(options.useMasterKey && this._masterKey)     // ->
            params._masterKey = this._masterKey;        // <- added for schedule and function service to inject masterkey

        var optionsObj = {                              // -> for ACL
            route: route,
            className: this.className,
            method: "GET",
            useMasterKey: options.useMasterKey,
            data: JSON.stringify(params)
        };                                              // <-

        if( options.objectId === 'ACL' ){    // -> for ACL
            optionsObj.objectId = options.objectId;
        }                                               // <-

        var request = SuperType._request( optionsObj, options );

        return request
    },

    _addCondition: function(key, condition, value) {
        if (!this._where[key]) {
            this._where[key] = {};
        }
        this._where[key][condition] = value;
        return this;
    },

    toJSON: function(type) {
        var whereData = JSON.stringify(this._where);

        if(type === 'where')
            return whereData;

        var params = {
            where: whereData
        };

        if (this._include.length > 0) {
            params.include = this._include.join(",");
        }
        if (this._select) {
            params.keys = this._select.join(",");
        }
        if (this._limit >= 0) {
            params.limit = this._limit;
        }
        if (this._skip > 0) {
            params.skip = this._skip;
        }
        if( this._order ){
            params.order = this._order.join(",");
        }

//        SuperType._objectEach(this._extraOptions, function(v, k) {
//            params[k] = v;
//        });

        return JSON.stringify(params);
    },


    find: function(options) {
        options = options || {};

        var route = this.route || "classes";    // -> modified from var route = "classes";
        if( route !== 'classes')
            this.className = null;              // <- added for schedule and function service

        if(this.className == 'User'){
            route = "users";
            this.className = null;
        }

        var params = JSON.parse( this.toJSON() );   // ->
        if( options.useMasterKey && this._masterKey ){
            params._masterKey = this._masterKey;
            params._limit = -1;
        }                                           // <- added to add master key for schedule find function

        if( options.hasOwnProperty('order')) {      // ->
            params.order = options.order;
        }                                           //  <-

        if( this._sessionToken ) {                        // ->
            params._sessionToken = this._sessionToken;
        }

        if(options.aggregate){
            params.aggregate = options.aggregate;
        }

        var request = SuperType._request({
            route: route,
            className: this.className,
            method: "GET",
            useMasterKey: options.useMasterKey,
            data: JSON.stringify( params ) // modified from data: this.toJSON() for schedule find function
        },options);

        return request
    },

    count: function(options) {
        var self = this;
        options = options || {};

        var params = JSON.parse(this.toJSON());
        params.limit = 0;
        params.count = 1;
        var request = SuperType._request({
            route: "classes",
            className: self.className,
            method: "GET",
            useMasterKey: options.useMasterKey,
            data: JSON.stringify(params)
        },options);

        return request
    },

    first: function(options) {
        var self = this;
        options = options || {};

        var params = JSON.parse(this.toJSON());
        params.limit = 1;

        var request = Parse._request({
            route: "classes",
            className: this.className,
            method: "GET",
            useMasterKey: options.useMasterKey,
            data: JSON.stringify(params)
        }, options);

        return request
    },

    skip: function(n) {
        this._skip = n;
        return this;
    },

    limit: function(n) {
        this._limit = n;
        return this;
    },

    notEqualTo: function(key, value) {
        this._addCondition(key, "$ne", value);
        return this;
    },

    lessThan: function(key, value) {
        this._addCondition(key, "$lt", value);
        return this;
    },

    greaterThan: function(key, value) {
        this._addCondition(key, "$gt", value);
        return this;
    },

    lessThanOrEqualTo: function(key, value) {
        this._addCondition(key, "$lte", value);
        return this;
    },

    greaterThanOrEqualTo: function(key, value) {
        this._addCondition(key, "$gte", value);
        return this;
    },

    containedIn: function(key, values) {
        this._addCondition(key, "$in", values);
        return this;
    },

    notContainedIn: function(key, values) {
        this._addCondition(key, "$nin", values);
        return this;
    },

    containsAll: function(key, values) {
        this._addCondition(key, "$all", values);
        return this;
    },

    exists: function(key) {
        this._addCondition(key, "$exists", true);
        return this;
    },

    doesNotExist: function(key) {
        this._addCondition(key, "$exists", false);
        return this;
    },
    matches: function(key, regex, modifiers) {
        this._addCondition(key, "$regex", regex);
        if (!modifiers) { modifiers = ""; }
        if (regex.ignoreCase) { modifiers += 'i'; }
        if (regex.multiline) { modifiers += 'm'; }

        if (modifiers && modifiers.length) {
            this._addCondition(key, "$options", modifiers);
        }
        return this;
    },
    _orQuery: function(arrs) {
        //for("arr만큼돌면서 스트링 더하기")

        var queryJSON = collect(arrs, function(q) {
            return q.toJSON('where');
        });

        this._where.$or = queryJSON;
        return this;
    }
};
// Query Class End

// Push
// ======================================================
SuperType.Push = SuperType.Push || {};

SuperType.Push.send = function(data, options) {
    options = options || {};

//    if (data.where) {
//        data.where = data.where.toJSON().where;
//    }

    console.log('now push:' + JSON.stringify(data));

    var request = SuperType._request({
        route: 'push',
        method: 'POST',
        data: JSON.stringify(data),
        useMasterKey: options.useMasterKey
    }, options);
    return request;
};
// Push End

// ======================================================
// File Class

var breaker = {};

var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;


var push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;


var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;


var each = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
            if (iterator.call(context, obj[i], i, obj) === breaker) return;
        }
    } else {
        for (var key in obj) {
            if (has(obj, key)) {
                if (iterator.call(context, obj[key], key, obj) === breaker) return;
            }
        }
    }
};

var collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
};

var isArray = Array.isArray || function(obj) {
        return toString.call(obj) == '[object Array]';
    };
var isString = function(obj) {
    return toString.call(obj) == '[object String]';
};
var isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
};
var has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
};

var values = function(obj) {
    var values = [];
    for (var key in obj) if (has(obj, key)) values.push(obj[key]);
    return values;
};
var identity = function(value) {
    return value;
};

var toArray = function(obj) {
    if (!obj) return [];
    if (isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return collect(obj, identity);
    return values(obj);
};

var TempVal = function(data){
    this.data = data;
}
var readAsync = function(file, type) {
    var temp = new TempVal(null);
    if (typeof(FileReader) === "undefined") {
        //console.log("unsupported browser");
        return "Attempted to use a FileReader on an unsupported browser.";
    }

    var reader = new FileReader();
    reader.onloadend = function() {
        if (reader.readyState !== 2) {
            return "Error reading file.";
        }

        var dataURL = reader.result;
        var matches = /^data:([^;]*);base64,(.*)$/.exec(dataURL);
        if (!matches) {
            return "Unable to interpret data URL: " + dataURL;
        }
        temp.data = matches[2];
    };
    reader.readAsDataURL(file);
    return temp;
};

SuperType.File = function(name, data, type) {
    this._name = name;

    // Guess the content type from the extension if we need to.
    var extension = /\.([^.]*)$/.exec(name);
    if (extension) {
        extension = extension[1].toLowerCase();
    }
    var guessedType = type || mimeTypes[extension] || "application/octet-stream"; //text/plain이었음

    if (isArray(data)) {
        this._source = {
            base64: encodeBase64(data),
            _ContentType: guessedType
        };
    } else if (data && data.base64) {
        this._source = {
            base64: data.base64,
            _ContentType: guessedType
        };
    } else if (typeof(File) !== "undefined" && data instanceof File) {
        this._source = {};
        this._source.base64 = readAsync(data);
        this._source._ContentType = guessedType;
    } else if(isString(data)){
        throw "Creating a Noserv.File from a String is not yet supported.";
    }
};

SuperType.File.prototype = {

    name: function() {
        return this._name;
    },

    url: function() {
        return this._url;
    },

    save: function(options) {
        options= options || {};

        if(this._source.base64.data)
            this._source.base64 = this._source.base64.data;

        var self = this;

        return SuperType._request({
            route: "files",
            className: self._name,
            method: 'POST',
            data: JSON.stringify(this._source),
            useMasterKey: options.useMasterKey
        }, options);
        /*
         if (!self._previousSave) {
         self._previousSave = self._source.then(function(base64, type) {
         var data = {
         base64: base64,
         _ContentType: type
         };
         return Parse._request({
         route: "files",
         className: self._name,
         method: 'POST',
         data: data,
         useMasterKey: options.useMasterKey
         });
         }).then(function(response) {
         self._name = response.name;
         self._url = response.url;
         return self;
         });
         }*/
    }
};

var b64Digit = function(number) {
    if (number < 26) {
        return String.fromCharCode(65 + number);
    }
    if (number < 52) {
        return String.fromCharCode(97 + (number - 26));
    }
    if (number < 62) {
        return String.fromCharCode(48 + (number - 52));
    }
    if (number === 62) {
        return "+";
    }
    if (number === 63) {
        return "/";
    }
    throw "Tried to encode large digit " + number + " in base64.";
};

var times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
};

var encodeBase64 = function(array) {
    var chunks = [];
    chunks.length = Math.ceil(array.length / 3);
    times(chunks.length, function(i) {
        var b1 = array[i * 3];
        var b2 = array[i * 3 + 1] || 0;
        var b3 = array[i * 3 + 2] || 0;

        var has2 = (i * 3 + 1) < array.length;
        var has3 = (i * 3 + 2) < array.length;

        chunks[i] = [
            b64Digit((b1 >> 2) & 0x3F),
            b64Digit(((b1 << 4) & 0x30) | ((b2 >> 4) & 0x0F)),
            has2 ? b64Digit(((b2 << 2) & 0x3C) | ((b3 >> 6) & 0x03)) : "=",
            has3 ? b64Digit(b3 & 0x3F) : "="
        ].join("");
    });
    return chunks.join("");
};

var mimeTypes = {
    ai: "application/postscript",
    aif: "audio/x-aiff",
    aifc: "audio/x-aiff",
    aiff: "audio/x-aiff",
    asc: "text/plain",
    atom: "application/atom+xml",
    au: "audio/basic",
    avi: "video/x-msvideo",
    bcpio: "application/x-bcpio",
    bin: "application/octet-stream",
    bmp: "image/bmp",
    cdf: "application/x-netcdf",
    cgm: "image/cgm",
    "class": "application/octet-stream",
    cpio: "application/x-cpio",
    cpt: "application/mac-compactpro",
    csh: "application/x-csh",
    css: "text/css",
    dcr: "application/x-director",
    dif: "video/x-dv",
    dir: "application/x-director",
    djv: "image/vnd.djvu",
    djvu: "image/vnd.djvu",
    dll: "application/octet-stream",
    dmg: "application/octet-stream",
    dms: "application/octet-stream",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml." +
    "document",
    dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml." +
    "template",
    docm: "application/vnd.ms-word.document.macroEnabled.12",
    dotm: "application/vnd.ms-word.template.macroEnabled.12",
    dtd: "application/xml-dtd",
    dv: "video/x-dv",
    dvi: "application/x-dvi",
    dxr: "application/x-director",
    eps: "application/postscript",
    etx: "text/x-setext",
    exe: "application/octet-stream",
    ez: "application/andrew-inset",
    gif: "image/gif",
    gram: "application/srgs",
    grxml: "application/srgs+xml",
    gtar: "application/x-gtar",
    hdf: "application/x-hdf",
    hqx: "application/mac-binhex40",
    htm: "text/html",
    html: "text/html",
    ice: "x-conference/x-cooltalk",
    ico: "image/x-icon",
    ics: "text/calendar",
    ief: "image/ief",
    ifb: "text/calendar",
    iges: "model/iges",
    igs: "model/iges",
    jnlp: "application/x-java-jnlp-file",
    jp2: "image/jp2",
    jpe: "image/jpeg",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "application/x-javascript",
    kar: "audio/midi",
    latex: "application/x-latex",
    lha: "application/octet-stream",
    lzh: "application/octet-stream",
    m3u: "audio/x-mpegurl",
    m4a: "audio/mp4a-latm",
    m4b: "audio/mp4a-latm",
    m4p: "audio/mp4a-latm",
    m4u: "video/vnd.mpegurl",
    m4v: "video/x-m4v",
    mac: "image/x-macpaint",
    man: "application/x-troff-man",
    mathml: "application/mathml+xml",
    me: "application/x-troff-me",
    mesh: "model/mesh",
    mid: "audio/midi",
    midi: "audio/midi",
    mif: "application/vnd.mif",
    mov: "video/quicktime",
    movie: "video/x-sgi-movie",
    mp2: "audio/mpeg",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    mpe: "video/mpeg",
    mpeg: "video/mpeg",
    mpg: "video/mpeg",
    mpga: "audio/mpeg",
    ms: "application/x-troff-ms",
    msh: "model/mesh",
    mxu: "video/vnd.mpegurl",
    nc: "application/x-netcdf",
    oda: "application/oda",
    ogg: "application/ogg",
    pbm: "image/x-portable-bitmap",
    pct: "image/pict",
    pdb: "chemical/x-pdb",
    pdf: "application/pdf",
    pgm: "image/x-portable-graymap",
    pgn: "application/x-chess-pgn",
    pic: "image/pict",
    pict: "image/pict",
    png: "image/png",
    pnm: "image/x-portable-anymap",
    pnt: "image/x-macpaint",
    pntg: "image/x-macpaint",
    ppm: "image/x-portable-pixmap",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml." +
    "presentation",
    potx: "application/vnd.openxmlformats-officedocument.presentationml." +
    "template",
    ppsx: "application/vnd.openxmlformats-officedocument.presentationml." +
    "slideshow",
    ppam: "application/vnd.ms-powerpoint.addin.macroEnabled.12",
    pptm: "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
    potm: "application/vnd.ms-powerpoint.template.macroEnabled.12",
    ppsm: "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
    ps: "application/postscript",
    qt: "video/quicktime",
    qti: "image/x-quicktime",
    qtif: "image/x-quicktime",
    ra: "audio/x-pn-realaudio",
    ram: "audio/x-pn-realaudio",
    ras: "image/x-cmu-raster",
    rdf: "application/rdf+xml",
    rgb: "image/x-rgb",
    rm: "application/vnd.rn-realmedia",
    roff: "application/x-troff",
    rtf: "text/rtf",
    rtx: "text/richtext",
    sgm: "text/sgml",
    sgml: "text/sgml",
    sh: "application/x-sh",
    shar: "application/x-shar",
    silo: "model/mesh",
    sit: "application/x-stuffit",
    skd: "application/x-koan",
    skm: "application/x-koan",
    skp: "application/x-koan",
    skt: "application/x-koan",
    smi: "application/smil",
    smil: "application/smil",
    snd: "audio/basic",
    so: "application/octet-stream",
    spl: "application/x-futuresplash",
    src: "application/x-wais-source",
    sv4cpio: "application/x-sv4cpio",
    sv4crc: "application/x-sv4crc",
    svg: "image/svg+xml",
    swf: "application/x-shockwave-flash",
    t: "application/x-troff",
    tar: "application/x-tar",
    tcl: "application/x-tcl",
    tex: "application/x-tex",
    texi: "application/x-texinfo",
    texinfo: "application/x-texinfo",
    tif: "image/tiff",
    tiff: "image/tiff",
    tr: "application/x-troff",
    tsv: "text/tab-separated-values",
    txt: "text/plain",
    ustar: "application/x-ustar",
    vcd: "application/x-cdlink",
    vrml: "model/vrml",
    vxml: "application/voicexml+xml",
    wav: "audio/x-wav",
    wbmp: "image/vnd.wap.wbmp",
    wbmxl: "application/vnd.wap.wbxml",
    wml: "text/vnd.wap.wml",
    wmlc: "application/vnd.wap.wmlc",
    wmls: "text/vnd.wap.wmlscript",
    wmlsc: "application/vnd.wap.wmlscriptc",
    wrl: "model/vrml",
    xbm: "image/x-xbitmap",
    xht: "application/xhtml+xml",
    xhtml: "application/xhtml+xml",
    xls: "application/vnd.ms-excel",
    xml: "application/xml",
    xpm: "image/x-xpixmap",
    xsl: "application/xml",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml." +
    "template",
    xlsm: "application/vnd.ms-excel.sheet.macroEnabled.12",
    xltm: "application/vnd.ms-excel.template.macroEnabled.12",
    xlam: "application/vnd.ms-excel.addin.macroEnabled.12",
    xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
    xslt: "application/xslt+xml",
    xul: "application/vnd.mozilla.xul+xml",
    xwd: "image/x-xwindowdump",
    xyz: "chemical/x-xyz",
    zip: "application/zip"
};
// File Class End
// ======================================================

// cloud function
SuperType.Cloud = {};
SuperType.Cloud.run = function(functionName, param, callF) {

    if(callF.test) {

        var response = {

            success : function(data) {

                callF.success(data);
            },
            error : function(message) {

                callF.error(param, message);
            }
        };

        callF.test(param, response);
    } else {

        var request =  SuperType._request({
            route: "functions",
            objectId : functionName,
            method: "POST",
            useMasterKey: false,
            data: JSON.stringify(param)
        }, {

            success : function(data) {

                callF.success(data);
            },
            error : function(data, message) {

                callF.error(data, message);
            }
        });

        return request;
    }
};

// acl
// 임시 API입니다.
SuperType.ObjectACL = function(className, sessionToken, masterKey) {

    this.ACL = {};
    this.className = className;
    this.sessionToken = sessionToken;
    this.masterKey = masterKey;

    this.setReadAccess = function(userId, isAllow) {

        if(!this.ACL[userId])
            this.ACL[userId] = {};

        this.ACL[userId].read = isAllow;
    };

    this.setWriteAccess = function(userId, isAllow) {

        if(!this.ACL[userId])
            this.ACL[userId] = {};

        this.ACL[userId].write = isAllow;
    };

    this.setMasterAccess = function(userId, isAllow) {

        if(!this.ACL[userId])
            this.ACL[userId] = {};

        this.ACL[userId].master = isAllow;
    };

    this.setPublicReadAccess = function(isAllow) {

        this.setReadAccess('*', isAllow);
    };

    this.setPublicWriteAccess = function(isAllow) {

        this.setWriteAccess('*', isAllow);
    };

    this.save = function(callF) {

        var request =  SuperType._request({
            route: "classes",
            className: this.className,
            objectId: 'ACL',
            method: "POST",
            useMasterKey: true,
            data: JSON.stringify({ACL : this.ACL, _sessionToken : this.sessionToken, _masterKey : this.masterKey })
        }, {

            success : function(data) {

                callF.success(data);
            },
            error : function(data, message) {

                callF.error(data, message);
            }
        });
    };
};

// aggregate
SuperType.Aggregate = function(obj){

    this.objectClass = obj;
    this.className = obj._className;
    this.masterKey = obj.masterKey;

    this._aggregate = [];
};

SuperType.Aggregate.prototype = {

    push : function(pipeline) {

        this._aggregate.push(pipeline);
    },

    toJSON: function() {

        var params = {
            aggregate: this._aggregate,
            _masterKey : this.masterKey
        };

        return JSON.stringify(params);
    },

    aggregate: function(options) {
        options = options || {};
        var route = "classes";

        if(this.className == 'User'){
            route = "users";
            this.className = null;
        }

        var request = SuperType._request({
            route: route,
            className: this.className,
            method: "GET",
            useMasterKey: options.useMasterKey,
            data: this.toJSON()
        },options);

        return request
    }
};

//  Class
var Noserv = SuperType;
