import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import VitePluginElementPlus from 'vite-plugin-element-plus'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    // base: './',
    // resolve: {
    //     alias: {
    //         '@': path.resolve(__dirname, './src'),
    //     }
    // },
    plugins: [
        vue(),
    ],
})
