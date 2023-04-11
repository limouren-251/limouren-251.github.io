// 聊天室的主要功能

//连接服务器
const socket = io('http://localhost:8080')
let username 
let avatar
//登录,
$('.nav .us_img img').on('click', function () {
    $(this).addClass('now').siblings().removeClass('now')
})

//点击提交 获取 数据
$('.sub').on('click', function () {
    //获取用户名
    let username = $('.user_name input').val().trim()
    if (!username) return alert('请填写用户名')
    // 获取选择的头像
    let avatar = $('.us_img img.now').attr('src')
    // console.log(avatar)

    //发送给服务器
    socket.emit('login', {
        username: username,
        avatar:avatar
    })
    
})



//提示错误
socket.on('loginError', data => {
     alert(data.msg)
})

//登录成功
socket.on('loginSuccess', data => {
    //替换数据
    $('.single img').attr('src', data.avatar)
    $('.single span').html(data.username)
    $('.nav').fadeOut()
    $('.connetion').fadeIn()
    //储存用户名和头像用来判断是否是本人
    username = data.username
    avatar = data.avatar
})

//发送用户进入系统消息
socket.on('addUser', data => {

    $('.infor').append(`
                        <div class="system">
                            <p>"${data.username}"进入了群聊</p>
                        </div>
                    `)
    
    scrollIntoView()
})
//监听用户离开
socket.on('delUser', data => {
    $('.infor').append(`
        <div class="system">
            <p>"${data.username}"离开了群聊</p>
        </div>
    `)
    scrollIntoView()
})

//监听用户列表事件
socket.on('userList', data => {
    console.log(data);
    $('.users').html('')
    //data 是一个数组对象
    data.forEach(item => {
        $('.users').append(`
            <li><img src="${item.avatar}" alt=""><span>${item.username}</span></li>
        `)
    });
    $('#userCount').text(data.length)
    

})


//点击发送按钮发送信息
$('.btn').on('click', function () {
    const send_infor = $('#text').val().trim()
    $('#text').val('')
    if (send_infor) {
        socket.emit('send', {
            msg: send_infor,
            username: username,
            avatar:avatar
        })

    }
    
})

//监听用户发送的信息
socket.on('reciveMessage', data => {
    // console.log(data);
    //把接收到的消息发送到页面上
    if (data.username === username) {
        //自己的消息
        $('.infor').append(`
            <div class="my_user">
                <img class="user_img" src="${data.avatar}" alt="">
                <p class="my_infor">${data.msg}</p>
            </div> 
        `)
    } else {
        //别人的消息
        $('.infor').append(`
            <div class="user">
                <img class="user_img" src="${data.avatar}" alt=""><span>${data.username}</span>
                <p class="user_infor">${data.msg}</p>
            </div>
            <div class="clear"></div>
        `)
    }
    scrollIntoView()
})


function scrollIntoView() {
    $('.infor').children(':last').get(0).scrollIntoView(false)

}

//发送图片

// $('#file').on('change', function () {

//     let file = this.files[0]
//     //H5 新增 fileReader
//     alert('11')
//     const fr = new FileReader()
//     console.log(fr.readAsDataURL(file));
//     fr.readAsDataURL(file)
//     fr.onload = function () {
//         socket.emit('sendImage', {
//             username: username,
//             avatar: avatar,
//             img:fr.result
//         })
//     }
// })

// //监听图片信息
// socket.on('sendImage', data => {
//     if (data.username === username) {
//         //自己的消息
//         $('.infor').append(`
//             <div class="my_user">
//                 <img class="user_img" src="${data.avatar}" alt="">
//                 <p class="my_infor"><img src="${data.img}"></p>
//             </div>
//         `)
//     } else {
//         //别人的消息
//         $('.infor').append(`
//             <div class="user">
//                 <img class="user_img" src="${data.avatar}" alt=""><span>${data.username}</span>
//                 <p class="user_infor"><img src="${data.img}"></p>
//             </div>
//             <div class="clear"></div>
//         `)
//     }
// })
// //等待图片加载完,再滚动到底部
// $('.infor img:last').on('load', function () {
//     scrollIntoView()
// })

//初始化 jquery-emoji 插件
// $('#text').emoji({
//     //设置出发的按钮
//     button: '.face',
//     showTab: false,
//     animation: 'slide',
//     position: 'topLeft',
//     icons: [{
//         name: "QQ表情",
//         path: "lib/img/qq/",
//         maxNum: 91,
//         excludeNums: [41, 45, 54],
//         file: ".gif",
//         placeholder: "#qq_{alias}#"
//     }]
// })

//注册键盘事件
$(window).on('keydown', function (e) {
    console.log(e.keyCode);
    if (e.keyCode === 13) {
        $('.btn').click()
    }
})