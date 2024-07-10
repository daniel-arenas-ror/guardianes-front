<template>
  <div v-if="isLoading">
    <div class="h-screen flex items-center justify-center">
      <grid-loader :loading="loading" :color="color" :size="size"></grid-loader>
    </div>
  </div>
  <div class="flex flex-col" v-else>
    <div class="flex flex-row justify-between">
      <h1>Contrato {{this.deal?.serial}}</h1>
      <a class="border p-3 bg-amber-300" href="#/">Ver turnos</a>
    </div>

    <div class="flex flex-row p-1">
      <p>Servicio</p>
      <select class="border p-1 mx-1" name="select" v-model="current_service">
        <option v-for="service in services" :key="service.id" :value="service.id">{{service.name}}</option>
      </select>
    </div>

    <div class="flex flex-row p-1">
      <p>Semana</p>
      <select class="border p-1 mx-1" name="select" v-model="current_week">
        <option v-for="week in weeks" :key="week" :value="week">{{week}}</option>
      </select>
    </div>

    <div class="grid grid-cols-4 gap-4">
      <table class="table-fixed m-5" v-for="group, key in turnGrouped" :key="key">
        <caption class="caption-top bg-amber-300">
          {{key}}
        </caption>
        <tr>
          <th>Worker</th>
          <th
            v-for="worker in workers"
            :key="worker.id"
            :style="{ backgroundColor: worker.color }"
          >
            {{worker.name}}
          </th>
        </tr>
        <tr v-for="turn in group" :key="turn.id">
          <td class="border p-1" :style="{ backgroundColor: bgColorHour(turn) }" > {{turn.hour}} - {{turn.hour + 1}} </td>
          <td v-for="worker in workers" :key="worker.id" >
            <input
              type="checkbox"
              :id="`${turn.id}_${worker?.id}`"
              :value="`${turn.id}_${worker?.id}`"
              v-model="availabilitiesChecked"
              @change="check($event)"
            />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import dealRepository from './../../repositories/deal'
import turnRepository from './../../repositories/turn'
import availabilityRepository from './../../repositories/availability'
import GridLoader from 'vue-spinner/src/GridLoader.vue'

export default {
  name: "Availability",
  components: {
    GridLoader
  },
  data: () => ({
    isLoading: true,
    dealId: 1, // allways get the deal with id 1
    deal: null,
    services: [],
    workers: [],
    weeks: [],
    turns: [],
    availabilities: [],
    availabilitiesChecked: [], 
    current_week: null,
    current_service: null,
  }),
  async mounted(){
    await this.initialize();
    this.getQueryParams()
  },
  watch: {
    current_week(_nV, _oV){
      this.getTurn()
    }
  },
  methods: {
    async initialize() {
      await this.getDeal(this.dealId)
    },
    async getDeal(dealId) {
      await dealRepository.getDeal(dealId).then(response => {

        this.deal     = response.data.attributes;
        this.services = response.data.attributes?.services;
        this.workers  = response.data.attributes?.workers;
        this.weeks    = response.data.attributes?.weeks;

        this.current_week    = this.current_week ?? this.weeks[0];
        this.current_service = this.services[0].id
      })
    },
    async getTurn(){
      this.isLoading = true

      await turnRepository.getTurn(this.current_week, this.current_service)
                    .then(response => {
                      this.turns = response 
                      this.getAvailability()
                    })
    },
    async getAvailability(){
      await availabilityRepository.getAvailability(this.current_week, this.current_service)
                    .then(response => {
                      this.availabilities = response
                      this.MarkAvailability()
                      this.isLoading = false
                    })
    },
    MarkAvailability(){
      this.availabilities.forEach((availability) => this.availabilitiesChecked.push(`${availability.turn_id}_${availability.worker_id}`))
    },
    check (e) {
      this.isLoading = true

      this.$nextTick(() => {
        let [turnId, workerId] = e.target.id.split("_");

        if(e.target.checked){
          availabilityRepository.newAvailability(turnId, workerId)
            .then(response => {
              this.getTurn()
            })
        } else {
          let availability = this.availabilities.find(availability => availability.turn_id == turnId && availability.worker_id == workerId);
          let availabilityId = availability?.id;

          if (availabilityId) {
            availabilityRepository.destroyAvailability(availabilityId)
              .then(response => {
                this.getTurn()
              })
          } else {
            console.warn('Availability not found for turnId:', turnId, 'and workerId:', workerId);
          }
        }
      })
    },
    bgColorHour(turn){
      if(turn.worker_id === null){
        return "red"
      }

      return "green"
    },
    bgColorWorker(turn) {
      if(turn.worker_id === null){
        return
      }

      return this.workers.find(worker => worker.id === turn.worker_id).color
    },
    dataWorker(turn) {
      if(turn.worker_id === null){
        return "⚠️"
      }

      return this.workers.find(worker => worker.id === turn.worker_id).name
    },
    getQueryParams(){
      let queryParams = this.$route.query;
      this.current_week = parseInt(queryParams.week_id)
    }
  },
  computed: {
    turnGrouped(){
      return _.groupBy(this.turns, turn => turn.turn_date);
    }
  }
};
</script>
