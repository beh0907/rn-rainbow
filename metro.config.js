const {getDefaultConfig} = require('@expo/metro-config')

const defaultConfig = getDefaultConfig(__dirname)
defaultConfig.resolver.assetExts.push('cjs', 'db', 'mp3', 'ttf', 'obj', 'png', 'jpg', 'mtl');

module.exports = defaultConfig
