let username = document.querySelector('#username');
let url = decodeURI(location.search.substr(1));
let arr = url.split("=");
username.innerText = arr[1];

let problems = [];
let num;
let ans = []
const id = [0, 1, 2]

const check = document.querySelector('.present').querySelectorAll('input');
for (let i = 0; i < check.length; i++) {
    check[i].addEventListener('click', function (e) {
        check[i].parentElement.style.backgroundColor = "#b9c4d8";
        if (check[i].value == problems[id[0]].correct)
            ans[id[0]] = 1;
        else
            ans[id[0]] = 0;
        for (let j = 0; j < check.length; j++) {
            if (j !== i) {
                check[j].parentElement.style.backgroundColor = "#ecf0f3";
            }
        }
    })
}

// const list = ['question-box left block', 'question-box present block', 'question-box right block'];
const box = document.querySelector('.question').querySelectorAll('.question-box');

function before() {
    const box = document.querySelector('.question').querySelectorAll('.question-box');
    if (id[0] === 0)
        return
    for (let i = 0; i < id.length; i++) {
        id[i]--
    }
    for (let i = 0; i < box.length; i++) {
        box[i].className = 'none'
    }
    let id1 = id[0]
    let id2 = id[1]
    let id3 = id[2]
    if (id1 !== 0)
    {
        const temp1 = document.querySelector("[id=" + CSS.escape(id1) + "]")
        temp1.className = 'question-box left block'
    }
    const temp2 = document.querySelector("[id=" + CSS.escape(id2) + "]")
    temp2.className = 'question-box present block'
    const temp3 = document.querySelector("[id=" + CSS.escape(id3) + "]")
    temp3.className = 'question-box right block'

    const check = document.querySelector('.present').querySelectorAll('input');
    for (let i = 0; i < check.length; i++) {
        check[i].addEventListener('click', function (e) {
            check[i].parentElement.style.backgroundColor = "#b9c4d8";
            if (check[i].value == problems[id[0]].correct)
                ans[id[0]] = 1;
            else
                ans[id[0]] = 0;
            for (let j = 0; j < check.length; j++) {
                if (j !== i) {
                    check[j].parentElement.style.backgroundColor = "#ecf0f3";
                }
            }
        })
    }
}

function next() {
    const box = document.querySelector('.question').querySelectorAll('.question-box');
    if (id[2] === num + 1) {
        let score = 0
        for (let i = 0; i < ans.length; i++) {
            if (ans[i] === 1) {
                score += 1;
            }
        }
        score = score / num;
        window.location.href = encodeURI("../result/result.html?score="+score+"=name="+arr[1]);
    }
    for (let i = 0; i < id.length; i++) {
        id[i]++
    }
    for (let i = 0; i < box.length; i++) {
        box[i].className = 'none'
    }

    let id1 = id[0]
    let id2 = id[1]
    let id3 = id[2]
    const temp1 = document.querySelector("[id=" + CSS.escape(id1) + "]")
    temp1.className = 'question-box left block'
    const temp2 = document.querySelector("[id=" + CSS.escape(id2) + "]")
    temp2.className = 'question-box present block'
    if (id3 <= num) {
        const temp3 = document.querySelector("[id=" + CSS.escape(id3) + "]")
        temp3.className = 'question-box right block'
    }

    const check = document.querySelector('.present').querySelectorAll('input');
    for (let i = 0; i < check.length; i++) {
        check[i].addEventListener('click', function (e) {
            check[i].parentElement.style.backgroundColor = "#b9c4d8";
            if (check[i].value == problems[id[0]].correct)
                ans[id[0]] = 1;
            else
                ans[id[0]] = 0;
            for (let j = 0; j < check.length; j++) {
                if (j !== i) {
                    check[j].parentElement.style.backgroundColor = "#ecf0f3";
                }
            }
        })
    }
}

function get_problem(){
    const account = arr[1];
    const select = document.getElementById("education");
    const index = select.selectedIndex;
    const education = select.options[index].value;
    const problem_num = document.getElementById("problem_num").value;
    if (problem_num === '') {
        window.alert("????????????????????????")
        return
    }
    num = parseInt(problem_num);
    console.log(account);
    console.log(education);
    console.log(problem_num);
    if (num < 10 || num > 30) {
        window.alert("?????????????????????????????????")
        return
    }
    const form = new FormData();
    // form.append("name", account);
    form.append("education", education);
    form.append("num", problem_num);
    form.append("name", account);

    const FileController = "http://127.0.0.1:8080/generate_exercise"; // ?????????????????????????????????
    // XMLHttpRequest ??????
    const xhr = new XMLHttpRequest();
    xhr.open("post", FileController, true);
    xhr.send(form);
    window.alert("???????????????????????????......")
    xhr.onload = function () {
        const result = this.response;
        problems = JSON.parse(result);
        console.log(problems)

        // ?????? select
        const select_box = document.querySelector('.select')
        select_box.classList.add('none')
        // ??????button
        const before = document.querySelector('.before')
        before.className = 'before block'
        const next = document.querySelector('.next')
        next.className = 'next block'


        // ??????????????????????????? ??????
        const question = document.querySelector('.question')
        const node = document.querySelector('.right')
        for (let i = 0; i < num; i++) {
            let newNode = node.cloneNode(true)
            // newNode.className = 'question-box right none';
            // if (i === 0)
            //     newNode.className = 'question-box right block';
            newNode.id = i + 1
            question.appendChild(newNode)

            // ?????????????????????
            let id = i + 1
            // ??????
            const newNode_number = document.querySelector("[id=" + CSS.escape(id) + "]").querySelector('.number').querySelector('span')
            newNode_number.innerHTML = i + 1
            // ??????
            const newNode_question = document.querySelector("[id=" + CSS.escape(id) + "]").querySelector('.exercise').querySelector('span')
            newNode_question.innerHTML = problems[i].problem
            // ??????
            const newNode_options = document.querySelector("[id=" + CSS.escape(id) + "]").querySelector('.option').querySelectorAll('span')

            for (let j = 0; j < newNode_options.length; j++) {
                newNode_options[j].innerHTML = problems[i][j];
            }
        }

        // ????????????
        let id1 = id[0]
        let id2 = id[1]
        let id3 = id[2]
        if (id1 !== 0)
        {
            const temp1 = document.querySelector("[id=" + CSS.escape(id1) + "]")
            temp1.className = 'question-box left block'
        }
        const temp2 = document.querySelector("[id=" + CSS.escape(id2) + "]")
        temp2.className = 'question-box present block'
        const temp3 = document.querySelector("[id=" + CSS.escape(id3) + "]")
        temp3.className = 'question-box right block'
    }
}

pswReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/
function confirm() {
    // ??????????????????????????????????????????????????????
    const password = document.getElementById("password").value;
    const password1 = document.getElementById("password1").value;
    const password2 = document.getElementById("password2").value;
    if (password === "") {
        window.alert("??????????????????")
        return
    }
    if (password1 === "" || password2 === "") {
        window.alert("??????????????????")
        return
    }
    if (password1 !== password2) {
        window.alert("???????????????????????????")
        return
    }
    if (password1.length < 6 || password1.length > 10) {
        window.alert("?????????????????????????????????????????????")
        return
    }
    if (!pswReg.test(password1)) {
        window.alert("?????????????????????????????????????????????????????????")
        return
    }
    const name = arr[1]
    const form = new FormData();
    form.append("name", name);

    form.append("password", password);
    form.append("new_password", password1)

    const FileController = "http://127.0.0.1:8080/change_password"; // ?????????????????????????????????
    // XMLHttpRequest ??????
    const xhr = new XMLHttpRequest();
    xhr.open("post", FileController, true);
    xhr.send(form);

    xhr.onload = function () {
        const result = this.response;
        console.log(result);
        let Obj = JSON.parse(result);
        if (Obj.code === "504") {
            alert("???????????????????????????");
        }
        else {
            alert("??????????????????????????????")
            window.location.href = encodeURI("../login/login.html");
        }
    }
}

function cancel() {
    const change_password_box = document.querySelector('.change_password')
    change_password_box.className = 'change_password none'
}

function show_user() {
    const display = document.getElementById("show_user").style.display;
    if (display === "block") {
        document.getElementById("show_user").style.display = "none";
        document.getElementById('unfold_user').innerHTML = "???";
    }
    else {
        document.getElementById("show_user").style.display = "block";
        document.getElementById('unfold_user').innerHTML = "???";
    }
}

window.onload = function () {
    const change_password = document.querySelector('#change_password')
    // const change_name = document.querySelector('#change_name')
    const out = document.querySelector('#out')

    change_password.addEventListener('click', function () {
        // const select = document.querySelector('.select')
        // select.className = 'select none'
        const change_password_box = document.querySelector('.change_password')
        change_password_box.className = 'change_password block'
    })

    out.addEventListener('click', function () {
        window.location.href = encodeURI("../login/login.html");
    })
}