<template class="flex flex-col">
  <table class="table-auto">
    <caption class="caption-top">
      Asignación de turno
    </caption>
    <tr v-for="turn in turns" :key="turn.id" >
      <td class="border p-4" :style="{ backgroundColor: bgColorHour(turn) }">{{turn.key}}</td>
      <td class="border p-4" :style="{ backgroundColor: bgColorWorker(turn.worker_id) }" >{{ dataWorker(turn.worker_id) }}</td>
    </tr>
  </table>
</template>

<script>
  export default {
    name: "TurnTable",
    props: {
      turns: Array,
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