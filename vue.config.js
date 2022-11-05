const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: './',
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '重新开始'
       return args
     })
  },
  transpileDependencies: true
})
