<div id="vue-main-nanny-hours">
    <div class="container">
        <control-time-list-nannies :nannies="nannies"></control-time-list-nannies>
        <div class="row">
            <p style="margin:15px 0 0 15px" v-if="choosedNanny">Выбранная няня: <b>{{choosedNanny.User.name}}</b>, ID:
                <b>{{choosedNanny.id}}</b></p>
            <div class="col-lg-6">
                <div id="datepickerCalen"></div>
            </div>
            <div class="col-lg-6">
                <div v-if="choosedNanny" class="panel panel-info">
                    <template v-if="pickedDateSplit[0]">
                        <div v-if="pickedDateSplit[1]" class="panel-heading">Помечено: с {{pickedDateSplit[0]}} по
                            {{pickedDateSplit[1]}}
                        </div>
                        <div v-else class="panel-heading">Помечено: {{pickedDateSplit[0]}}</div>
                    </template>
                    <template v-else>
                        <div class="panel-heading">Дата не помечена</div>
                    </template>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <p style="padding:10px; margin-top:5px;" v-if="resultCaption"
                                           class="bg-success">{{resultCaption}}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12">
                                        <p style="margin-bottom:0px; padding: 0 0 0 3px;">Быстрая панель:</p>
                                        <button :disabled="(!pickedDateSplit[0])" v-on:click="addWorkTime"
                                                class="btn btn-primary"><i class="fa fa-plus"></i> Внести рабочие часы
                                        </button>
                                    </div>
                                </div>
                                <div class="row" v-if="addWorkTimeData.view">
                                    <div class="col-lg-12">
                                        <div class="row">
                                            <div class="col-lg-12" style="padding-right:0;">
                                                <div class="row">
                                                    <div class="col-lg-6">
                                                        <input v-validate="'required|date_format:HH:mm'"
                                                               data-vv-as="Время начала"
                                                               v-model="addWorkTimeData.start"
                                                               style="margin-top:5px;"
                                                               class="form-control" type="text" id="startWorkTime"
                                                               name="startWorkTime"
                                                               placeholder="Время начала"/>
                                                        <span style="color:red;" v-show="errors.has('startWorkTime')"
                                                              class="help is-danger">{{ errors.first('startWorkTime') }}</span>
                                                    </div>
                                                    <div class="col-lg-6">
                                                        <input v-validate="'required|date_format:HH:mm|' +
                                                            ((!addWorkTimeData.once || !pickedDateSplit[1]) ? 'date_between:' + $moment(pickedDateSplit[0] + ' ' + addWorkTimeData.start).add(1, 'hours').format('hh:mm') + ',' +
                                                            $moment(((pickedDateSplit[1]) ? pickedDateSplit[1] : pickedDateSplit[0])).set('hour', 23).set('minute', 59).format('HH:mm') : '')"
                                                               v-model="addWorkTimeData.end" style="margin-top:5px;"
                                                               data-vv-as="Время окончания"
                                                               class="form-control" type="text" id="endWorkTime"
                                                               name="endWorkTime"
                                                               placeholder="Время окончания"/>
                                                        <span style="color:red;" v-show="errors.has('endWorkTime')"
                                                              class="help is-danger">{{ errors.first('endWorkTime') }}</span>
                                                    </div>
                                                </div>
                                                <div style="margin-top:10px;" class="row">
                                                    <div class="col-lg-6">
                                                        <div class="checkbox">
                                                            <label>
                                                                <input style="display:inline-block;" v-model="addWorkTimeData.once"
                                                                       style="margin-top:5px;"
                                                                       type="checkbox"
                                                                       id="onceWorkTime"
                                                                /> Одной записью
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-6">
                                                        <button v-on:click="saveWorkTime"
                                                                class="btn btn-primary"><i
                                                                    class="fa fa-check"></i> Добавить
                                                        </button>
                                                        <button v-on:click="cancelAddWorkTime"
                                                                class="btn btn-default"><i
                                                                    class="fa fa-ban"></i> Отмена
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <p style="padding:10px; margin-top:5px;"
                                                   v-if="addWorkTimeData.errorCaption" class="bg-danger">
                                                    {{addWorkTimeData.errorCaption}}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row" style="margin-top:10px;">
                            <div class="col-lg-12">
                                <p style="margin-bottom:0px; padding: 0 0 0 3px;">Доступные рабочие часы для заказа за
                                    помеченные даты:</p>
                                <worktimes-list :worktimes="preparedWorkTimes"></worktimes-list>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php echo "<script> var nannies = " . json_encode($nannies) . "</script>"; ?>
