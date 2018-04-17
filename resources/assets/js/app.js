/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.moment = require('moment');
moment.locale('ru');
moment.updateLocale('ru', {
    months: [
        "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля",
        "Августа", "Сентября", "Октября", "Ноября", "Декабря"
    ]
});
moment.updateLocale('ru', {
    weekdays: [
        "Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"
    ]
});

window.datepicker = require('./datepicker');

window.Vue = require('vue');
window.VeeValidate = require('vee-validate');
window.vvDictionaryRu = require('vee-validate/dist/locale/ru');

Vue.use(VeeValidate, {
    locale: 'ru',
    dictionary: {
        ru: {
            messages: vvDictionaryRu
        }
    }
});
Vue.prototype.$moment = moment;


/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('example-component', require('./components/ExampleComponent.vue'));
Vue.component('render-norders', require('./components/RenderNorders.vue'));
Vue.component('edit-norder', require('./components/EditNorder.vue'));
Vue.component('nannies-in-edit-norder', require('./components/NanniesInEditNorder.vue'));

Vue.component('control-time-list-nannies', require('./components/controlTimeListNannies.vue'));
Vue.component('worktimes-list', require('./components/WorktimesList.vue'));


if ($('#vue-main').length > 0) {
    const app = new Vue({
        el: "#vue-main",
        data: {
            calcView: true,
            pickedDate: moment(),
            norders: norders,
            editStart: false,
            toEditNorder: false
        },
        computed: {
            renderNorders: function () {
                let mommentPickdate = moment(this.pickedDate);
                let currentDate = mommentPickdate.get('date');
                let currentMonth = mommentPickdate.get('month');
                return this.norders.filter(function (item) {
                    let foreachDay = moment(item.start).get('date');
                    let foreachMonth = moment(item.start).get('month');
                    if (currentDate === foreachDay && currentMonth === foreachMonth) {
                        return true;
                    }
                });
            }
        },
        methods: {
            renderCalendar: function () {
                let vm = this;
                let lstSelectedDate = moment();
                this.$nextTick(function () {
                    if (window.nDatepicker) {
                        lstSelectedDate = window.nDatepicker.lastSelectedDate;
                        window.nDatepicker.destroy();
                    }
                    window.nDatepicker = $('#datepickerCalen').datepicker({
                        onRenderCell: function (date, cellType) {
                            let currentDate = date.getDate();
                            let currentMonth = date.getMonth();
                            if (cellType === 'day') {
                                let toRen = "<div>";
                                vm.norders.forEach(function (item, index) {
                                    let foreachDay = moment(item.start).get('date');
                                    let foreachMonth = moment(item.start).get('month');
                                    if (currentDate === foreachDay && currentMonth === foreachMonth) {
                                        let color = (item.is_confirmed === "1") ? "#50C878" : "red";
                                        toRen = toRen + "<i style='color:" + color + "; font-size:14px;' class='fa fa-tag'></i>";
                                    }
                                });
                                toRen += '</div>';
                                return {
                                    html: "<span style='width:20px; border-bottom:1px solid gray;'>" + currentDate + "</span>" + toRen
                                }
                            }
                        },
                        onSelect: function (fd, date) {
                            vm.pickedDate = date;
                        }
                    }).data('datepicker');
                    window.nDatepicker.selectDate(lstSelectedDate);
                });

            },
            startEditNorder: function (id) {
                let toEdit = this.norders.filter(function (item) {
                    return item.id === id;
                });
                this.toEditNorder = toEdit[0];
                this.editStart = true;
            },
            endEditNorder: function () {
                this.editStart = false;
                this.toEditNorder = false;
            }
        },
        mounted: function () {
            this.renderCalendar();
            console.log('mounted');
        },
        updated: function () {
            console.log('updated');
        }
    });
}

let datepcikerWork = "";

if ($('#vue-main-nanny-hours').length > 0) {
    const nannyHours = new Vue({
        el: "#vue-main-nanny-hours",
        data: {
            nannies: nannies,
            worktimes: false,
            startDate: new Date(),
            choosedNanny: false,
            pickedDate: "",
            addWorkTimeData: {
                view: false,
                start: "",
                end: "",
                errorCaption: "",
                once: false
            },
            resultCaption: "",
            changedMonth : false,
            changedYear: false
        },
        computed: {
            pickedDateSplit: function () {
                this.viewAddWorkTime = false;
                return this.pickedDate.split(',');
            },
            preparedWorkTimes: function () {
                let vm = this;
                if (vm.worktimes && vm.pickedDate) {
                    let start = moment(vm.pickedDateSplit[0]).get('date');
                    let end = (vm.pickedDateSplit[1]) ? moment(vm.pickedDateSplit[1]).get('date') : start;
                    return this.worktimes.filter(item => {
                        let da = item.startM.date();
                        return (start <= da && da <= end);
                    });
                }
                return [];

            }
        },
        methods: {
            renderCalendar: function () {
                let vm = this;
                if (vm.worktimes) {
                    if (datepcikerWork) {
                        datepcikerWork.destroy();
                    }
                    datepcikerWork = $('#datepickerCalen').datepicker({
                        dateFormat: "yyyy-mm-dd",
                        multipleDates: true,
                        range: true,
                        startDate: vm.startDate,
                        onRenderCell: function (date, cellType) {
                            let mDate = moment(date);
                            let countMinutes = 0;
                            if (cellType === 'day') {
                                vm.worktimes.forEach(function (item, index) {

                                    let a = mDate.isBetween(item.startM, item.endM, 'day', '[]');
                                    if (a) {
                                        countMinutes += (item.endM - item.startM) / (1000 * 60);
                                    }
                                });
                                let percent = (countMinutes / ((24 * 60) / 100));
                                let color = (percent < 30) ? 'danger' : (percent < 75) ? 'info' : 'success';
                                let progressBar = '';
                                if (percent > 0) {
                                    progressBar = `<div style="border-radius:0; margin:48px 0 0 0;"class="progress progress-striped">                                                                                          
                                                             <div class="progress-bar progress-bar-${color}" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: ${percent}%">     
                                                                <span class="sr-only">${percent}% Complete (success)</span>                                                                                               
                                                              </div>                                                                                                                                                      
                                                            </div>`;
                                }
                                else {
                                    progressBar = "";
                                }
                                let toRen = progressBar;
                                return {
                                    html: "<span style='margin-left:5px; width:20px; border-bottom:1px solid gray;'>" + mDate.date() + "</span>" + toRen
                                }
                            }
                        },
                        onSelect: function (fd, date) {
                            vm.resultCaption = "";
                            vm.pickedDate = fd;
                        },
                        onChangeMonth: function (month, year) {
                            vm.startDate = new Date(year, month, 1);
                            vm.changedMonth = month;
                            vm.changedYear = year;
                            vm.getWorkTimes();
                        }
                    }).data('datepicker');

                }
            },
            chooseNanny: function (nanny) {
                this.choosedNanny = nanny;
                this.getWorkTimes();
            },
            getWorkTimes: function () {
                let vm = this;

                start = (vm.changedMonth && vm.changedYear)
                    ? moment().startOf('month').year(vm.changedYear).month(vm.changedMonth).subtract(7, 'days')
                    : moment().startOf('month').subtract(7, 'days');

                end = (vm.changedMonth && vm.changedYear)
                    ? moment().endOf('month').year(vm.changedYear).month(vm.changedMonth).add(7, 'days')
                    : moment().endOf('month').add(7, 'days');

                let formatTime = 'YYYY-MM-DD hh:mm::ss';
                let url = `/ajax/get_work_times?id=${vm.choosedNanny.id}&start=${start.format(formatTime)}&end=${end.format(formatTime)}`;
                axios.get(url).then(response => {
                    this.worktimes = response.data.worktimes.map(item => {
                        item.startM = moment(item.start);
                        item.endM = moment(item.end);
                        item.onceDay = (item.startM.date() === item.endM.date());
                        return item;
                    });
                    this.renderCalendar();
                }).catch(error => {
                    alert('Сервер не овечает. Ошибка: ' + error);
                });
            },
            addWorkTime: function () {
                let vm = this;
                this.addWorkTimeData.view = true;
                this.$nextTick(function () {

                    $("#startWorkTime").datepicker({
                        datepicker:false,
                        timepicker:true,
                        confirmButton: true,
                        clearButton: true,
                        autoCLose: true,
                        language: 'ru',
                        onlyTimepicker: true,
                        onSelect: function(fd){
                            vm.addWorkTimeData.start = fd;
                        }

                    });

                    $("#endWorkTime").datepicker({
                        datepicker:false,
                        timepicker:true,
                        confirmButton: true,
                        clearButton: true,
                        autoCLose: true,
                        language: 'ru',
                        onlyTimepicker: true,
                        onSelect: function(fd){
                            vm.addWorkTimeData.end = fd;
                        }
                    });

                });
            },
            saveWorkTime: function () {
                let vm = this;
                vm.$validator.validateAll().then((result) => {
                    if(result) {
                        axios({
                            method: "post",
                            url: `/ajax/add_worktime/`,
                            data: {
                                WorkTime: {
                                    nanny_id: vm.choosedNanny.id,
                                    start: vm.pickedDateSplit[0] + ' ' + vm.addWorkTimeData.start,
                                    end: ((vm.pickedDateSplit[1]) ? vm.pickedDateSplit[1] : vm.pickedDateSplit[0]) + ' ' + vm.addWorkTimeData.end,
                                    once: (vm.addWorkTimeData.once) ? 1 : 2
                                }
                            }
                        })
                            .then(response => {
                                if (response.data.success) {
                                    this.getWorkTimes();
                                    this.resultCaption = 'Сохранено!';
                                    this.cancelAddWorkTime();
                                }
                            })
                            .catch(e => {
                                console.log(e);
                            })
                    }else{
                        vm.addWorkTimeData.errorCaption = 'Исправьте ошибки!';//"Укажите начальное и конечное время";
                    }
                });
                if (this.addWorkTimeData.start && this.addWorkTimeData.end) {

                } else {
                    vm.addWorkTimeData.errorCaption = "Укажите начальное и конечное время";
                }
            },
            cancelAddWorkTime() {
                this.addWorkTimeData.view = false;
                this.addWorkTimeData.start = "";
                this.addWorkTimeData.end = "";
                this.addWorkTimeData.once = false;
                this.addWorkTimeData.errorCaption = "";

            },
            deleteWorkTime(id) {
                this.worktimes = this.worktimes.filter(item => {
                    return (item.id !== id);
                });
                this.renderCalendar();
            }
        }
    });
    $('.form-inline').submit(function () {
        return false;
    })
}

