function check(){
    var user = document.getElementById("user").value;
    var pw = document.getElementById("pw").value;
    if (user == "AT3K_CA" && pw =="123456"){
        window.location.replace("./login/success.html");
    }else {
        alert("账号或密码错误");
    }
}