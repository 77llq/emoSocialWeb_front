import axios from "axios";

const httptool = axios.create({
    baseURL: 'http://localhost:5173/', // 请求的公共路径,一般填写服务端的api地址
    timeout: 1000,  // 最大请求超时时间，请求超过这个时间则报错
    headers: {}  // 预定义请求头，一般工作中这里填写隐藏了客户端身份的字段
});

// 拦截器
// 添加一个请求拦截器
httptool.interceptors.request.use((config) => {
    console.log("http请求之前");
    return config;
}, (error) => {
    console.log("http请求错误");
    return Promise.reject(error);
});

// 添加一个响应拦截器
httptool.interceptors.response.use((response) => {
    console.log("服务端响应数据成功以后，返回结果给客户端的第一时间，执行then之前");
    return response;
}, (error) => {
    console.log("服务端响应错误内容的时候。...")
    return Promise.reject(error);
});

export default httptool;