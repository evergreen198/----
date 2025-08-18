//输入框显示处理
const inputSearchCity = document.querySelector('.search-city')
const CityBlock = document.querySelector('.search-city-block')
const SearchBlock = document.querySelector('.search-city-block2')
const GetCityList = SearchBlock.querySelector('ul')

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
                newli.id=item.id
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

        GetCityList.addEventListener('click',e=>{
            document.querySelector('.city').innerHTML=e.innerText
            document.querySelector('.city').id=e.id
        })
    }).catch(error => {
        console.log('lose');
        console.log(error);
        document.querySelector('.not-found').style.display='block'
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

//删除关注城市
const delbtn=document.querySelectorAll('.delete')
delbtn.addEventListener('click',(e)=>{
    //删除该节点
})