module.exports = {
    assetsDir: 'static',
    devServer: {
        proxy: {
            '/': {
                target: 'http://localhost:38015/', // 代理地址，这里设置的地址会代替axios中设置的baseURL
                changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
                ws: true,
                pathRewrite: {
                    '^/': ''
                }
            },
        }
    }
};
