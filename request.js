//请求头
axios.defaults.baseURL = 'https://nn6r6x7pdy.re.qweatherapi.com'

// //请求器拦截
// axios.interceptors.request.use(function (config) {
//     const token = localStorage.getItem('token')
//     //添加请求头
//     if (token) {
//         config.headers['X-QW-Api-Key'] = key
//     }
//     // 在发送请求之前做些什么
//     return config
// }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
// });