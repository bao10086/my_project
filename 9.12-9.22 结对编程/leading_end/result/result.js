const url = decodeURI(location.search);
const arr = url.split("=");

// 分数百分比
window.onload = function () {
    const score = (arr[1]*100).toPrecision(3)
    console.log(score)
    document.getElementById('correct_score_num').innerHTML = score
    if (score >= 0 && score <= 50) {
        const rotate = -135 + 18 / 5 * score
        let element = document.querySelector('.left_circle')
        element.style.transform = 'rotate(' + rotate + 'deg)'
        element = document.querySelector('.right_circle')
        element.style.transform = 'rotate(-135deg)'
    }
    else {
        const rotate = -135 + 18 / 5 * (score - 50)
        let element = document.querySelector(".left_circle")
        element.style.transform = 'rotate(45deg)'
        element = document.querySelector(".right_circle")
        element.style.transform = 'rotate(' + rotate + 'deg)'
    }
    if (score >= 90) {
        document.getElementById('flag').innerHTML = '真棒！！！'
    }
    else if (score >= 70) {
        document.getElementById('flag').innerHTML = '再加把劲！'
    }
    else {
        document.getElementById('flag').innerHTML = '继续加油哦~'
    }
}

function back() {
    window.location.href = encodeURI("../login/login.html");
}

function keep() {
    window.location.href = encodeURI("../main/main.html?name="+arr[3]);
}