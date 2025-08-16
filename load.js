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
    const hotCityList = document.querySelector('.city-hot-list').querySelectorAll('li')
    hotCityList.forEach((item, index) => {
        item.innerHTML = `<span>${result.data.topCityList[index].name}</span>`
    })

}).catch(error => {
    console.log('1');
    console.log(error);
})

const followCity = JSON.parse(localStorage.getItem('followcity'))

//城市经纬度获取
let latitude
let longitude
axios({
    url: '/geo/v2/city/lookup',
    method: 'GET',
    params: {
        key,
        location: document.querySelector('.city').innerText,
        adm: document.querySelector('.province').innerText,
        number: 1,
        lang: 'zh'
    }
}).then(result => {
    latitude = result.data.location[0].lat
    longitude = result.data.location[0].lon
    console.log(latitude);
    console.log(longitude);

    //空气质量加载
    axios({
        url: `/airquality/v1/current/${latitude}/${longitude}`,
        method: 'GET',
        params: {
            key,
            lang: 'zh'
        }
    }).then(result => {
        document.querySelector('.air-imfor').innerText = result.data.indexes[0].category
        const color = `rgb(${result.data.indexes[0].color.red}, ${result.data.indexes[0].color.green}, ${result.data.indexes[0].color.blue})`;
        document.querySelector('.quality-head').innerHTML = `空气质量指数&nbsp;${result.data.indexes[0].aqi}&nbsp;${result.data.indexes[0].category}`
        document.querySelector('.air-quality').style['background-color'] = color
        document.querySelector('.air-quality-block').style.setProperty('--border-bottom-color', `10px solid ${color}`)
        document.querySelector('.quality-head').style['background-color'] = color

        document.querySelector('.pm1').innerText = result.data.pollutants[0].concentration.value
        document.querySelector('.pm2').innerText = result.data.pollutants[1].concentration.value
        document.querySelector('.so2').innerText = result.data.pollutants[3].concentration.value
        document.querySelector('.no2').innerText = result.data.pollutants[4].concentration.value
        document.querySelector('.o3').innerText = result.data.pollutants[2].concentration.value
        document.querySelector('.co').innerText = result.data.pollutants[5].concentration.value


    }
    ).catch(error => {
        console.log(error);
        console.log(latitude);
        console.log(key);

    })
}).catch(error => {
    console.log('11')
    console.log(error)


})


//当地天气
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
    const subtitle = document.querySelector('.subtitle')
    subtitle.innerHTML = `中央气象台${result.data.now.obsTime.split('T')[1].split('+')[0]}发布`
    console.log(result.data.now.text);
    console.log(result.data.now.temp);

    document.querySelector('.text-tempreture').innerText = `${result.data.now.temp}°`
    document.querySelector('.now-weather-pic').src = `img/day/${result.data.now.text}.png`
    //天气细节
    const load = document.querySelector('.now-weather ul').querySelectorAll('li')
    if (result.data.now.WindSpeed) {
        load[0].innerHTML = `
                        <span>${result.data.now.windDir}&nbsp;${result.data.now.windScale}-${result.data.now.WindSpeed}级</span>`
    } else {
        load[0].innerHTML = `
                        <span>${result.data.now.windDir}&nbsp;${result.data.now.windScale}级</span>`
    }
    load[0].style.setProperty('--before-background', `url(img/wind/${result.data.now.windDir}.png)`)
    load[1].innerHTML = `湿度&nbsp;${result.data.now.humidity}%`
    load[2].innerHTML = `${result.data.now.pressure}hPa`

})


//生活指数
axios({
    url: '/v7/indices/1d',
    method: 'GET',
    params: {
        key,
        location: `${document.querySelector('.city').id}`,
        type: '3,12,9,2,1,16,4,6,15,10,8,14',
        lang: 'zh'
    }
}).then(result => {
    console.log(result);
    const LivingList = document.querySelectorAll('.Living-content li')

    LivingList[0].querySelector('.Living-infor-content').innerText = result.data.daily[2].category
    LivingList[0].querySelector('.Living-detail').innerText = result.data.daily[2].text

    LivingList[1].querySelector('.Living-infor-content').innerText = result.data.daily[8].category
    LivingList[1].querySelector('.Living-detail').innerText = result.data.daily[8].text

    LivingList[2].querySelector('.Living-infor-content').innerText = result.data.daily[6].category
    LivingList[2].querySelector('.Living-detail').innerText = result.data.daily[6].text

    LivingList[3].querySelector('.Living-infor-content').innerText = result.data.daily[1].category
    LivingList[3].querySelector('.Living-detail').innerText = result.data.daily[1].text

    LivingList[4].querySelector('.Living-infor-content').innerText = result.data.daily[0].category
    LivingList[4].querySelector('.Living-detail').innerText = result.data.daily[0].text

    LivingList[5].querySelector('.Living-infor-content').innerText = result.data.daily[11].category
    LivingList[5].querySelector('.Living-detail').innerText = result.data.daily[11].text

    LivingList[6].querySelector('.Living-infor-content').innerText = result.data.daily[3].category
    LivingList[6].querySelector('.Living-detail').innerText = result.data.daily[3].text

    LivingList[7].querySelector('.Living-infor-content').innerText = result.data.daily[4].category
    LivingList[7].querySelector('.Living-detail').innerText = result.data.daily[4].text

    LivingList[8].querySelector('.Living-infor-content').innerText = result.data.daily[10].category
    LivingList[8].querySelector('.Living-detail').innerText = result.data.daily[10].text

    LivingList[9].querySelector('.Living-infor-content').innerText = result.data.daily[7].category
    LivingList[9].querySelector('.Living-detail').innerText = result.data.daily[7].text

    LivingList[10].querySelector('.Living-infor-content').innerText = result.data.daily[5].category
    LivingList[10].querySelector('.Living-detail').innerText = result.data.daily[5].text

    LivingList[11].querySelector('.Living-infor-content').innerText = result.data.daily[9].category
    LivingList[11].querySelector('.Living-detail').innerText = result.data.daily[9].text


})

function getzero(str) {
    return str < 10 ? '0' + str : str
}

const newDate = new Date()
const date = `${newDate.getFullYear()}${getzero(newDate.getMonth() + 1)}${getzero(newDate.getDate() + 1)}`
let sun = new Array()
//日出日落时间
axios({
    url: '/v7/astronomy/sun',
    method: 'GET',
    params: {
        key,
        location: `${document.querySelector('.city').id}`,
        date
    }
}).then(result => {
    sun[0] = result.data.sunrise.split('T')[1].split('+')[0]
    sun[1] = result.data.sunset.split('T')[1].split('+')[0]
})



axios({
    url: '/v7/weather/24h',
    method: 'GET',
    params: {
        key,
        location: `${document.querySelector('.city').id}`,
        lang: 'zh',
        unit: 'm'
    }
}).then(result => {
    let flag = 'day'
    const perHourList = document.querySelector('.per-move').querySelectorAll('li')
    const perTime = result.data.hourly.forEach((item, index) => {
        const time = result.data.hourly[index].fxTime.split('T')[1].split('+')[0]
        const transtime = parseInt(time.split(':')[0]) * 24 + parseInt(time.split(':')[1])

        const nexttime = result.data.hourly[index + 1].fxTime.split('T')[1].split('+')[0]
        const transnexttime = parseInt(nexttime.split(':')[0]) * 24 + parseInt(nexttime.split(':')[1])

        const transSunrise = parseInt(sun[0].split(':')[0]) * 24 + parseInt(sun[0].split(':')[1])
        const transSunset = parseInt(sun[1].split(':')[0]) * 24 + parseInt(sun[1].split(':')[1])



        if (transSunrise > transtime && transSunrise < transnexttime) {
            const sunriseobj = new Object()
            sunriseobj.fxTime = `1T${sun[0]}+1`
            sunriseobj.temp = '日出'
            sunriseobj.text = '日出'
            result.data.hourly.splice(index + 1, 0, sunriseobj)
            flag = 'day'
        } else if (transSunset > transtime && transSunset < transnexttime) {
            const sunsetobj = new Object()
            sunsetobj.fxTime = `1T${sun[1]}+1`
            sunsetobj.temp = '日落'
            sunsetobj.text = '日落'
            result.data.hourly.splice(index + 1, 0, sunsetobj)
            flag = 'night'
        }
    })
    console.log(result.data.hourly);
    perHourList.forEach((item, index) => {

        const perTime = result.data.hourly[index].fxTime.split('T')[1].split('+')[0]
        const pertemp = result.data.hourly[index].temp
        const perwea = result.data.hourly[index].text
        if (perwea === '日出') {
            flag = 'day'
        } else if (perwea === '日落') {
            flag = 'night'
        }
        item.querySelector('.per-text').innerText = perTime
        item.querySelector('.per-tempreture').innerText = `${pertemp}°`
        item.querySelector('img').src = `img/weather/${flag}/${perwea}.png`

    })
})