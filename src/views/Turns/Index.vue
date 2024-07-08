<template>
  <h1>Turn</h1>
</template>

<script>
import dealRepository from './../../repositories/deal'

export default {
  name: "Turn",
  data: () => ({
    dealId: 1, // allways get the deal with id 1
    deal: null
  }),
  async mounted(){
    await this.initialize();
  },
  methods: {
    async initialize() {
      await this.getDeal(this.dealId)
    },
    async getDeal(dealId) {
      let deal_response = await dealRepository.getDeal(dealId)

      console.log(" deal_response ")
      console.log( deal_response )
    }
  }
};
</script>
