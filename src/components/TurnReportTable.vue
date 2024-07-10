<template class="flex flex-col">
  <table class="table-auto border-collapse w-full text-sm" >
    <caption class="caption-top">
      Cantidad de turnos asignados por trabajador
    </caption>
    <tr v-for="value, index in turnsReport" :key="index" >
      <th  class="p-2" :style="{ backgroundColor: bgColorWorker(index) }" >{{ dataWorker(index) }}</th>
      <th>{{ value }}</th>
    </tr>  
  </table>
</template>

<script>
  export default {
    name: "TurnTable",
    props: {
      turnsReport: Array,
      workers: Array
    },
    methods: {
      bgColorWorker(workerId) {
        if(workerId === null || workerId === ""){
          return
        }

        return this.workers.find(worker => worker.id == workerId)?.color
      },
      dataWorker(workerId) {
        if(workerId === null){
          return "⚠️"
        }

        return this.workers.find(worker => worker.id == workerId)?.name
      },
      bgColorHour(turn){
        if(turn.worker_id === null){
          return "rgb(232 203 202)"
        }

        return "rgb(209 229 201)"
      }
    }
  };
</script>
