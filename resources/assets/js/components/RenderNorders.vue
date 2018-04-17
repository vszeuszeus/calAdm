<template>
    <div class="panel panel-default">
        <div class="panel-heading"><b>{{((pickDate) ? "Список заявок за " + $moment(pickDate).format("DD MMMM") : "Не выбрана дата просмотра")}}</b></div>
        <div class="panel-body">
            <div style="padding:10px;">
                <template v-if="norders.length > 0">
                    <div style="margin-bottom:10px; border-bottom:2px solid green;" v-for="(norder, index) in norders">
                        <div class="row ddCV topTRCV">
                            <div class="col-lg-1">
                                <p class="firstP">{{index + 1}}</p>
                            </div>
                            <div class="col-lg-4">
                                <p class="zaglovp">Начало</p><p class="pText">{{$moment(norder.start).format('Do MMMM YYYY, h:mm')}}</p>
                            </div>
                            <div class="col-lg-4">
                                <p class="zaglovp">Конец</p><p class="pText">{{$moment(norder.end).format('Do MMMM YYYY, h:mm')}}</p>
                            </div>
                            <div style="padding-right:0;" class="col-lg-1">
                                <p class="pfunc" v-if="norder.is_payed == 1" style="color:green; font-size:25px;"><i title="Оплачено" class="fa fa-money"></i></p>
                                <p class="pfunc" v-else style="color:red; font-size:25px;"><i title="Не оплачено" class="fa fa-money"></i></p>

                            </div>
                            <div style="padding:0 0 0 5px;" class="col-lg-1">
                                <p class="pfunc" v-if="norder.is_confirmed == 1" style="color:green; font-size:25px;"><i title="Подтверждено" class="fa fa-check"></i></p>
                                <p class="pfunc" v-else style="color:red; font-size:25px;"><i title="Не подтверждено" class="fa fa-times"></i></p>
                            </div>
                        </div>
                        <div class="row ddCV">
                            <div class="col-lg-2">
                                <p class="zaglovp">Сумма</p>
                                <p class="pText">{{norder.amount}}</p>
                            </div>
                            <div class="col-lg-2">
                                <p class="zaglovp">Дети</p>
                                <p class="pText">{{norder.child_count}}</p>
                            </div>
                            <div class="col-lg-2">
                                <p class="zaglovp">< 18 мес.</p>
                                <p class="pText">{{norder.babies}}</p>
                            </div>
                            <div class="col-lg-6">
                                <p class="zaglovp">Няни</p>
                                <p class="pText">{{norder.length}}
                                    <img style="height:30px; margin-right:3px; margin-left:6px;" v-for="nanny in norder.Nanny" :src="'http://supernanny.kz/' + nanny.User.photo" :alt="nanny.User.name"/>
                                </p>
                            </div>
                        </div>
                        <div class="row toBotCV">
                            <div class="col-lg-4">
                                <p class="zaglovp">Создано</p>
                                <p class="pText">{{norder.created_at}}</p>
                            </div>
                            <div class="col-lg-3">
                                <p class="zaglovp">Номер</p>
                                <p class="pText">{{norder.id}}</p>
                            </div>
                            <div class="col-lg-2">
                                <p class="zaglovp">Тип оплаты</p>
                                <p class="pText">{{norder.payed_type}}</p>
                            </div>
                            <div class="col-lg-3">
                                <p class="zaglovp">Функции</p>
                                <p class="pfunc">
                                    <button v-on:click="unconfirmNorder(norder.id)" v-if="norder.is_confirmed == 1" class="btn btn-warning btn-xs" title="Убрать статус 'Одобрено'"><i class="fa fa-times"></i></button>
                                    <button v-on:click="confirmNorder(norder.id)" v-else class="btn btn-success btn-xs" title="Одобрить"><i class="fa fa-check"></i></button>
                                    <button v-on:click="editNorder(norder.id)" class="btn btn-info btn-xs" title="Редактировать"><i class="fa fa-pencil-square"></i></button>
                                    <button v-on:click="deleteNorder(norder.id)" class="btn btn-danger btn-xs"  title="Удалить"><i class="fa fa-trash"></i></button>
                                </p>
                            </div>

                        </div>
                    </div>
                </template>
                <span v-else>Список заявок пуст.</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('Component mounted.')
        },
        props: ['norders', 'pickDate'],
        data: function () {
            return {
                wNorders : window.norders
            }
        },
        methods: {
            unconfirmNorder: function (id) {
                let vm = this;
                axios({
                    method: 'get',
                    url: '/ajax/norder/unconfirm/' + id,
                })
                    .then(function(response){
                        if(response.data.result === true){
                            let position = 0;
                            vm.wNorders.forEach(function(item, index){
                                if(item.id === id){
                                    position = index;
                                }
                            });
                            vm.wNorders[position].is_confirmed = "0";
                            vm.$parent.renderCalendar();
                        }else{
                            alert('Не существует заказа с ид № ' + id + '.');
                        }
                    })
                    .catch(function (error) {
                        alert('Ошибка отмены подтверждение: ' + error);
                    })
            },
            confirmNorder: function (id) {
                let vm = this;
                axios({
                    method: 'get',
                    url: '/ajax/norder/confirm/' + id,
                })
                    .then(function(response){
                        if(response.data.result === true){
                            let position = 0;
                            vm.wNorders.forEach(function(item, index){
                                if(item.id === id){
                                    position = index;
                                }
                            });
                            vm.wNorders[position].is_confirmed = "1";
                            vm.$parent.renderCalendar();
                        }else{
                            alert('Не существует заказа с ид № ' + id + '.');
                        }
                    })
                    .catch(function (error) {
                        alert('Ошибка подтверждение: ' + error);
                    })
            },
            editNorder: function (id) {
                this.$parent.startEditNorder(id);
            },
            deleteNorder:function (id) {
                let vm = this;
                if(confirm('Вы хотите удалить заказ № ' + id + '?')){
                    axios({
                        method: 'get',
                        url: '/ajax/norder/delete/' + id,
                    })
                        .then(function(response){
                            if(response.data.result === true){
                                let position = 0;
                                vm.wNorders.forEach(function(item, index){
                                    if(item.id === id){
                                        position = index;
                                    }
                                });
                                vm.wNorders.splice(position,1);
                                vm.$parent.renderCalendar();
                            }
                            console.log(response);
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                }
            }
        }
    }
</script>
<style>
    .zaglovp{
        color:#4EB5E6;
        font-weight:800;
        font-size:10px;
        margin-bottom:0px;
        padding: 0;
    }

    .firstP{
        color:red;
        font-size:20px;
        font-weight: 800;
        margin-left:7px;
        padding:0;
    }
    .toBotCV{
        padding-bottom:5px;
    }
    .topTRCV{
    }
    .pText{
        font-size:13px;
        color:black;
        padding: 0;
    }
    .iconSty{
        color:black;
    }
    .pfunc{
        padding:0;
    }
    .ddCV{
        margin-bottom:3px;
        padding-bottom:3px;
    }
</style>
