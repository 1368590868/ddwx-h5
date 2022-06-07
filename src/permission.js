import router from './router';
import store from './store';
import { loadJSAPI } from '@/utils/MobilePlatform';
import { getToken } from '@/utils/auth';

const whiteList = ['/jsapi'] // no redirect whitelist
router.beforeEach(async (to, from, next) => {
	if (whiteList.indexOf(to.path) !== -1) {
		next();
	} else {
		const hasToken = getToken();
		if (hasToken) {
			const hasRoles = store.getters.userInfo && store.getters.userInfo !== null;
			if (hasRoles) {		// 动态路由状态请求状态
				let newWW = await loadJSAPI();
				let title = to.meta && to.meta.title;
				newWW.biz.navigation.setTitle({
					title: title
				});
				next();
			} else {
				try {
					await store.dispatch('auth/sysAuth');
					next({ ...to, replace: true })
				} catch (error) {
					
				}
			}
		} else {
			try {
				await store.dispatch('auth/authAuth');
				next({ ...to, replace: true })
			} catch (error) {

			}
		};
	}
});