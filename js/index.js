//输入框显示处理
const inputSearchCity = document.querySelector('.search-city')
const CityBlock = document.querySelector('.search-city-block')
const SearchBlock = document.querySelector('.search-city-block2')
const GetCityList = SearchBlock.querySelector('ul')
const foundList=document.querySelector('.found-list')

inputSearchCity.addEventListener('focus', () => {
    CityBlock.style.display = 'block';
})

inputSearchCity.addEventListener('blur', () => {
    CityBlock.style.display = 'none';
    SearchBlock.style.display = 'none';
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
            id: `${document.querySelector('.city').id}`,
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
//渲染模糊搜索列表
const SearchCity = document.querySelector('.search-city')
SearchCity.addEventListener('input', () => {
    axios({
        url: '/geo/v2/city/lookup',
        method: 'GET',
        params: {
            key,
            location: `${SearchCity.value}`,
            range: 'cn',
            lang: 'zh'
        }
    }).then(result => {
        console.log('win');
        const orinode = GetCityList.children[0]
        while (GetCityList.firstChild) {
            GetCityList.removeChild(GetCityList.firstChild);
        }
        GetCityList.appendChild(orinode)
        console.log(GetCityList);


        document.querySelector('.not-found').style.display = 'none'
        CityBlock.style.display = 'none'
        SearchBlock.style.display = 'block'

        result.data.location.forEach((item) => {
            //最小单位包括搜索的关键字
            //注入id
            if (item.name.includes(SearchCity.value)) {
                const newli = GetCityList.children[0].cloneNode(true)
                newli.style.display = 'block'
                newli.id = item.id
                if (item.name === item.adm2) {
                    newli.innerText = `${item.adm1}，${item.adm2}`

                }
                else {
                    newli.innerText = `${item.adm1}，${item.adm2}，${item.name}`

                }
                GetCityList.appendChild(newli)
            }
        })
        GetCityList.children[0].style.display = 'none'

        GetCityList.addEventListener('click', e => {
            document.querySelector('.city').innerHTML = e.innerText
            document.querySelector('.city').id = e.id
        })
    }).catch(error => {
        console.log('lose');
        console.log(error);
        document.querySelector('.not-found').style.display = 'block'
        CityBlock.style.display = 'none'
        SearchBlock.style.display = 'block'
    })
})

SearchCity.addEventListener('blur', () => {
    SearchCity.value = ''
    const orinode = GetCityList.children[0]
    while (GetCityList.firstChild) {
        GetCityList.removeChild(GetCityList.firstChild);
    }
    GetCityList.appendChild(orinode)
})

//删除关注城市、设为默认
showFollowList.addEventListener('click', (e) => {
    console.log(e);
    console.log(e.target);
    console.log(e.target.className);
    console.log(e.target.parentNode)
    const targetli = e.target.parentNode

    const getFollowCityList = document.querySelector('.follow-list').querySelectorAll('li')
    //删除
    if (e.target.className === 'delete') {
        const getid = targetli.querySelector('.following-city').id
        followingList.forEach((item, index) => {
            if (item.id === getid) {
                followingList.splice(index, 1)
                //待完成：回显
            }
        })
    } else if (e.target.className === 'btn-set') {//设为默认
        const getid = targetli.id
        followingList.forEach((item, inedx) => {
            if (item.id === getid) {
                item.isDefault = true
            }
        })
        getFollowCityList.forEach(item => {
            console.log(item.querySelector('.btn-set1'));
            console.log('?');
            console.log(item);
            
            if (item.querySelector('.following-city').id === getid) {
                item.querySelector('.btn-set2').style.display = 'inline-block'
                item.querySelector('.btn-set1').style.display = 'none'
                item.querySelector('.btn-set').style.display = 'none'
            }
        })
    } else if (e.target.className === 'btn-set1') {
        const getid = targetli.id

        followingList.forEach((item, inedx) => {
            if (item.id === getid) {
                item.isDefault = false
            }
        })
        getFollowCityList.forEach(item => {
            if (item.querySelector('.following-city').id === getid) {
                item.querySelector('.btn-set1').style.display = 'inline-block'
                item.querySelector('.btn-set2').style.display = 'none'
            }
        })
    }
    localStorage.setItem('followingList', JSON.stringify(followingList))

})

//默认城市显示
showFollowList.addEventListener('mouseover',e=>{
    console.log(e.target);
    console.log(e.target.parentNode);
    if(e.target.parentNode.querySelector('.btn-set2').style.display==='inline-block'){
        e.target.parentNode.querySelector('.btn-set2').style.display='none'
        e.target.parentNode.querySelector('.btn-set1').style.display='inline-block'
    }
    else{
        e.target.parentNode.querySelector('.btn-set').style.display='inline-block'
        console.log( e.target.parentNode.querySelector('.btn-set'));
        
        console.log('??');
        
    }
})
showFollowList.addEventListener('mouseout',e=>{
    console.log(e.target);
    console.log(e.target.parentNode);
    if(e.target.parentNode.querySelector('.btn-set1').style.display==='inline-block'){
        e.target.parentNode.querySelector('.btn-set1').style.display='none'
        e.target.parentNode.querySelector('.btn-set2').style.display='inline-block'
    }
    else{
        e.target.parentNode.querySelector('.btn-set').style.display='none'

    }
})

//添加历史记录
foundList.addEventListener('click',e=>{

})
