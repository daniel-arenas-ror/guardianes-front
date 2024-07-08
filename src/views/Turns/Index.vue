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
  <pulse-loader :loading="loading" :color="color" :size="size"></pulse-loader>

  <table>
    <tr v-for="turn in turns" :key="turn.id">
      <th>{{turn.key}}</th>
      <th>{{turn.worker_id}}</th>
    </tr>
  </table>
</template>

<script>
import dealRepository from './../../repositories/deal'
import turnRepository from './../../repositories/turn'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: "Turn",
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
    current_week: null,
    current_service: null,
  }),
  async mounted(){
    await this.initialize();
  },
  watch: {
    current_week(nV, oV){
      console.log("current_week")
      this.getTurn()
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
    }
  }
};
</script>
