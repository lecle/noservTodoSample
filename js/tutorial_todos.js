// KEY
var sessionToken = '';
var appId = 'vbnwdhijshq9qkt9tj24uf2z7opta9k9';
var appKey = 'mwtsrs9hihllq5miah5y872ntg25ipb9';

NoservInit.put(appId, appKey);

var User = new Noserv.User(sessionToken, appId, appKey);
var user = User.extend();

// Super Type
var NsTodo = new Noserv.Object('NsTodo', sessionToken, appId, appKey);
var todo = NsTodo.extend();

todo.getClassName();
todo.getAppId();

// 쿼리
var NsTodoQuery = new Noserv.Object("NsTodo", sessionToken);
var todoquery = NsTodoQuery .extend();
var query = new Noserv.Query(todo);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var EnterKey = 13;
var bRun = false;

$.fn.isBound = function(type, fn) {
    var data = this.data('events')[type];

    if (data === undefined || data.length === 0) {
        return false;
    }

    return (-1 !== $.inArray(fn, data));
};

$(document).ready(function() {
    runBind();


    // Todos_등록
    $todoList = $('#todo-list');
	$('#new-todo').keypress(function(e) {

        if (e.which === EnterKey) {

            if(!bRun) {

                bRun = true;
                var new_todo = $('#new-todo').val();

                todo.set('title', new_todo);
                todo.set('checked', '0');
                todo.set('objectId', '');
                

                todo.save(todo, {
                    success: function(data) {
                        //console.log(JSON.stringify(data)); // 응답 데이터 출력
                        console.log("Todo 저장 성공");
                        $('#new-todo').val('');
                        todos_list();
                        bRun = false;
                    },
                    error: function(data, error) {
                        //alert("Error: " + error);
                        console.log(error);
                        console.log("error - 요청데이터 : " + data); // 요청한 데이터 출력
                        bRun = false;
                    }
                });
            }
        }
    });

    // 로그인 엔터키
    $('#to_user_lg_pw').keypress(function(e) {
        if (e.which === EnterKey) todos_login();
    });

    // 회원가입 엔터키
    $('#to_user_sg_pw').keypress(function(e) {
        if (e.which === EnterKey) todos_signup();
    });

    // 세션
    if(sessionStorage.getItem('tutorial_todos_sessionToken') != null){
        sessionToken = sessionStorage.getItem('tutorial_todos_sessionToken');
        //console.error("sessionToken : " + sessionToken);

        todos_list();
    }
});

function runBind() {
    // Todos_삭제
    $('.destroy').on('click', function(e) {

        var obj_Id = $(this).attr('data');

        todo.set('objectId', obj_Id);

        todo.delete(todo, {
            success: function(data) {
                //console.log("Todo 삭제 성공!!!");

                /*var $currentListItem = $(this).closest('li');
                $currentListItem.remove();*/
            },
            error: function(data, error) {
                console.log(error);
                console.log("error - 요청데이터 : " + data.getJson()); // 요청한 데이터 출력
            }
        });

        var $currentListItem = $(this).closest('li');
        $currentListItem.remove();
    });

    // Todos_수정(체크박스)
    $('.toggle').on('click', function(e) {
        var $currentListItemLabel = $(this).closest('li').find('label');
        var $currentListItemChk = $(this).closest('li').find('input');

        var obj_Id = $(this).attr('data');

        todo.set('objectId', obj_Id);
        if($currentListItemChk.is(':checked')){
            todo.set('checked', '1');
        }else{
            todo.set('checked', '0');
        }

        todo.save(todo, {
            success: function(data) {
                //console.log(JSON.stringify(data)); // 응답 데이터 출력
                //console.log("Todo 수정 성공");

                todos_list();
            },
            error: function(data, error) {
                console.log(error);
                console.log("error - 요청데이터 : " + data); // 요청한 데이터 출력
            }
        });
    });
}

// 로그인
function todos_login(){
    var user_id = $("#to_user_lg_id").val();
    var user_pw = $("#to_user_lg_pw").val();

    if(user_id.length == 0){
        alert('아이디를 입력하세요.');
    }else if(user_pw.length == 0){
        alert('비밀번호를 입력하세요.');
    }else{
        // 로그인
        user.logIn(user_id, user_pw, {
            success: function(data) {
                //console.log(JSON.stringify(data)); // 응답 데이터 출력
                //console.log("로그인 성공!!!");

                user.set('objectId', data.objectId);
                user.set('_sessionToken', data.sessionToken);

                sessionStorage.setItem('tutorial_todos_sessionToken', data.sessionToken);


                /*location.href = 'http://noserv.com:7777/tutorial/todos/todoslist.html';*/
                location.href = './todoslist.html';
            },
            error: function(data, error) {
                console.log(error);
                console.log("error - 요청데이터 : " + data); // 요청한 데이터 출력

                dig_popup('Login', '아이디나 비밀번호가 틀립니다.', false);
            }
        });
    }
}

// 회원가입
function todos_signupchk(){
    var user_id = $("#to_user_sg_id").val();
    var user_pw = $("#to_user_sg_pw").val();

    if(user_id.length == 0){
        alert('아이디를 입력하세요.');
    }else if(user_pw.length == 0){
        alert('비밀번호를 입력하세요.');
    }else{
        user.set('username', user_id);
        user.set('password', user_pw);

        user.signUp(null, {
            success: function(data) {
                //console.log(JSON.stringify(data)); // 응답 데이터 출력
                //console.log("회원가입 성공!!!");

                dig_popup('Sign Up', 'Signup Completed\nWelcome to Noserv. To-Dos', true);
            },
            error: function(data, error) {
                console.log(error);
                console.log("error - 요청데이터 : " + data); // 요청한 데이터 출력
                dig_popup('Sign Up', '중복된 아이디가 있습니다. 다시 입력하세요.', false);
            }
        });
    }
}

// Todo_리스트 불러오기
function todos_list(){

    // 쿼리 불러오기
    query.find({
        success: function(data) {
            if(data.results){
                $('.destroy').off('click');
                $('.toggle').off('click');
                $todoList.empty();
                var todos = $todoList.html();
                for (var i = 0; i < data.results.length; i++) {
                    var obj = data.results[i];

                    todos += ""+
                        "<li>" +
                        "<div class='view'>";
                    if(obj.checked == "0"){
                        todos +="<input class='toggle' type='checkbox' data='" + obj.objectId + "'>" +
                            "<label data='' style='margin-left: 10px;'>" + " " + obj.title + "</label>" +
                            "<a class='destroy' data='" + obj.objectId + "'></a>";
                    }else{
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
            }else{
                console.log("데이터가 없습니다.")
            }
            //console.log(JSON.stringify(data)); // 응답 데이터 출력
            //console.log("쿼리 성공!!!");
        },
        error: function(data, error) {
            console.log(error);
            console.log("error - 요청데이터 :  " + data); // 요청한 데이터 출력
        }
    });
}

// 로그아웃
function todos_logout(){
    sessionStorage.removeItem('tutorial_todos_sessionToken');
    /*location.href = 'http://noserv.com:7777/tutorial/todos/todos.html';*/
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