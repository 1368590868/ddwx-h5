let ISSUCCESS = false;

const DevelopmentJSAPI = {
    biz: {
        navigation: {
            setTitle: function (titleOptions) {
                document.title = titleOptions.title || "";
                titleOptions.onSuccess && titleOptions.onSuccess();
            },
            setRight: function (options) {
               
            }
        },
        telephone: {
            showCallMenu: function (phoneOptions) {
                phoneOptions.onSuccess && phoneOptions.onSuccess();
            }
        },
        
    }
}
export const loadJSAPI = () => {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'development') {   // 线上环境
            if (ISSUCCESS) {
                resolve(ww);
            } else {
                try {
                    ww && ww.ready({
                        uuid:"4ed87cbe2a443068bdac2a5",//H5子应用的uuid
                        onSuccess: function(result) {
                            resolve(ww);
                        },
                        onError: function(err) {
                            resolve(err)
                            alert("初始化错误!");
                        }
                    });
                } catch (err){
                    alert("ww.ready未初始化!")
                    resolve(err)
                }
            }
        } else {
            resolve(DevelopmentJSAPI);
        };
    });
}






export const JSAPI = (options => (process.env.NODE_ENV !== 'development' ? ww: DevelopmentJSAPI))(0) ;


const MobilePlatform = {
    install: function(Vue){
        if (process.env.NODE_ENV !== 'development') {
            loadJSAPI().then((dataww) => {
                Vue.prototype.$ww = dataww;
            });
        } else {   // 开发环境
            Vue.prototype.$ww = DevelopmentJSAPI;
        }
    }
};

export default MobilePlatform;