import packageInfo from '../package.json'

// 应用版本以 package.json 为唯一来源。
export const APP_VERSION = packageInfo.version
