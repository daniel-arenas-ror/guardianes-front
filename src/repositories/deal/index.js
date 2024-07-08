import connector from './../../core/connector'

export class DealRepository {
  constructor(http){
    this.httpClient = http
  }

  getDeal(dealId) {
    return this.httpClient.get(`/api/v1/deal/${dealId}`)
  }
}

export default new DealRepository(connector)
