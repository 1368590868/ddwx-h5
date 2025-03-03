<template>
    <div class="calendar-wrapper">
        <div class="header" v-if="headerBar">
            <div class="pre" @click="changeMonth('pre')">上个月</div>
            <div>{{y+'年'+formatNum(m)+'月'}}</div>
            <div class="next" @click="changeMonth('next')">下个月</div>
        </div>
        <div class="week">
            <div class="week-day" v-for="(item, index) in weekDay" :key="index">{{ item }}</div>
        </div>
        <div :class="{ hide: !monthOpen }" class="content" :style="{ height: height }">
            <div :style="{ top: positionTop / 2 + 'px' }" class="days">
                <div class="item" v-for="(item, index) in dates" :key="index">
                    <div
                        class="day"
                        @click="selectOne(item, $event)"
                        :class="{
                            choose: choose == `${item.year}-${item.month}-${item.date}`&&item.isCurM,
                            nolm: !item.isCurM,
                            today: isToday(item.year, item.month, item.date),
                            isWorkDay: isWorkDay(item.year, item.month, item.date)
                        }"
                    >
                        {{ Number(item.date) }}
                    </div>
                    <div class="markDay" v-if="isMarkDay(item.year, item.month, item.date)&&item.isCurM"></div>
                    <!-- <div class="today-text" v-if="isToday(item.year, item.month, item.date)">今</div> -->
                </div>
            </div>
        </div>
        <img src="https://i.loli.net/2020/07/16/2MmZsucVTlRjSwK.png" mode="scaleToFill" v-if="collapsible" @click="toggle" class="weektoggle" :class="{ down: monthOpen }"></img>
    </div>
</template>

<script>
export default {
    name: 'ren-calendar',
    props: {
        weekstart: {
            type: Number,
            default: 0
        },
        markDays: {
            type: Array,
            default: ()=>{
                return [];
            }
        },
        headerBar:{
            type: Boolean,
            default: true
        },
        open: {
            type: Boolean,
            default: false
        },
        collapsible:{
            type: Boolean,
            default: true
        },
        disabledAfter: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            weektext: ['日', '一', '二', '三', '四', '五', '六'],
            y: new Date().getFullYear(),
            m: new Date().getMonth() + 1,
            dates: [],
            positionTop: 0,
            monthOpen: true,
            choose: ''
        };
    },
    created() {
        
    },
    mounted() {
        this.dates = this.monthDay(this.y, this.m);
        !this.open && this.toggle();
        this.choose = this.getToday().date;
    },
    computed: {
        weekDay() {
            return this.weektext.slice(this.weekstart).concat(this.weektext.slice(0, this.weekstart));
        },
        height() {
            return (this.dates.length / 7) * 40 + 'px';
        }
    },
    methods: {
        formatNum(num) {
            let res = Number(num);
            return res < 10 ? '0' + res : res;
        },
        getToday() {
            let date = new Date();
            let y = date.getFullYear();
            let m = date.getMonth();
            let d = date.getDate();
            let week = new Date().getDay();
            let weekText = ['日', '一', '二', '三', '四', '五', '六'];
            let formatWeek = '星期' + weekText[week];
            let today = {
                date: y + '-' + this.formatNum(m + 1) + '-' + this.formatNum(d),
                week: formatWeek
            };
            return today;
        },
        monthDay(y, month) {
            let dates = [];
            let m = Number(month);
            let firstDayOfMonth = new Date(y, m - 1, 1).getDay();
            let lastDateOfMonth = new Date(y, m, 0).getDate();
            let lastDayOfLastMonth = new Date(y, m - 2, 0).getDate();
            let weekstart = this.weekstart == 7 ? 0 : this.weekstart;
            let startDay = (() => {
                if (firstDayOfMonth == weekstart) {
                    return 0;
                } else if (firstDayOfMonth > weekstart) {
                    return firstDayOfMonth - weekstart;
                } else {
                    return 7 - weekstart + firstDayOfMonth;
                }
            })();
            let endDay = 7 - ((startDay + lastDateOfMonth) % 7);
            for (let i = 1; i <= startDay; i++) {
                dates.push({
                    date: this.formatNum(lastDayOfLastMonth - startDay + i),
                    day: weekstart + i - 1 || 7,
                    month: m - 1 >= 0 ? this.formatNum(m - 1) : 12,
                    year: m - 1 >= 0 ? y : y - 1
                });
            }
            for (let j = 1; j <= lastDateOfMonth; j++) {
                dates.push({
                    date: this.formatNum(j),
                    day: (j % 7) + firstDayOfMonth - 1 || 7,
                    month: this.formatNum(m),
                    year: y,
                    isCurM: true
                });
            }
            for (let k = 1; k <= endDay; k++) {
                dates.push({
                    date: this.formatNum(k),
                    day: (lastDateOfMonth + startDay + weekstart + k - 1) % 7 || 7,
                    month: m + 1 <= 11 ? this.formatNum(m + 1) : 0,
                    year: m + 1 <= 11 ? y : y + 1
                });
            }
            return dates;
        },
        isWorkDay(y, m, d) {
            let ymd = `${y}/${m}/${d}`;
            let formatDY = new Date(ymd.replace(/-/g, '/'));
            let week = formatDY.getDay();
            if (week == 0 || week == 6) {
                return false;
            } else {
                return true;
            }
        },
        isFutureDay(y, m, d) {
            let ymd = `${y}/${m}/${d}`;
            let formatDY = new Date(ymd.replace(/-/g, '/'));
            let showTime = formatDY.getTime();
            let curTime = new Date().getTime();
            if (showTime > curTime) {
                return true;
            } else {
                return false;
            }
        },
        isMarkDay(y, m, d) {
            let flag = false;
            for (let i = 0; i < this.markDays.length; i++) {
                let dy = `${y}-${m}-${d}`;
                if (this.markDays[i] == dy) {
                    flag = true;
                    break;
                }
            }
            return flag;
        },
        isToday(y, m, d) {
            let checkD = y + '-' + m + '-' + d;
            let today = this.getToday().date;
            if (checkD == today) {
                return true;
            } else {
                return false;
            }
        },
        toggle() {
            this.monthOpen = !this.monthOpen;
            if (this.monthOpen) {
                this.positionTop = 0;
            } else {
                let index = -1;
                this.dates.forEach((i, x) => {
                    this.isToday(i.year, i.month, i.date) && (index = x);
                });
                this.positionTop = -((Math.ceil((index + 1) / 7) || 1) - 1) * 40;
            }
        },
        selectOne(i, event) {
            let date = `${i.year}-${i.month}-${i.date}`;
            let selectD = new Date(date).getTime();
            let curTime = new Date().getTime();
            let week = new Date(date).getDay();
            let weekText = ['日', '一', '二', '三', '四', '五', '六'];
            let formatWeek = '星期' + weekText[week];
            let response = {
                date: date,
                week: formatWeek
            };
            if (!i.isCurM) {
                return false;
            }
            if (selectD > curTime) {
                if (this.disabledAfter) {
                    console.log('未来日期不可选');
                    return false;
                } else {
                    this.choose = date;
                    this.$emit('onDayClick', response);
                }
            } else {
                this.choose = date;
                this.$emit('onDayClick', response);
            }
            console.log(response);
        },
        changYearMonth(y, m) {
            this.dates = this.monthDay(y, m);
            this.y = y;
            this.m = m;
        },
        changeMonth(type){
            if(type=='pre'){
                if (this.m + 1 == 2) {
                    this.m = 12;
                    this.y = this.y - 1;
                } else {
                    this.m = this.m - 1;
                } 
            }else{
                if (this.m + 1 == 13) {
                    this.m = 1;
                    this.y = this.y + 1;
                } else {
                    this.m = this.m + 1;
                }
            }
            this.dates = this.monthDay(this.y, this.m);
        }
    }
};
</script>

<style lang="less" scoped>
.calendar-wrapper {
    color: #bbb7b7;
    font-size: 14px;
    text-align: center;
    background-color: #fff;
    padding-bottom: 5px;
    
    .header{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 44px;
        color: #42464A;
        font-size: 16px;
        font-weight: bold;
        border-bottom: 1px solid #f2f2f2;
        .pre,.next{
              color: #4d7df9;
              font-size: 14px;
              font-weight: normal;
              padding: 4px 7.5px;
              border-radius: 5px;
              border: 1px solid #dcdfe6;
        }
        .pre{
            margin-right: 15px;
        }
        .next{
            margin-left: 15px;
        }
    }

    .week {
        display: flex;
        align-items: center;
        height: 40px;
        line-height: 40px;
        border-bottom: 0.5px solid rgba(255, 255, 255, 0.2);

        div {
            flex: 1;
        }
    }

    .content {
        position: relative;
        overflow: hidden;
        transition: height 0.4s ease;

        .days {
            transition: top 0.3s;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            position: relative;

            .item {
                position: relative;
                display: block;
                height: 36px;
                line-height: 36px;
                width: calc(100% / 7);

                .day {
                    font-style: normal;
                    display: inline-block;
                    vertical-align: middle;
                    width: 30px;
                    height: 30px;
                    line-height: 30px;
                    overflow: hidden;
                    border-radius: 30px;

                    &.choose {
                        background-color: #4d7df9;
                        color: #fff;
                    }

                    &.nolm {
                        color: #fff;
                        opacity: 0.3;
                    }
                }
                .isWorkDay {
                    color: #42464a;
                }

                .notSigned {
                    font-style: normal;
                    width: 4px;
                    height: 4px;
                    background: #fa7268;
                    border-radius: 5px;
                    position: absolute;
                    left: 50%;
                    bottom: 0;
                    pointer-events: none;
                }
                .today {
                    color: #fff;
                    background-color: #a8c0ff;
                }
                .workDay {
                    font-style: normal;
                    width: 4px;
                    height: 4px;
                    background: #4d7df9;
                    border-radius: 5px;
                    position: absolute;
                    left: 50%;
                    bottom: 0;
                    pointer-events: none;
                }
                .markDay{
                    font-style: normal;
                    width: 4px;
                    height: 4px;
                    background: #fc7a64;
                    border-radius: 5px;
                    position: absolute;
                    left: 50%;
                    bottom: 0;
                    pointer-events: none;
                }
            }
        }
    }

    .hide {
        height: 40px !important;
    }

    .weektoggle {
        width: 42.5px;
        height: 16px;
        position: relative;
        bottom: -21px;
        &.down {
            transform: rotate(180deg);
            bottom: 0;
        }
    }
}
</style>