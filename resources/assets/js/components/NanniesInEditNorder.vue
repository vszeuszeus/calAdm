<template>
    <div>
        <div v-for="(row, index) in toRenNannies" class="row">
            <div v-for="renNanny in row" class="col-lg-4" style="">
                <div class="row">
                    <div class="col-lg-5">
                        <img style="height:60px;" class="img-circle" :src="'http://supernanny.kz/' + renNanny.User.photo"
                             :alt="renNanny.User.name">
                    </div >
                    <div class="col-lg-7">
                        <span style="font-size:12px;">{{renNanny.User.name}}</span>
                        <p>
                            <button class="btn btn-default btn-xs"
                                    v-on:click="deleteNanny(renNanny.id)"><i style="top:3px;"
                                    title="Удалить" class="fa fa-trash"></i> Удалить
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('Component mounted.')
        },
        props: ['nannies'],
        data: function () {
            return {
                total: 2,
                start: 0
            }
        },
        computed: {
            toRenNannies: function () {
                let vm = this;
                let baseArr = [];
                let groupArr = [];
                this.nannies.forEach(function (item, index) {
                    if (groupArr.length < 3) {
                        groupArr.push(item);
                        if((index + 1) === vm.nannies.length){
                            baseArr.push(groupArr.slice());
                        }
                    } else {
                        baseArr.push(groupArr.slice());
                        groupArr = [];
                        groupArr.push(item);
                        if((index + 1) === vm.nannies.length){
                            baseArr.push(groupArr.slice());
                        }
                    }
                });
                return baseArr;
            }
        },
        methods: {
            deleteNanny: function(nanny_id){
                this.$parent.deleteNanny(nanny_id);
            }
        }
    }
</script>


