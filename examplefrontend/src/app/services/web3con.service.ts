import { Injectable } from '@angular/core';
import Web3 from 'web3';
import SayHelloTo from '../../artifacts/contracts/SayHelloTo.sol/SayHelloTo.json'
import Addresses from '../../adresses.json'
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Web3conService {
  web3?: Web3 = new Web3()
  error$: BehaviorSubject<Error | undefined> = new BehaviorSubject<Error | undefined>(undefined)
  contract?: any
  accounts?: string[]
  Contract = this.web3!.eth.Contract

  constructor() { 
    this.initWeb3()
  }

  setContract(abi: any, address: string) {
    this.contract = new this.Contract(abi, address)
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
  
  async initWeb3() {
    if(!this.web3) return
    //@ts-ignore
    this.web3.setProvider(window.ethereum)
    this.web3.eth.requestAccounts().then(accs => {
      this.accounts = accs
      this.callSayHello()
    }).catch(error => {
      this.error$.next(error)
    })
  } 

  getError(): Observable<Error | undefined> {
    return this.error$.asObservable()
  }

  setErrorFixed() {
    this.error$.next(undefined)
  }
}
