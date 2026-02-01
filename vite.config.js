import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import createVitePlugins from './vite/plugins';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  console.log('********** ' + mode + ' **********');
  console.log('********** ' + env.VITE_APP_TITLE + ' **********');
  const { VITE_APP_ENV, VITE_PORT, VITE_APP_BASE_API, VITE_APP_BASE_URL } = env;
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: [
      vueDevTools({
        componentGlobs: ['src/**/*.{vue,ts,js}'], // 匹配组件路径
        launchEditor: 'code',                     // 编辑器
        enable: true,                             // 是否启用
        devtoolsUIRoute: '/__devtools',           // 调试界面路由
        componentPreviewEnabled: true,            // 是否显示预览
        injectInDev: false,                        // 只在开发模式注入
        componentMetadata: true                   // 显示组件信息
      }),
      createVitePlugins(env, command === 'build'),
    ],
    define: {
      // __VUE_PROD_DEVTOOLS__: true
    },
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src'),
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    // // vite 相关配置
    server: {
      port: VITE_PORT,
      host: true,
      open: true,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        '/dev': {
          target: VITE_APP_BASE_URL,
          // target: "http://localhost:3000/v1",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev/, ''),
        },
      },
    },
    //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
    css: {
      // 在scss文件添加代码，测试没有成功
      preprocessorOptions: {
        scss: {
          // api: "modern-compiler" | "modern" | "legacy"
          // (如果安装了sass-embedded，默认为"modern-compiler"，否则为 "modern").
          // 为获得最佳性能，建议使用 api: "modern-compiler" 和 sass-embedded 软件包。"legacy" API 已过时，将在 Vite 7 中移除。
          api: 'modern-compiler', // 自动将 variables.scss 文件引入到所有的 SCSS 文件中。 最好只放变量的scss
          // additionalData: '@use "@/assets/styles/variables.module.scss" as *; ',     // 只要添加了，就报错？？？？？？
          javascriptEnabled: true,
        },
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
  };
});



