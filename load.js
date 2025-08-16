window.addEventListener('DOMContentLoaded', () => {
    const attentionCity = localStorage.getItem('attentionCity')
    const searchHistory = localStorage.getItem('searchHistory')
    if (attentionCity) {
        //渲染
    }
    if (searchHistory) {
        //渲染
    }
})

//热门城市查询
axios({
    url: '/geo/v2/city/top',
    method: 'GET',
    params: {
        key,
        number: 20,
        range: 'cn',
        lang: 'zh'
    }
}).then(result => {
    console.log(result);
    const hotCityList = document.querySelector('.city-hot-list').querySelectorAll('li')
    hotCityList.forEach((item, index) => {
        item.innerHTML = `<span>${result.data.topCityList[index].name}</span>`
    })

}).catch(error => {
    console.log('1');
    console.log(error);
})

const followCity = JSON.parse(localStorage.getItem('followcity'))

axios({
    url: '/v7/weather/now',
    method: 'GET',
    params: {
        key,
        location: `${document.querySelector('.city').id}`,
        lang: 'zh',
        unit: 'm'
    }
}).then(result => {
    document.querySelector('.text-name').innerHTML = result.data.now.text

})