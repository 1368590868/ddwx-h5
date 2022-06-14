const getters = {
  AraeList: state => state.pubdata.AraeList,
  permission_routes: state => state.permission.routes,
  userInfo: state => state.auth.userInfo,
  badgeNo: state => state.auth.badgeNo,
  getKeepPages:state=>state.keepPages.keepPages
  // size: state => state.app.size,
  // device: state => state.app.device,
  // visitedViews: state => state.tagsView.visitedViews,
  // cachedViews: state => state.tagsView.cachedViews,
  // avatar: state => state.user.avatar,
  // name: state => state.user.name,
  // introduction: state => state.user.introduction,
  // roles: state => state.user.roles,
  // errorLogs: state => state.errorLog.logs


}
export default getters
