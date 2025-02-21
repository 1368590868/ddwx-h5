const SM4 = require('gm-crypt').sm4

let sm4Config = {
    key: 'JeF8U9wHFOMfs2Y8',
    mode: 'ecb', // 加密的方式有两种，ecb和cbc两种，也是看后端如何定义的，不过要是cbc的话下面还要加一个iv的参数，ecb不用
    // optional: this is the cipher data's type; Can be 'base64' or 'text'
    cipherType: 'base64' // default is base64

}
let sm4 = new SM4(sm4Config)

export default sm4
