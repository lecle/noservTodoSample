// The sessionToken variable is required. please declare it with appId and appkey(rest-api key) at the very first part of the file.
var sessionToken = '';
var appId = 'vbnwdhijshq9qkt9tj24uf2z7opta9k9';
var appKey = 'mwtsrs9hihllq5miah5y872ntg25ipb9';

// initialize noserv sdk with appId and appKey
NoservInit.put(appId, appKey);

// global variables
var EnterKey = 13;
var bRun = false;
var $todoList;

/*
 *  Declare noserv SDK objects first and you can reuse these object like,
 *    EX )
 *    var user = User.extend();
 *    user.save(....
 */
var User = new Noserv.User(sessionToken, appId, appKey);
var NsTodo = new Noserv.Object('NsTodo', sessionToken, appId, appKey);

$.fn.isBound = function(type, fn) {
    var data = this.data.events[type];

    if (data === undefined || data.length === 0) {
        return false;
    }

    return (-1 !== $.inArray(fn, data));
};

// Execute when the DOM is fully loaded.
$(document).ready(function() {

    runBind();
    $todoList = $('#todo-list');
	$('#new-todo').keypress(function(e) {

        if (e.which === EnterKey) {

            if(!bRun) {

                bRun = true;
                var new_todo = $('#new-todo').val();
                // --> SDK : save an object which belongs  NsTodo class and contains objectId, checked and objectId fields with its values.
                var anObject =  NsTodo.extend();
                anObject.set('title', new_todo);
                anObject.set('checked', '0');
                anObject.set('objectId', '');
                anObject.save(anObject, {
                    success: function(data) {

                        $('#new-todo').val('');
                        todos_list();
                        bRun = false;
                    },
                    error: function(data, error) {

                        console.log(error);
                        console.log("error -  : " + data);
                        bRun = false;
                    }
                });
                // <-- SDK
            }
        }
    });
    // Log In button
    $('#to_user_lg_pw').keypress(function(e) {
        if (e.which === EnterKey) todos_login();
    });
    // Sign up button
    $('#to_user_sg_pw').keypress(function(e) {
        if (e.which === EnterKey) todos_signupchk();
    });
    // If there is a sessionToken( After Login ), use it.
    if(sessionStorage.getItem('tutorial_todos_sessionToken') !== null){

        sessionToken = sessionStorage.getItem('tutorial_todos_sessionToken');
        todos_list();
    }
});

// Reset this application
function runBind(){

    $('.destroy').on('click', function(e) {

        var obj_Id = $(this).attr('data');
        //  -- > SDK : delete an object which belongs NsTodo class and has injected objectId.
        var todo =  NsTodo.extend();
        todo.set('objectId', obj_Id);
        todo.delete(todo, {
            success: function(data){
                // Do nothing
            },
            error: function(data, error){
                console.log(error);
                console.log("error -  : " + data.getJson());
            }
        });
        // < -- SDK
        var $currentListItem = $(this).closest('li');
        $currentListItem.remove();
    });
    $('.toggle').on('click', function(e){

        var $currentListItemChk = $(this).closest('li').find('input');
        var obj_Id = $(this).attr('data');
        // --> SDK : save an object which belongs NsTodo class and contains objectId and checked fields with its values.
        var todo =  NsTodo.extend();
        todo.set('objectId', obj_Id);
        if($currentListItemChk.is(':checked')){
            todo.set('checked', '1');
        } else {
            todo.set('checked', '0');
        }
        todo.save(todo, {
            success: function(data) {
                todos_list();
            },
            error: function(data, error) {

                console.log(error);
                console.log("error - : " + data); // 요청한 데이터 출력
            }
        });
        // <-- SDK
    });
}

function writingList(results){

    $('.destroy').off('click');
    $('.toggle').off('click');
    $todoList.empty();
    var todos = $todoList.html();
    for (var i = 0; i < results.length; i++) {

        var obj = results[i];
        todos += ""+
        "<li>" +
        "<div class='view'>";
        if(obj.checked == "0"){

            todos +="<input class='toggle' type='checkbox' data='" + obj.objectId + "'>" +
            "<label data='' style='margin-left: 10px;'>" + " " + obj.title + "</label>" +
            "<a class='destroy' data='" + obj.objectId + "'></a>";
        } else {

            todos += "<input class='toggle' type='checkbox' data='" + obj.objectId + "' checked>" +
            "<label data='done' style='margin-left: 10px; text-decoration: line-through;'>" + " " + obj.title + "</label>" +
            "<a class='destroy' data='" + obj.objectId + "'></a>";
        }
        todos += "</div>" +
        "</li>";
    }
    $todoList.html(todos);
    runBind();
    $('#main').show();
}

function todos_list(){

    // --> SDK : get all objects in the NsTodo class.
    var todo =  NsTodo.extend();
    var query = new Noserv.Query(todo);
    query.find({
        success: function(data) {

            // The returned value will be in data.results with array type.
            if(data.results.length){
                writingList(data.results);
            }else{
                console.log("None of the data is returned")
            }
        },
        error: function(data, error) {

            console.log(error);
            console.log("error -  :  " + data);
        }
    });
    // <-- SDK
}



function todos_login(){

    var user_id = $("#to_user_lg_id").val();
    var user_pw = $("#to_user_lg_pw").val();
    if(user_id.length == 0){
        alert('Please Enter ID');
    }else if(user_pw.length == 0){
        alert('Please Enter Password');
    } else {
        // --> SDK : User will login with provided user id and password.
        var user = User.extend();
        user.logIn(user_id, user_pw, {
            success: function(data) {

                sessionStorage.setItem('tutorial_todos_sessionToken', data.sessionToken);
                location.href = './todoslist.html';
            },
            error: function(data, error) {

                console.log(error);
                console.log("error -  : " + data); // 요청한 데이터 출력
                dig_popup('Login', 'The user ID and password is not matching.', false);
            }
        });
        // <-- SDK
    }
}

function todos_signupchk(){

    var user_id = $("#to_user_sg_id").val();
    var user_pw = $("#to_user_sg_pw").val();
    var user_pn = $("#to_user_sg_pn").val();
    if(user_id.length == 0){
        alert('Please Enter ID');
    } else if(user_pw.length == 0){
        alert('Please Enter Password');
    } else {
        // --> SDK : User will sign up with provided user id and password.
        var user = User.extend();
        user.set('username', user_id);
        user.set('password', user_pw);
        user.set('phoneNumber', user_pn);
        user.signUp( null, {
            success: function(data) {
                dig_popup('Sign Up', 'Signup Completed\nWelcome to Noserv. To-Dos', true);
            },
            error: function(data, error) {

                console.log(error);
                console.log("error -  : " + data);
                dig_popup('Sign Up', 'Sign up error. Please try again with different ID', false);
            }
        });
        // <-- SDK
    }
}

function todos_logout(){

    sessionStorage.removeItem('tutorial_todos_sessionToken');
    location.href = './todos.html';
}

function dig_popup(s_tit, s_txt, s_tf){
    $("#dig_div").attr('title', s_tit);
    $('#dig_p').text(s_txt);
    $("#dig_div").dialog({
        modal: true,
        buttons: {
            OK: function(){

                $(this).dialog("close");
                if(s_tf){
                    $("#to_user_sg_id").val('');
                    $("#to_user_sg_pw").val('');
                }
            }
        }
    });
}
