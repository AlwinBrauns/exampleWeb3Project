import { Injectable } from '@angular/core';
import Web3 from 'web3';
import SayHelloTo from '../../artifacts/contracts/SayHelloTo.sol/SayHelloTo.json'
import Addresses from '../../adresses.json'
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Web3conService {
  web3!: Web3
  error$: Subject<Error> = new Subject<Error>()
  contract?: any
  accounts?: string[]
  Contract
  currentAbi?: any
  currentAddress?: any

  constructor() { 
    this.initWeb3()
    this.Contract = this.web3.eth.Contract
  }

  initWeb3() {
    //@ts-ignore
    this.web3 = new Web3(window.ethereum)
    this.web3.eth.requestAccounts((error, accs) => {
      if(error) {
        this.error$.next(error)
        return
      }
      this.accounts = accs
    })
  } 

  setContract(abi: any, address: string) {
    if(abi != this.currentAbi && address != this.currentAddress) {
      this.contract = new this.Contract(abi, address)
      this.currentAbi = abi
      this.currentAddress = address
    }
  }

  async callSayHello() {
    this.setContract(SayHelloTo.abi, Addresses.sayHelloTo)
    return this.contract.methods.sayHello().call()
  }

  async sendChangeTo(to: string, clbk: Function) {
    if(!this.accounts?.length) return
    this.setContract(SayHelloTo.abi, Addresses.sayHelloTo)
    this.contract.methods.changeTo(to).send({
      from: this.accounts[0]
    }).on('receipt', clbk)
  }

  subscribeToChangeToEvent(dataClbk: (data:any) => any) {
    this.setContract(SayHelloTo.abi, Addresses.sayHelloTo)
    this.contract.events.ToChange({
      //fromBlock: 0
    }, (error: Error, data: any) => {
      dataClbk(data)
    })
  }

  getError(): Observable<Error | undefined> {
    return this.error$.asObservable()
  }
}
