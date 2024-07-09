import connector from './../../core/connector'

export class TurnRepository {
  constructor(http){
    this.httpClient = http
  }

  getTurn(week, serviceId) {
    return this.httpClient.get(`/api/v1/turn?week=${week}&service_id=${serviceId}`)
  }

  getReport(week, serviceId) {
    return this.httpClient.get(`/api/v1/turn_report?week=${week}&service_id=${serviceId}`)
  }
}

export default new TurnRepository(connector)
