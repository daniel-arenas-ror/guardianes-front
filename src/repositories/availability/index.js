import connector from './../../core/connector'

export class AvailabilityRepository {
  constructor(http){
    this.httpClient = http
  }

  getAvailability(week, serviceId) {
    return this.httpClient.get(`/api/v1/turn_availability?week=${week}&service_id=${serviceId}`)
  }

  newAvailability(turnId, workerId) {
    let data = {
      turn_availability: {
        turn_id: turnId,
        worker_id: workerId
      }
    }

    return this.httpClient.post("/api/v1/turn_availability", data)
  }

  destroyAvailability(availabilityId) {
    return this.httpClient.delete(`/api/v1/turn_availability/${availabilityId}`)
  }
}

export default new AvailabilityRepository(connector)
