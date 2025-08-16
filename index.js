//输入框显示处理
const inputSearchCity = document.querySelector('.search-city')
const CityBlock = document.querySelector('.search-city-block')

inputSearchCity.addEventListener('focus', () => {
    CityBlock.style.display = 'block';
})

inputSearchCity.addEventListener('blur', () => {
    CityBlock.style.display = 'none';
})

//小时天气翻页处理
const perBtnl = document.querySelector('.per-left-btn')
const perBtnr = document.querySelector('.per-right-btn')
const perMove = document.querySelector('.per-move')
perBtnr.addEventListener('click', () => {
    const position = window.getComputedStyle(perMove).left
    if (position === '0px') {
        perMove.style.left = '-1195px'
    }
    else if (position === '-1195px') {
        perMove.style.left = '-1395px'
    }
})
perBtnl.addEventListener('click', () => {
    const position = window.getComputedStyle(perMove).left
    if (position === '-200px') {
        perMove.style.left = '0px'
    }
    else if (position === '-1195px') {
        perMove.style.left = '0px'
    }
    else if (position === '-1395px') {
        perMove.style.left = '-200px'
    }

})


//生活信息翻页处理
const LivingBtnl = document.querySelector('.living-btnl')
const LivingBtnr = document.querySelector('.living-btnr')
const LivingContent = document.querySelector('.Living-content')

LivingBtnr.addEventListener('click', () => {
    const position = window.getComputedStyle(LivingContent).left
    console.log(position);
    if (position === '0px') {
        LivingContent.style.left = '-444px'
    }
})
LivingBtnl.addEventListener('click', () => {
    const position = window.getComputedStyle(LivingContent).left
    console.log(position);
    if (position === '-444px') {
        LivingContent.style.left = '0px'
    }
})


//添加城市关注


followbtn.addEventListener('click', () => {
    console.log(1);
    console.log(followingList);
    const city = document.querySelector('.city').innerText
    if (!cityList.includes(city)) {
        const newcity = {
            city,
            province: '',
            id: '',
            isDefault: false
        }
        followingList.push(newcity)
        localStorage.setItem('followingList', JSON.stringify(followingList))
        followbtn.innerHTML = '[已关注]'
    }
    else {
        console.log('已关注');

    }
})