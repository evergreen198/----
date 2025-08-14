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
        number: 20,
        range: 'cn',
        lang: 'zh'
    }
}).then(result => {
    console.log(result);

    const hotCityList = document.querySelector('.city-hot-list').querySelectorAll('li')
    hotCityList.forEach((item, index) => {
        item.innerHTML = `<span>${result.topCityList[index].name}</span>`
    })

}).catch(error => {
    console.log('1');

    console.error(error);
})