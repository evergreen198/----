//输入框显示处理
const inputSearchCity = document.querySelector('.search-city')
const CityBlock = document.querySelector('.search-city-block')
const SearchBlock = document.querySelector('.search-city-block2')
const GetCityList = SearchBlock.querySelector('ul')
const HotCityList = document.querySelector('.city-hot-list')
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
    const province = document.querySelector('.province').innerText
    if (!cityList.includes(city)) {
        const newcity = {
            city,
            province,
            id: `${document.querySelector('.city').id}`,
            isDefault: false
        }
        followingList.push(newcity)
        localStorage.setItem('followingList', JSON.stringify(followingList))
        followbtn.innerHTML = '[已关注]'
        location.reload()
    }
    else {
        console.log('已关注');
    }

})
//渲染模糊搜索列表
// const SearchCity = document.querySelector('.search-city')
// SearchCity.addEventListener('input', () => {
//     axios({
//         url: '/geo/v2/city/lookup',
//         method: 'GET',
//         params: {
//             key,
//             location: `${SearchCity.value}`,
//             range: 'cn',
//             lang: 'zh'
//         }
//     }).then(result => {
//         const orinode = GetCityList.children[0]
//         while (GetCityList.firstChild) {
//             GetCityList.removeChild(GetCityList.firstChild);
//         }
//         GetCityList.appendChild(orinode)
//         console.log(GetCityList);


//         document.querySelector('.not-found').style.display = 'none'
//         CityBlock.style.display = 'none'
//         SearchBlock.style.display = 'block'

//         result.data.location.forEach((item) => {
//             //最小单位包括搜索的关键字
//             //注入id
//             if (item.name.includes(SearchCity.value)) {
//                 const newli = GetCityList.children[0].cloneNode(true)
//                 newli.style.display = 'block'
//                 newli.id = item.id
//                 if (item.name === item.adm2) {
//                     newli.innerText = `${item.adm1}，${item.adm2}`

//                 }
//                 else {
//                     newli.innerText = `${item.adm1}，${item.adm2}，${item.name}`

//                 }
//                 GetCityList.appendChild(newli)
//             }
//         })
//         GetCityList.children[0].style.display = 'none'

//         GetCityList.addEventListener('click', e => {
//             document.querySelector('.city').innerHTML = e.innerText
//             document.querySelector('.city').id = e.id
//         })
//     }).catch(error => {
//         console.log('lose');
//         console.log(error);
//         document.querySelector('.not-found').style.display = 'block'
//         CityBlock.style.display = 'none'
//         SearchBlock.style.display = 'block'
//     })
// })

// 防抖函数
function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// 获取 DOM 元素
const SearchCity = document.querySelector('.search-city');
const NotFound = document.querySelector('.not-found');
const CityDisplay = document.querySelector('.city');


GetCityList.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (li && GetCityList.contains(li)) {
        CityDisplay.innerHTML = li.innerText;
        CityDisplay.id = li.id;
    }
});


// 模糊搜索（带防抖）
SearchCity.addEventListener('input', debounce(() => {
    axios({
        url: '/geo/v2/city/lookup',
        method: 'GET',
        params: {
            key,
            location: SearchCity.value.trim(),
            range: 'cn',
            lang: 'zh'
        }
    }).then(result => {
        // 清空列表并保留模板
        GetCityList.innerHTML = '';
        const orinode = document.createElement('li')
        orinode.className = 'sample'
        orinode.innerHTML = `   <span class="found-province" style="display: none;"></span>
                                <span class="found-city">北京</span>`
        GetCityList.appendChild(orinode);

        NotFound.style.display = 'none';
        CityBlock.style.display = 'none';
        SearchBlock.style.display = 'block';

        const fragment = document.createDocumentFragment();
        const keyword = SearchCity.value.trim();

        result.data.location.forEach(item => {
            if (item.name.includes(keyword)) {
                const newli = orinode.cloneNode(true);
                newli.style.display = 'block';
                newli.id = item.id;
                newli.innerText = item.name === item.adm2
                    ? `${item.adm1}，${item.adm2}`
                    : `${item.adm1}，${item.adm2}，${item.name}`;
                fragment.appendChild(newli);
            }
        });

        GetCityList.appendChild(fragment);

    }).catch(error => {
        console.error('搜索失败：', error);
        NotFound.style.display = 'block';
        CityBlock.style.display = 'none';
        SearchBlock.style.display = 'block';
    });
}, 300)); // 防抖延迟时间：300ms


SearchCity.addEventListener('blur', () => {
    SearchCity.value = ''
    while (GetCityList.firstChild) {
        GetCityList.removeChild(GetCityList.firstChild);
    }
})

//删除关注城市、设为默认
showFollowList.addEventListener('click', (e) => {
    const targetli = e.target.parentNode

    const getFollowCityList = document.querySelector('.follow-list').querySelectorAll('li')
    //删除
    if (e.target.className === 'delete') {
        const getid = targetli.querySelector('.following-city').id
        followingList.forEach((item, index) => {
            if (item.id === getid) {
                followingList.splice(index, 1)
                //待完成：回显
                location.reload()
            }
        })
    }
    else if (e.target.className === 'btn-set') {//设为默认
        const getid = targetli.id
        followingList.forEach(item => {
            if (item.id === getid) {
                item.isDefault = true
            } else {
                item.isDefault = false
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
    }
    //取消默认
    else if (e.target.className === 'btn-set1') {
        const getid = targetli.id
        followingList.forEach((item, inedx) => {
            if (item.id === getid) {
                item.isDefault = false
            }
        })
        console.log(getFollowCityList);
        getFollowCityList.forEach(item => {
            console.log(item);
            if (item.querySelector('.following-city').id === getid) {
                item.querySelector('.btn-set').style.display = 'none'
                item.querySelector('.btn-set1').style.display = 'none'
                item.querySelector('.btn-set2').style.display = 'none'
            }
        })
    }
    localStorage.setItem('followingList', JSON.stringify(followingList))
    isDefaultUpload()
})

//默认城市显示
showFollowList.addEventListener('mouseover', e => {
    if (e.target.parentNode.querySelector('.btn-set2').style.display === 'inline-block') {
        e.target.parentNode.querySelector('.btn-set2').style.display = 'none'
        e.target.parentNode.querySelector('.btn-set1').style.display = 'inline-block'
    }
    else {
        e.target.parentNode.querySelector('.btn-set').style.display = 'inline-block'
    }
})
showFollowList.addEventListener('mouseout', e => {
    if (e.target.parentNode.querySelector('.btn-set1').style.display === 'inline-block') {
        e.target.parentNode.querySelector('.btn-set1').style.display = 'none'
        e.target.parentNode.querySelector('.btn-set2').style.display = 'inline-block'
    }
    else {
        e.target.parentNode.querySelector('.btn-set').style.display = 'none'
    }
})

//添加历史记录
//关注城市的点击，定位点击，历史记录点击，热门城市点击
//关注列表：
//定位：
//历史记录：
//热门城市
foundList.addEventListener('mousedown', e => {
    console.log('fuck');
    console.log(e);
    console.log(e.target);
    console.log(e.target.parentNode);
    document.querySelector('.city').innerText = e.target.innerText.split('，')[e.target.innerText.split('，').length - 1]
    document.querySelector('.city').id = e.target.id
    document.querySelector('.province').innerText=e.target.innerText.split('，')[0]
})

HotCityList.addEventListener('mousedown', e => {
    console.log('fuck');
    console.log(e);
    console.log(e.target);
    console.log(e.target.parentNode);
    if (e.target.id) {
        document.querySelector('.city').innerText = e.target.innerText
        document.querySelector('.city').id = e.target.id
        document.querySelector('.province').innerText = e.target.parentNode.querySelector('.hot-city-province').innerText
    }
    else {

        document.querySelector('.province').innerText = e.target.querySelector('.hot-city-province').innerText
        document.querySelector('.city').innerText = e.target.querySelector('.hot-city-name').innerText
        document.querySelector('.city').id = e.target.querySelector('hot-city-name').id
    }

})

showFollowList.addEventListener('mousedown', e => {
    console.log('fuc1k');
    console.log(e);
    console.log(e.target);
    console.log(e.target.parentNode);
    if (e.target.className === 'btn-set' || e.target.className === 'btn-set1' || e.target.className === 'btn-set2' || e.target.className === 'delete') {
        console.log('nothing');
        
    }
    else {
        console.log('something');
        
        const tempnode=e.target.parentNode
        document.querySelector('.city').innerText = tempnode.querySelector('.following-city .follow-city-name').innerText
        document.querySelector('.province').innerText = tempnode.querySelector('.following-city .follow-city-province').innerText
        document.querySelector('.city').id = tempnode.id
    }
})

const getHistoryList = document.querySelector('.city-record-list')
getHistoryList.addEventListener('mousedown', e => {
    console.log('fuck');
    console.log(e);
    console.log(e.target);
    console.log(e.target.parentNode);
    if (e.target.id) {
        document.querySelector('.city').innerText = e.target.innerText
        document.querySelector('.city').id = e.target.id
        document.querySelector('.province').innerText=e.target.parentNode.querySelector('.history-province').innerText
    }
    else {
        document.querySelector('.province').innerText=e.target.querySelector('.history-province').innerText
        document.querySelector('.city').innerText = e.target.querySelector('.history-city-name').innerText
        document.querySelector('.city').id = e.target.querySelector('.history-city-name').id
    }
})

const delHistoryBtn = document.querySelector('.delete-history')
delHistoryBtn.addEventListener('mousedown', () => {
    searchHistory = []
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
    document.querySelector('.city-record-list').innerHTML = ''
    document.querySelector('.city-record-block').style.display = 'none'
}
)