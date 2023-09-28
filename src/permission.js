import router from "./router";
import store from "./store";
import { getToken } from "@/utils/auth";

const whiteList = ["/jsapi",'/mobile/login']; // no redirect whitelist
router.beforeEach(async (to, from, next) => {
    if (whiteList.indexOf(to.path) !== -1) {
        next();
    } else {
        const hasToken = getToken();

        if (hasToken) {
            const hasRoles = store.getters.userInfo && store.getters.userInfo !== null;
            if (hasRoles) {
                next();
            }else{
                try {
                    await store.dispatch("auth/authInfo");
                    next({ ...to, replace: true });
                } catch (error) {
                    console.error(error);
                }
            }
        } else {
            try {
                if(to.path === '/mobile'){   //移动端
                    next({path:'/mobile/login'})
                }else{      
                    await store.dispatch("auth/authAuth");  //PC端
                    next({ ...to, replace: true });
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
});