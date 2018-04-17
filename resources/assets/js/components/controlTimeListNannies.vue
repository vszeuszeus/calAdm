<template>
    <div style="border:1px solid #2b3f51; padding:10px;" class="row">
        <p>Список почасовых нянь:</p>
        <div v-for="(nanny, index) in nannies" class="col-lg-1">
            <div v-on:click="chooseNanny(nanny)" class="thumbnail nanny_base">
                <img :src="nanny.User.photo" alt="">
                <p class="nannyCapt">{{nanny.User.name}}</p>
                <p style="padding:0 0 0 5px;" class="nannyCapt">{{nanny.id}}</p>
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
        data: function(){
            return {

            }
        },
        methods:{
            chooseNanny : function(nanny, start = false, end = false){
                this.$parent.chooseNanny(nanny);
            }
        }
    }
</script>
<style>
    .nannyCapt{
        font-size:11px;
        padding: 5px 0 5px 3px;
    }
    .nanny_base:hover{
        border-color:#2b3f51;
        cursor:pointer;

    }
</style>


