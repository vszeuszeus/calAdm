<template>
    <div class="col-sm-12" style="padding:0px;">
        <table style="margin:4px 0 0 0;" class="simple-little-table">
            <tr v-for="(worktime, index) in worktimes" class="row">
                <td>
                    <div v-if="worktime.onceDay" class="col-sm-12">
                        <div class="row">
                            <div style="padding:0px;" class="col-lg-1">
                                <p style="padding:0px;"><span style="color:#bf1f1f; font-weight:800;">{{(index + 1)}}</span></p>
                            </div>
                            <div style="padding:0px;" class="col-lg-10">
                                <p style="padding:0px;"><span style="color:#2a88bd;">с</span> {{worktime.startM.format('HH:mm')}} <span style="color:#2a88bd">до</span> {{worktime.endM.format('HH:mm')}} {{worktime.startM.format('DD MMMM')}}</p>
                            </div>
                            <div class="col-lg-1">
                                <button class="btn btn-danger btn-xs" v-on:click="deleteWorkTime(worktime)"><i class="fa fa-times"></i></button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="col-sm-12">
                        <div class="row">
                            <div style="padding:0px;" class="col-lg-1">
                                <p style="padding:0px;"><span style="color:#bf1f1f; font-weight:800;">{{(index + 1)}}</span></p>
                            </div>
                            <div style="padding:0px;" class="col-lg-10">
                                <p style="padding:0px;"><span style="color:#2a88bd;">c</span> {{worktime.startM.format('HH:mm DD MMMM')}} <span style="color:#2a88bd;">до</span> {{worktime.endM.format('HH:mm DD MMMM')}}</p>
                            </div>
                            <div class="col-lg-1">
                                <button class="btn btn-danger btn-xs" v-on:click="deleteWorkTime(worktime)"><i class="fa fa-times"></i></button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>

</template>

<script>
    export default {
        mounted() {
            console.log('Component mounted.');
        },
        props: ['worktimes'],
        methods: {
            deleteWorkTime: function(worktime){
                console.log(worktime);
                if(confirm('Вы действительно хотите удалить запись № ' + worktime.id + ' ' +
                    'время с ' + worktime.startM.format("HH:mm DD MMMM") + ' до ' + worktime.endM.format("HH:mm DD MMMM") )){
                    axios({
                        method:'get',
                        url: '/ajax/delete_worktime/' + worktime.id
                    })
                        .then(response => {
                            if(response.data.success){
                                this.$parent.deleteWorkTime(worktime.id);
                            }
                        }).catch(error => {
                        console.log('Ошибка удаления записи: ' + error);
                    });
                }else{
                    return false;
                }
            }
        }
    }
</script>


