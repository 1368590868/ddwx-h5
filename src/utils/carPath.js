const carImagePaths = [{
        key: '0 无匹配默认',
        value: "0 无匹配默认.jpg"
    },
    {
        key: 'JEEP 切诺基',
        value: "JEEP 切诺基.jpg"
    },
    {
        key: '奥迪 A6L',
        value: "奥迪 A6L.jpg"
    },
    {
        key: '奥迪 A8',
        value: "奥迪 A8.jpg"
    },
    {
        key: '奔驰 商务车',
        value: "奔驰 商务车.jpg"
    },
    {
        key: '本田 雅阁',
        value: "本田 雅阁.jpg"
    },
    {
        key: '别克 GL8',
        value: "别克 GL8.jpg"
    },
    {
        key: '别克 君威',
        value: "别克 君威.jpg"
    },
    {
        key: '别克 君越',
        value: "别克 君越.jpg"
    },
    {
        key: '大众 迈腾',
        value: "大众 迈腾.jpg"
    },
    {
        key: '大众 帕萨特',
        value: "大众 帕萨特.jpg"
    },
    {
        key: '大众 桑塔纳',
        value: "大众 桑塔纳.jpg"
    },
    {
        key: '大众 途锐',
        value: "大众 途锐.jpg"
    },
    {
        key: '丰田 海爱仕',
        value: "丰田 海爱仕.jpg"
    },
    {
        key: '丰田 汉兰达',
        value: "丰田 汉兰达.jpg"
    },
    {
        key: '丰田 凯美瑞',
        value: "丰田 凯美瑞.jpg"
    },
    {
        key: '丰田 考斯特',
        value: "丰田 考斯特.jpg"
    },
    {
        key: '丰田 兰德酷路泽',
        value: "丰田 兰德酷路泽.jpg"
    },
    {
        key: '丰田 普拉多',
        value: "丰田 普拉多.jpg"
    },
    {
        key: '丰田 普瑞维亚',
        value: "丰田 普瑞维亚.jpg"
    },
    {
        key: '广汽传祺 GM8',
        value: "广汽传祺 GM8.jpg"
    },
    {
        key: '红旗 H7',
        value: "红旗 H7.jpg"
    },
    {
        key: '红旗 H9',
        value: "红旗 H9.jpg"
    },
    {
        key: '江淮 瑞风',
        value: "江淮 瑞风.jpg"
    },
    {
        key: '江陵 ',
        value: "江陵.jpg"
    },
    {
        key: '斯柯达 速派',
        value: "斯柯达 速派.jpg"
    },
    {
        key: '沃尔沃 XC60',
        value: "沃尔沃 XC60.jpg"
    },
    {
        key: '现代 领动',
        value: "现代 领动.jpg"
    },
    {
        key: '徐工牌 ',
        value: "徐工牌.jpg"
    },
]
export default function checkCarImagePath(carBrand, carSeries) {
    if(!carBrand){
        carBrand = "";
    }
    if(!carSeries){
        carSeries = "";
    }
    let imageName = carBrand + " " + carSeries;

    let obj = carImagePaths.find((item) => {
        return item.key === imageName;
    })
    if (!obj) {
        return "/static/" + carImagePaths[0].value;
    }
    return "/static/" + obj.value;
}