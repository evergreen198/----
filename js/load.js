window.addEventListener('DOMContentLoaded', isDefaultUpload())
function isDefaultUpload(){
    if (followingList.length > 1) {
        //渲染
        document.querySelector('#follow-attention').style.display = 'none'
        const orili = showFollowList.children[0].cloneNode(true)

        //遍历关注城市的列表
        followingList.forEach((item) => {
            const newli = orili.cloneNode(true);
            newli.querySelector('.following-city').innerHTML = `<span>${item.city}</span><a href="javascript:" class="btn-set">设为默认</a>
                                    <a href="javascript:" class="btn-set1">取消默认</a>
                                    <a href="javascript:" class="btn-set2">默认</a>`
            newli.querySelector('.following-city').id = item.id

            if (item.isDefault === false) {
                newli.querySelector('.btn-set1').style.display = 'none'
                newli.querySelector('.btn-set2').style.display = 'none'
            }
            else if (item.isDefault === true) {
                newli.querySelector('.btn-set').style.display = 'none'
                newli.querySelector('.btn-set1').style.display = 'none'
                newli.querySelector('.btn-set2').style.display = 'inline-block'
                document.querySelector('.city').innerText=item.city
                document.querySelector('.city').id=item.id
            }

            axios({
                url: '/v7/weather/3d',
                method: 'GET',
                params: {
                    key,
                    location: `${item.id}`,
                    lang: 'zh',
                    unit: 'm'
                }
            }).then(result => {
                const newinfor = result.data.daily[0]
                newli.querySelector('img').src = `img/timid/${newinfor.textDay}.png`
                newli.querySelector('.following-city-weather').innerText = newinfor.textDay
                newli.querySelector('.following-city-temp').innerText = `${newinfor.tempMax}°/${newinfor.tempMin}°`
                newli.style.display = 'block'
                showFollowList.append(newli)
            })
        })
    }
    refreashHistoryAllow=1
}

//加载历史记录
function LoadHistory(){
    const cityRecordList = document.querySelector('.city-record-list')
    //如果不是空列表
    console.log(searchHistory.length);

    if (searchHistory.length) {
        document.querySelector('.city-record-block').style.display = 'block'
        document.querySelector('.city-record-list').style.display = 'block'
        if (searchHistory.length > 4) {
            searchHistory.splice(4, searchHistory.length - 4)
        }
        searchHistory.forEach(item => {
            console.log('wwwwwhy');
            
            const newli = document.createElement('li')
            newli.style.display='inline-block'
            newli.innerHTML = `<span>${item.city}</span>`
            newli.querySelector('span').id=item.id
            cityRecordList.append(newli)
        })
    }
    //如果是空
    else {
        document.querySelector('.city-record-block').style.display = 'none'
        document.querySelector('.city-record-list').style.display = 'none'
    }
    while(cityRecordList.children.length>4){
        cityRecordList.removeChild(cityRecordList.firstChild)
    }
}
window.addEventListener('DOMContentLoaded', LoadHistory())



function ToSplit1(str) {
    return str.split("T")[1].split("+")[0]
}

function ToSplit2(str) {
    return parseInt(str.split(":")[0]) * 24 + parseInt(str.split(":")[1])
}




//热门城市查询
window.addEventListener('DOMContentLoaded', () => {
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
            item.querySelector('span').id = result.data.topCityList[index].id
        })

    }).catch(error => {
        console.log('1');
        console.log(error);
    })
})


const followCity = JSON.parse(localStorage.getItem('followcity'))

//城市经纬度获取
let latitude
let longitude
window.addEventListener('DOMContentLoaded', () => {
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
            let color
            if (result.data.indexes[0].category === '良') {
                color = '#f0cc35'
                document.querySelector('.air-spot').src = 'img/quality2.png'
            }
            else if (result.data.indexes[0].category === '优') {
                color = '#a3d765'
                document.querySelector('.air-spot').src = 'img/quality1.png'

            }
            else {
                color = '#f1ab62'
                document.querySelector('.air-spot').src = 'img/quality3.png'

            }
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
})


//当地天气
window.addEventListener('DOMContentLoaded', () => {
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
        const load = document.querySelector('.now-weather .weather-detail').querySelectorAll('li')
        if (result.data.now.WindSpeed) {
            load[0].innerHTML = `
                        <span>${result.data.now.windDir}&nbsp;${result.data.now.windScale}-${result.data.now.WindSpeed}级</span>`
        } else {
            load[0].innerHTML = `
                        <span>${result.data.now.windDir}&nbsp;${result.data.now.windScale}级</span>`
        }
        load[0].style.setProperty('--before-background', `url(cssimg/wind/${result.data.now.windDir}.png)`)
        load[1].innerHTML = `湿度&nbsp;${result.data.now.humidity}%`
        load[2].innerHTML = `${result.data.now.pressure}hPa`

    })
})


//生活指数
window.addEventListener('DOMContentLoaded', () => {
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
})

function getzero(str) {
    return str < 10 ? '0' + str : str
}

const newDate = new Date()
const date = `${newDate.getFullYear()}${getzero(newDate.getMonth() + 1)}${getzero(newDate.getDate() + 1)}`
let sun = new Array()
//日出日落时间
window.addEventListener('DOMContentLoaded', () => {
    axios({
        url: '/v7/astronomy/sun',
        method: 'GET',
        params: {
            key,
            location: `${document.querySelector('.city').id}`,
            date
        }
    }).then(result => {
        sun[0] = ToSplit1(result.data.sunrise)
        sun[1] = ToSplit1(result.data.sunset)
        

        //每小时+日出日落天气渲染
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
            //判断晴晚
            let flag = 'day'
            const perHourList = document.querySelector('.per-move').querySelectorAll('li')
            const perTime = result.data.hourly.forEach((item, index) => {
                const time = ToSplit1(result.data.hourly[index].fxTime)
                const transtime = ToSplit2(time)

                const nexttime = ToSplit1(result.data.hourly[index + 1].fxTime)
                const transnexttime = ToSplit2(nexttime)

                const transSunrise = ToSplit2(sun[0])
                const transSunset = ToSplit2(sun[1])



                if (transSunrise >= transtime && transSunrise < transnexttime&&result.data.hourly[index].temp!='日出'&&result.data.hourly[index].temp!='日落') {
                    const sunriseobj = new Object()
                    sunriseobj.fxTime = `1T${sun[0]}+1`
                    sunriseobj.temp = '日出'
                    sunriseobj.text = '日出'
                    result.data.hourly.splice(index + 1, 0, sunriseobj)
                    flag = 'day'
                } else if (transSunset >= transtime && transSunset < transnexttime&&result.data.hourly[index].temp!='日出'&&result.data.hourly[index].temp!='日落') {
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

                const perTime = ToSplit1(result.data.hourly[index].fxTime)
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

    })
})

//天气预警
window.addEventListener('DOMContentLoaded', () => {
    axios({
        url: '/v7/warning/now',
        method: 'GET',
        params: {
            key,
            location: `${document.querySelector('.city').id}`,
            lang: 'zh'
        }
    }).then(result => {
        const warnList = document.querySelector('.warning')

        result.data.warning.forEach(item => {
            const newli = warnList.children[0].cloneNode(true)
            newli.style.display = 'inline-block'
            newli.querySelector('.warning-content').style.display = 'block'
            console.log(item.severityColor);

            if (item.severityColor === 'Blue') {
                newli.querySelector('.warning-content').style[`background-color`] = '#86c5f7'
                newli.querySelector('.warning-head').style[`background-color`] = '#86c5f7'
                newli.querySelector('.warning-block').style.setProperty('--border-bottom-color', '10px solid #86c5f7')

            }
            else if (item.severityColor === 'Yellow') {
                console.log('1');

                newli.querySelector('.warning-block').style.setProperty('--border-bottom-color', '10px solid  #f5d271')
                newli.querySelector('.warning-content').style[`background-color`] = '#f5d271'
                newli.querySelector('.warning-head').style[`background-color`] = '#f5d271'

            }
            else if (item.severityColor === 'Orange') {
                newli.querySelector('.warning-content').style[`background-color`] = '#ef8c6b'
                newli.querySelector('.warning-head').style[`background-color`] = '#ef8c6b'
                newli.querySelector('.warning-block').style.setProperty('--border-bottom-color', '10px solid #ef8c6b')

            } else if (item.severityColor === 'Green') {
                newli.querySelector('.warning-content').style[`background-color`] = '#a3d765'
                newli.querySelector('.warning-head').style[`background-color`] = '#a3d765'
                newli.querySelector('.warning-block').style.setProperty('--border-bottom-color', '10px solid #a3d765')
            }
            else if (item.severityColor === 'White') {
                newli.querySelector('.warning-content').style[`background-color`] = '#fff'
                newli.querySelector('.warning-content').style[`color`] = '#000'
                newli.querySelector('.warn-name').style['color'] = '#000'
                newli.querySelector('.warning-head').style[`background-color`] = '#fff'
                newli.querySelector('.warning-block').style.setProperty('--border-bottom-color', '10px solid #fff')
            }
            else if (item.severityColor === 'Red') {
                newli.querySelector('.warning-content').style[`background-color`] = '#f66863'
                newli.querySelector('.warning-head').style[`background-color`] = '#f66863'
                newli.querySelector('.warning-block').style.setProperty('--border-bottom-color', '10px solid #f66863')
            } else if (item.severityColor === 'Black') {
                newli.querySelector('.warning-content').style[`background-color`] = '#000'
                newli.querySelector('.warning-head').style[`background-color`] = '#000'
                newli.querySelector('.warning-block').style.setProperty('--border-bottom-color', '10px solid #000')
            }


            newli.querySelector('.warn-name').innerText = `${item.typeName}预警`
            newli.querySelector('.warning-head').innerText = `${item.typeName}${item.level}预警`

            newli.querySelector('.warning-detail').innerText = item.text
            warnList.append(newli)

        })
    })
})

//七日天气预报
