<template class="flex flex-col">

  <div class="flex flex-row justify-between">
    <h1>Contrato {{this.deal?.serial}}</h1>
    <a href="#/availability">editar disponibilidad</a>
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

  <TurnReportTable :turnsReport="turnsReport" :workers="workers" />
  <TurnTable :turns="turns" :workers="workers" />
</template>

<script>
import dealRepository from './../../repositories/deal'
import turnRepository from './../../repositories/turn'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import TurnTable from '../../components/TurnTable.vue'
import TurnReportTable from '../../components/TurnReportTable.vue'

export default {
  name: "Turn",
  components: {
    PulseLoader,
    TurnTable,
    TurnReportTable
  },
  data: () => ({
    dealId: 1, // allways get the deal with id 1
    deal: null,
    services: [],
    workers: [],
    weeks: [],
    turns: [],
    turnsReport: [],
    current_week: null,
    current_service: null,
  }),
  async mounted(){
    await this.initialize();
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
      this.turnsReport = await turnRepository.getReport(this.current_week, this.current_service)
    }
  }
};
</script>
