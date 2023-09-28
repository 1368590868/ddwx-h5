export default {
    mounted () {
        // document.querySelector('.')

    },
    methods: {
        teleponeClick (phone) {  // 拨打电话 api
            // this.$ww.biz.telephone.showCallMenu({
            //     phoneNumber: phone,
            //     code: '+86',
            //     onSuccess: function () {
            //         alert("拨打电话成功!");
            //     },
            //     onFail: function (err) {alert(err)} 
            // });
        },
        dialogConfirm(options, beforeCloseCallback) {
            
            return this.$dialog.confirm({
                title: options.title || '提示',
                message: options.message || '',
                beforeClose: beforeCloseCallback
            });
        }


    }
}