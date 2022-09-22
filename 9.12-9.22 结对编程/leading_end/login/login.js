function sign_in() {
    // 获取输入的用户名，密码发送到后端
    let account = document.getElementById("account").value;
    const password = document.getElementById("password").value;
    if (account === "") {
        window.alert("请输入账号")
        return
    }
    if (password === "") {
        window.alert("请输入密码")
        return
    }

    const form = new FormData();
    form.append("account", account);
    form.append("password", password);

    const FileController = "http://127.0.0.1:8080/sign_in"; // 接收上传文件的后台地址
    // XMLHttpRequest 对象
    const xhr = new XMLHttpRequest();
    xhr.open("post", FileController, true);
    xhr.send(form);

    xhr.onload = function () {
        const result = this.response;
        console.log(result);
        let Obj = JSON.parse(result);
        if (Obj.code === "404") {
            alert("用户不存在，请检查账号信息或注册账号");
        }
        else if (Obj.code === "504") {
            alert("密码错误，请重新输入");
        }
        else if (Obj.code === "202"){
            // 跳转到主界面
            // alert("登录成功")
            window.location.href = encodeURI("../main/main.html?account="+Obj.account);
        }
    }
}

function sign_up() {
    // 获取输入的邮箱号，验证码发送到后端
    const email = document.getElementById("email_for_design").value;
    const designer_code = document.getElementById("designer_code").value;
    if (email === "") {
        window.alert("邮箱号为空，请输入邮箱号")
        return
    }
    if (designer_code === "") {
        window.alert("验证码为空，请输入验证码")
        return
    }
    const form = new FormData();
    form.append("email", email);
    form.append("designer_code", designer_code);

    const FileController = "http://127.0.0.1:8080/sign_up"; // 接收上传文件的后台地址
    // XMLHttpRequest 对象
    const xhr = new XMLHttpRequest();
    xhr.open("post", FileController, true);
    xhr.send(form);

    // 获取后端返回信息
    xhr.onload = function () {
        const result = this.response;
        console.log(result);
        let Obj = JSON.parse(result);
        if (Obj.code === '404') {
            alert("验证码错误，请检查验证码或重新发送")
        }
        else if (Obj.code === '504') {
            alert("该邮箱已注册过账户，请检查")
        }
        else {
            alert("开始设置信息")
            // 切换显示表单
            // 获取元素
            const sign_up_box = document.querySelector('#sign_up_box')
            const set_userinfo_box = document.querySelector('#set_userinfo_box')
            // 移除类
            sign_up_box.classList.remove('block')
            set_userinfo_box.classList.remove('none')
            // 添加类
            sign_up_box.classList.add('none')
            set_userinfo_box.classList.add('block')
        }
    }
}

function forget_password_sign_in() {
    // 获取输入的邮箱号，验证码发送到后端
    const email = document.getElementById("email").value;
    const verification_code = document.getElementById("verification_code").value;

    if (email === "") {
        window.alert("请输入邮箱号")
        return
    }
    if (verification_code === "") {
        window.alert("请输入验证码")
        return
    }

    const form = new FormData();
    form.append("email", email);
    form.append("verification_code", verification_code);

    const FileController = "http://127.0.0.1:8080/forget_password_sign_in"; // 接收上传文件的后台地址
    // XMLHttpRequest 对象
    const xhr = new XMLHttpRequest();
    xhr.open("post", FileController, true);
    xhr.send(form);

    xhr.onload = function () {
        const result = this.response;
        console.log(result);
        let Obj = JSON.parse(result);
        if (Obj.code === "504") {
            alert("该邮箱未注册,请检查邮箱号或注册");
        }
        else if (Obj.code === "404") {
            alert("验证码错误，请检查验证码或重新发送");
        }
        else {
            // 跳转到主界面
            // alert("登录成功")
            let account = Obj.account;
            window.location.href = encodeURI("../main/main.html?account="+account);
        }
    }
}

// 6-10位，必须含大小写字母和数字
pswReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/
function confirm() {
    // 获取输入的用户名，两次密码发送到后端
    const name = document.getElementById("name").value;
    const password1 = document.getElementById("password1").value;
    const password2 = document.getElementById("password2").value;

    if (name === "") {
        window.alert("请输入用户名")
        return
    }
    if (password1 === "" || password2 === "") {
        window.alert("请输入密码")
        return
    }
    if (password1 !== password2) {
        window.alert("两次密码输入不一致")
        return
    }
    if (password1.length < 6 || password1.length > 10) {
        window.alert("密码长度不符合要求，请重新设置")
        return
    }
    if (!pswReg.test(password1)) {
        window.alert("密码必须含大小写字母和数字，请重新设置")
        return
    }

    const form = new FormData();
    form.append("name", name);
    form.append("password", password1);

    const FileController = "http://127.0.0.1:8080/confirm"; // 接收上传文件的后台地址
    // XMLHttpRequest 对象
    const xhr = new XMLHttpRequest();
    xhr.open("post", FileController, true);
    xhr.send(form);

    xhr.onload = function () {
        const result = this.response;
        console.log(result);
        let Obj = JSON.parse(result);
        if (Obj.code === "404") {
            alert("用户名已存在，请重新设置");
        }
        else {
            // 跳转到主界面
            // alert("登录成功")
            window.location.href = encodeURI("../main/main.html?account="+name);
        }
    }
}

const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;  //邮箱

window.onload = function () {
    // 获取元素
    const to_sign_in = document.querySelector('#to_sign_in')
    const to_sign_up = document.querySelector('#to_sign_up')
    const to_forget_password = document.querySelector('#to_forget_password')
    const go_back = document.querySelector('#go_back')

    const sign_in_box = document.querySelector('#sign_in_box')
    const sign_up_box = document.querySelector('#sign_up_box')
    const forget_password_box = document.querySelector('#forget_password_box')

    to_sign_in.addEventListener('click', function () {
        // 移除相应类 
        sign_in_box.classList.remove('none')
        sign_up_box.classList.remove('block')
        // 添加相应类
        sign_in_box.classList.add('block')
        sign_up_box.classList.add('none')

    })

    to_sign_up.addEventListener('click', function () {
        // 移除相应类
        sign_in_box.classList.remove('block')
        sign_up_box.classList.remove('none')
        // 添加相应类
        sign_in_box.classList.add('none')
        sign_up_box.classList.add('block')

    })

    to_forget_password.addEventListener('click', function () {
        // 移除相应类
        sign_in_box.classList.remove('block')
        forget_password_box.classList.remove('none')
        // 添加相应类
        sign_in_box.classList.add('none')
        forget_password_box.classList.add('block')

    })

    go_back.addEventListener('click', function () {
        // 移除相应类
        forget_password_box.classList.remove('block')
        sign_in_box.classList.remove('none')
        // 添加相应类
        forget_password_box.classList.add('none')
        sign_in_box.classList.add('block')
    })

    const get_verification_code = document.querySelector('#get_verification_code')
    const get_designer_code = document.querySelector('#get_designer_code')

    get_designer_code.addEventListener('click', function () {
        // 获取输入的邮箱号，验证码发送到后端
        // 正则测试邮箱号
        const email = document.getElementById("email_for_design").value;
        if (!emailReg.test(email)) {
            alert(" 请输入有效的邮箱号");
            return false;
        }

        // 60s
        if (document.getElementById('get_designer_code').innerHTML !== '获取验证码')
            return
        let time = 10;
        const timer = setInterval(function () {
            if (time === 0) {
                clearInterval(timer)
                document.getElementById('get_designer_code').innerHTML = "获取验证码";
            } else {
                document.getElementById('get_designer_code').innerHTML = time + '秒后重新获取';
                time--;
            }
        }, 1000);

        // 发送至后端，获取验证码
        const form = new FormData();
        form.append("email", email);

        const FileController = "http://127.0.0.1:8080/get_code"; // 接收上传文件的后台地址
        // XMLHttpRequest 对象
        const xhr = new XMLHttpRequest();
        xhr.open("post", FileController, true);
        xhr.send(form);
        window.alert("验证码发送成功")
    })

    get_verification_code.addEventListener('click', function () {
        // 获取输入的邮箱号，验证码发送到后端
        // 正则测试邮箱号
        const email = document.getElementById("email").value;
        if (!emailReg.test(email)) {
            alert(" 请输入有效的邮箱号");
            return false;
        }

        // 60s
        if (document.getElementById('get_verification_code').innerHTML !== '获取验证码')
            return
        let time = 60;
        const timer = setInterval(function () {
            if (time === 0) {
                clearInterval(timer)
                document.getElementById('get_verification_code').innerHTML = "获取验证码";
            } else {
                document.getElementById('get_verification_code').innerHTML = time + '秒后重新获取';
                time--;
            }
        }, 1000);

        // 发送至后端，获取验证码
        const form = new FormData();
        form.append("email", email);

        const FileController = "http://127.0.0.1:8080/get_code"; // 接收上传文件的后台地址
        // XMLHttpRequest 对象
        const xhr = new XMLHttpRequest();
        xhr.open("post", FileController, true);
        xhr.send(form);
        window.alert("验证码发送成功");
    })

}

