<template>
  <h1>Contrato {{this.deal?.serial}}</h1>
  <select name="select">
    <option v-for="service in services" :key="service.id" :value="service.id">{{service.name}}</option>
  </select>
  <br />
  <select name="select" v-model="current_service">
    <option v-for="worker in workers" :key="worker.id" :value="worker.id">{{worker.name}}</option>
  </select>
  <br />
  <select name="select" v-model="current_week">
    <option v-for="week in weeks" :key="week" :value="week">{{week}}</option>
  </select>
  <br />

  <table class="table-auto">
    <tr>
      <th>key</th>
      <td
        v-for="worker in workers"
        :key="worker.id"
      >
        {{worker.name}}
      </td>
    </tr>
    <tr v-for="turn in turns" :key="turn.id" >
      <td :style="{ backgroundColor: bgColorHour(turn) }">{{turn.key}}</td>
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
</template>

<script>
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
        } else {
          let availability = this.availabilities.find(availability => availability.turn_id == turnId && availability.worker_id == workerId);
          let availabilityId = availability?.id;

          if (availabilityId) {
            availabilityRepository.destroyAvailability(availabilityId)
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

  }
};
</script>
