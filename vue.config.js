const autoprefixer = require("autoprefixer");
const pxtorem = require("postcss-pxtorem");
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: process.env.NODE_ENV !== "development" ? "/" : "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false,
  productionSourceMap: false,
  filenameHashing: true,

  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 37.5,
            propList: ["*"],
          }),
        ],
      },
    },
  },
  devServer: {
    port: 9527,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    publicPath: "/",
    proxy: {
      /**['/api/api-sys/ledgerofficesuppliesdt']: {
                target: host,
                changeOrigin: true,
                pathRewrite:{
                    ['^/api/api-sys']:'/api/api-dynamic'
                }
			},**/
      "/api": {
        // 开发
        // target: `http://172.28.20.247:8018/gwyc`,
        // target: `http://10.59.248.230:8018/gwyc`,
        // target: `http://192.168.61.141:8039/gwyc`,
        target: `http://192.168.8.39:8018/ddwx`,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: "公务用车",
    resolve: {
      alias: {
        "@": resolve("src"),
        static: resolve("static"),
      },
    },
  },
  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test

    // set svg-sprite-loader
    /**config.module
			.rule('svg')
			.exclude.add(resolve('src/icons'))
			.end()
		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/icons'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]'
			})
			.end()
		**/
    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

      

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === "development", (config) =>
        config.devtool("cheap-source-map")
      );

    config.when(process.env.NODE_ENV !== "development", (config) => {
      // config
      // 	.plugin('ScriptExtHtmlWebpackPlugin')
      // 	.after('html')
      // 	.use('script-ext-html-webpack-plugin', [{
      // 		// `runtime` must same as runtimeChunk name. default is `runtime`
      // 		inline: /runtime\..*\.js$/
      // 	}])
      // 	.end()
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-vant", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?vant(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
          uitls: {
            name: "chunk-utils",
            test: resolve("src/utils"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      config.optimization.runtimeChunk("single");
    });
  },
};
