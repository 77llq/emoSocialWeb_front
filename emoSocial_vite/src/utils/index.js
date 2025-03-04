import axios from 'axios';
import router from "../router/index.js";

axios.defaults.withCredentials = true;
// 创建一个独立的 axios 实例
const http = axios.create({
    withCredentials: true, // 发送跨域请求时是否需要凭证
    baseURL: '', // 通过 /api 别名指定后端路由，这里为空
    timeout: 5000,
});

// 检查 token 是否过期的函数
async function checkTokenExpiration() {
    return new Promise((resolve, reject) => {
        // 从缓存中获取 token，这里的 Authorization 是登录时你给用户设置 token 的键值
        let authorization = localStorage.getItem("token");

        // 如果 token 不为 null，则 token 有效，resolve
        if (authorization) {
            resolve();
        } else {
            // 否则 token 过期，reject
            reject();
        }
    });
}

// 添加请求拦截器
http.interceptors.request.use(
    async function (config) {
        try {
            // 检查 token 是否过期
            await checkTokenExpiration();
            // 从缓存中获取 token，这里的 Authorization 是登录时你给用户设置 token 的键值
            let authorization = localStorage.getItem("token");
            // 如果 token 不为 null，将 token 设置到请求头中
            if (authorization) {
                // 后台给登录用户设置的 token 的键是什么，headers 中的键也应该保持一致
                config.headers['Authorization'] = authorization;
            }
            // 放行
            return config;
        } catch (error) {
            // 如果 token 过期，则跳转到登录页面
            await router.push('/login');
            return Promise.reject(error);
        }
    },
    function (error) {
        // 对请求错误进行操作
        return Promise.reject(error);
    }
);

// 添加响应拦截器
http.interceptors.response.use(
    function (response) {
        // 在这里进行对响应数据的处理
        return response;
    },
    function (error) {
        // 对响应错误进行操作
        if (error.response && error.response.status === 401) {
            // 如果返回的状态码是 401，表示 token 过期或无效，跳转到登录界面
            router.push('/login');
        }
        return Promise.reject(error); // 使用 error.message 而不是 res.message
    }
);


export default http;
