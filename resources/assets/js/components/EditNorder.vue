<template>
    <div class="panel panel-default">
        <template v-if="norder">
            <div class="panel-heading"><b>Редактирование заказа № {{norder.id}}</b></div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-lg-12">
                        <h3></h3>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="child_count">Количество детей</label>
                                    <input v-validate="'required|decimal|min_value:1|max_value:8'"
                                           data-vv-as="выше"
                                           v-model="child_count"
                                           :class="{'input': true, 'is-danger-border': errors.has('child_count') }"
                                           id="child_count" name="child_count" class="form-control"/>
                                    <span v-show="errors.has('child_count')" class="help is-danger">{{ errors.first('child_count') }}</span>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="babies">Кол-во детей младше 18 мес.</label>
                                    <input
                                            v-validate="'required|decimal|min_value:0|max_value:' + child_count"
                                            data-vv-as="выше"
                                            :class="{'input': true, 'is-danger-border': errors.has('babies') }"
                                            name="babies"
                                            v-model="babies" id="babies" class="form-control"/>
                                    <span v-show="errors.has('babies')" class="help is-danger">{{ errors.first('babies') }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="start">Начало</label>
                                    <input class="form-control"
                                           v-validate="'required|date_format:YYYY-MM-DD hh:mm|' +
                                            'date_between:2018-01-01 01:00,' + $moment(end).subtract(1, 'hours').format('YYYY-MM-DD hh:mm') + ',[]'"
                                           data-vv-as="выше"
                                           :class="{'input': true, 'is-danger-border': errors.has('start') }"
                                           name="start"
                                           v-model="start" type="text" data-position="right top"
                                           id="start"/>
                                    <span v-show="errors.has('start')" class="help is-danger">{{ errors.first('start') }}</span>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="end">Конец</label>
                                    <input class="form-control"
                                           v-validate="'required|date_format:YYYY-MM-DD hh:mm|' +
                                            'date_between:' + $moment(start).add(1, 'hours').format('YYYY-MM-DD hh:mm') + ',' + $moment(start).add(31, 'days').format('YYYY-MM-DD hh:mm') + ',[]'"
                                           data-vv-as="выше"
                                           :class="{'input': true, 'is-danger-border': errors.has('end') }"
                                           name="end"
                                           v-model="end" id="end"/>
                                    <span v-show="errors.has('end')"
                                          class="help is-danger">{{ errors.first('end') }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="amount">Сумма</label>
                                    <input v-if="norder.is_payed === '1'" class="form-control"
                                           readonly
                                           v-validate="'required|decimal|min_value:20|max_value:300000'"
                                           data-vv-as="выше"
                                           :class="{'input': true, 'is-danger-border': errors.has('amount') }"
                                           name="amount"
                                           v-model="amount" id="amount"/>
                                    <input v-else class="form-control"
                                           v-validate="'required|decimal|min_value:20|max_value:300000'"
                                           data-vv-as="выше"
                                           :class="{'input': true, 'is-danger-border': errors.has('amount') }"
                                           name="amount"
                                           v-model="amount" id="amount"/>
                                    <span v-show="errors.has('amount')" class="help is-danger">{{ errors.first('amount') }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <label>Няни:</label>
                                <p>
                                    <button class="btn btn-primary" v-on:click="modalAddNannies()">Добавить няню
                                    </button>
                                </p>
                                <nannies-in-edit-norder v-if="nannies.length > 0"
                                                        :nannies="nannies"></nannies-in-edit-norder>
                                <div class="alert alert-warning" v-else>Спсиок нянь в заказе не может быть пустым</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12" style="font-size:14px; padding-bottom:10px;">
                                <span>-------------------------------</span><br/>
                                <span style="color:red;" v-if="validateResult">{{validateResult}}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <button class="btn btn-primary" v-on:click="saveNorder()"><i class="fa fa-check"></i>
                                    Сохранить
                                </button>
                                <button class="btn btn-default" v-on:click="toBack()"><i class="fa fa-times"></i> Отмена
                                </button>
                            </div>
                        </div>
                        <div class="modal fade" id="addNanniesModal" tabindex="-1" role="dialog"
                             aria-labelledby="myModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                                            &times;
                                        </button>
                                        <h4 class="modal-title" id="myModalLabel">Добавление нянь в заказ</h4>
                                    </div>
                                    <div class="modal-body">
                                        <template v-if="toRenderForAddNannies.length > 0">

                                            <h5>Список доступных нянь на время {{$moment(start).format("DD MMMM YYYY, hh:mm")}}
                                                - {{$moment(end).format("DD MMMM YYYY, hh:mm")}}</h5>
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <div v-for="row in toRenderForAddNannies" class="row">
                                                        <div v-for="addNannyLet in row" class="col-lg-4" style="">
                                                            <div class="row">
                                                                <div class="col-lg-5">
                                                                    <img style="height:60px;" class="img-circle"
                                                                         :src="'http://supernanny.kz/' + addNannyLet.User.photo"
                                                                         :alt="addNannyLet.User.name">
                                                                </div>
                                                                <div class="col-lg-7">
                                                                    <span style="font-size:12px;">{{addNannyLet.User.name}}</span>
                                                                    <p>
                                                                        <button class="btn btn-info btn-xs"
                                                                                v-on:click="addNanny(addNannyLet)"><i
                                                                                style="top:3px;"
                                                                                title="Добавить" class="fa fa-plus"></i>
                                                                            Добавить
                                                                        </button>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                        <p v-else>Свободных нянь на время этого заказа нет.</p>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" v-on:click="dismodalAddNannies()" class="btn btn-primary">
                                            Готово
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div class=""></div>

                    </div>
                </div>
            </div>
        </template>
        <span v-else>Заказа не передан</span>
    </div>
</template>

<script>
    export default {
        mounted() {
            let vm = this;
            $('#start').datepicker({
                timepicker: true,
                timeFormat: 'hh:ii',
                position: 'bottom left',
                autoClose: true,
                dateFormat: 'yyyy-mm-dd',
                onSelect: function (fr, date, inst) {
                    vm.start = vm.$moment(date).format('YYYY-MM-DD hh:mm');
                }
            });
            $('#end').datepicker({
                timepicker: true,
                timeFormat: 'hh:ii',
                position: 'bottom left',
                autoClose: true,
                dateFormat: 'yyyy-mm-dd',
                onSelect: function (fr, date, inst) {
                    vm.end = vm.$moment(date).format('YYYY-MM-DD hh:mm');
                }
            });
        },
        props: ['norder'],
        data: function () {
            let vm = this;
            console.log(vm.norder);
            if (vm.norder) {
                console.log('cccc');
                return {
                    child_count: vm.norder.child_count,
                    babies: vm.norder.babies,
                    start: vm.$moment(vm.norder.start).format('YYYY-MM-DD hh:mm'),
                    end: vm.$moment(vm.norder.end).format('YYYY-MM-DD hh:mm'),
                    amount: vm.norder.amount,
                    nannies: vm.norder.Nanny.slice(),
                    searchedNannies: [],
                    deletedNannies: [],
                    addedNannies: [],
                    validateResult: false
                }
            } else {
                console.log('bbbb');
                return {}
            }

        },
        computed: {
            toRenderForAddNannies: function () {
                let vm = this;
                let baseNannies = vm.searchedNannies.slice();
                if (vm.deletedNannies.length > 0) {
                    vm.deletedNannies.forEach(function (itemD) {
                        console.log('start first');
                        if (baseNannies.filter(function (item) {
                                console.log('start second');
                                console.log(itemD.id + " === " + item.id + (itemD.id === item.id));
                                return (itemD.id === item.id);
                            }).length === 0) {
                            baseNannies.push(itemD);
                        }
                    });
                }
                if (vm.nannies.length > 0) {
                    baseNannies = baseNannies.filter(function (item) {
                        return (vm.nannies.filter(function (itemN) {
                            return (itemN.id === item.id);
                        }).length === 0);
                    });
                }

                let baseArr = [];
                let groupArr = [];
                baseNannies.forEach(function (item, index) {
                    if (groupArr.length < 3) {
                        groupArr.push(item);
                        if ((index + 1) === baseNannies.length) {
                            baseArr.push(groupArr.slice());
                        }
                    } else {
                        baseArr.push(groupArr.slice());
                        groupArr = [];
                        groupArr.push(item);
                        if ((index + 1) === baseNannies.length) {
                            baseArr.push(groupArr.slice());
                        }
                    }
                });
                return baseArr;
            }
        },
        methods: {
            saveNorder: function () {
                let vm = this;
                vm.$validator.validateAll().then((result) => {
                    if (result) {
                        if (vm.nannies.length === 0) {
                            return;
                        }
                        let mappedNannies = vm.nannies.map((item) => {
                            return item.id
                        });
                        axios({
                            method: "POST",
                            url: "/ajax/norder/edit/" + vm.norder.id + '/',
                            data: {
                                child_count: +vm.child_count,
                                babies: +vm.babies,
                                start: vm.start,
                                end: vm.end,
                                amount: +vm.amount,
                                nannies: mappedNannies
                            }
                        }).then(function (response) {
                            if (response.data.success === true) {
                                vm.$parent.updateNorder({
                                    id: vm.norder.id,
                                    child_count: vm.child_count,
                                    babies: vm.babies,
                                    start: vm.start,
                                    end: vm.end,
                                    amount: vm.amount,
                                    nannies: vm.nannies
                                })
                            }
                            console.log(response);
                        })
                            .catch(e => {
                                console.log(e)
                            });
                    } else {
                        vm.validateResult = "Исправьте ошибки в полях, помеченных красным цветом."
                    }
                });
            },
            toBack: function () {
                this.$parent.endEditNorder();
            },
            deleteNanny: function (nanny_id) {
                let vm = this;
                this.nannies = this.nannies.filter(function (item) {
                    if (item.id !== nanny_id) {
                        return true;
                    } else {
                        vm.deletedNannies.push(item);
                        return false;
                    }
                });
            },
            modalAddNannies: function () {
                let vm = this;
                axios({
                    method: "GET",
                    url: "http://supernanny.kz/ajax/norder/get_free_nannies?start=" + vm.start + "&end=" + vm.end,
                }).then(function (response) {
                    if (response.data.result === true) {
                        vm.searchedNannies = response.data.nannies;
                    }
                });
                $('#addNanniesModal').modal('show');
            },
            dismodalAddNannies: function () {
                $('#addNanniesModal').modal('hide');
            },
            addNanny: function (nanny) {
                let vm = this;
                if (vm.nannies.filter(function (item) {
                        return (nanny.id === item.id);
                    }).length === 0) {
                    vm.nannies.push(nanny);
                    vm.deletedNannies = vm.deletedNannies.filter(function (item) {
                        return (nanny.id !== item.id);
                    });
                }
            }
        }

    }
</script>
<style>
    .is-danger {
        color: red;
    }

    .is-danger-border {
        border: 2px solid red;
    }

    .help {
        font-size: 13px;
    }
</style>