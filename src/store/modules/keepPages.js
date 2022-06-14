const moduleName = {
    state: {
        keepPages: ''
    },
    mutations: {
        changeKeepPages(state, status) {
            state.keepPages = status;
        },
        keepThisPage(state, status) {
            const arr = state.keepPages.split(",");
            arr.push(status);
            state.keepPages = arr + "";
        },
        removeThisPage(state, status) {
            const arr = state.keepPages.split(",");
            const index = arr.findIndex(x => x === status);
            if (index > 0) {
                arr.splice(index, 1);
            }
            state.keepPages = arr + "";
        }

    },
    actions: {
        name(context, payload) {

        }
    },
}
export default moduleName