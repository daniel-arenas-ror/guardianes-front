<template>
  <div class="flex flex-col">
    <div class="flex flex-row justify-between">
      <h1>Contrato {{this.deal?.serial}}</h1>
      <a class="border p-3 bg-amber-300" href="#/">Ver turnos</a>
    </div>

    <div class="flex flex-row">
      <p>Servicio</p>
      <select name="select" v-model="current_service">
        <option v-for="service in services" :key="service.id" :value="service.id">{{service.name}}</option>
      </select>
    </div>

    <div class="flex flex-row">
      <p>Semana</p>
      <select name="select" v-model="current_week">
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
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: "Availability",
  components: {
    PulseLoader
  },
  data: () => ({
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
  },
  watch: {
    current_week(_nV, _oV){
      this.getTurn()
      this.getAvailability()
    }
  },
  methods: {
    async initialize() {
      await this.getDeal(this.dealId)
    },
    async getDeal(dealId) {
      let dealResponse = await dealRepository.getDeal(dealId)

      this.deal = dealResponse.data.attributes;
      this.services = dealResponse.data.attributes?.services;
      this.workers  = dealResponse.data.attributes?.workers;
      this.weeks    = dealResponse.data.attributes?.weeks;

      this.current_week    = this.weeks[0]
      this.current_service = this.services[0].id
    },
    async getTurn(){
      this.turns = await turnRepository.getTurn(this.current_week, this.current_service)
    },
    async getAvailability(){
      this.availabilities = await availabilityRepository.getAvailability(this.current_week, this.current_service)
      this.MarkAvailability()
    },
    MarkAvailability(){
      this.availabilities.forEach((availability) => this.availabilitiesChecked.push(`${availability.turn_id}_${availability.worker_id}`))
    },
    check (e) {
      this.$nextTick(() => {
        let [turnId, workerId] = e.target.id.split("_");

        if(e.target.checked){
          availabilityRepository.newAvailability(turnId, workerId)
            .then(response => {
              this.getTurn()
              this.getAvailability()
            })
        } else {
          let availability = this.availabilities.find(availability => availability.turn_id == turnId && availability.worker_id == workerId);
          let availabilityId = availability?.id;

          if (availabilityId) {
            availabilityRepository.destroyAvailability(availabilityId)
              .then(response => {
                this.getTurn()
                this.getAvailability()
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
    }
  },
  computed: {
    turnGrouped(){
      return _.groupBy(this.turns, turn => turn.turn_date);
    }
  }
};
</script>
