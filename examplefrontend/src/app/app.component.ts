import { Component } from '@angular/core';
import Web3 from 'web3';
import SayHelloTo from '../artifacts/contracts/SayHelloTo.sol/SayHelloTo.json'
import Addresses from '../adresses.json'
import { Validators, FormGroup, FormControl} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  web3?: Web3
  title?: string 
  contract?: any
  error?: Error
  from?: string
  changeTo: FormGroup = new FormGroup({
    to: new FormControl('')
  })
  constructor() { 
    this.changeTo.controls['to'].setValidators([
      Validators.required
    ])
    this.initWeb3()
  }
  onChangeTo() {
    if(this.changeTo.controls['to'].valid && this.changeTo.controls['to'].value.length === 1) {
      this.changeTo.controls['to'].setValue(this.changeTo.controls['to'].value.toUpperCase())
    }
  }
  async callSayHello() {
    const Contract = this.web3!.eth.Contract
    //@ts-ignore
    this.contract = new Contract(SayHelloTo.abi, Addresses.sayHelloTo)
    this.contract.methods.sayHello().call().then((message:string)=> {
      this.title = message
    })
  }
  async sendChangeTo() {
    if(this.changeTo.controls['to'].valid) {
      const Contract = this.web3!.eth.Contract
      //@ts-ignore
      this.contract = new Contract(SayHelloTo.abi, Addresses.sayHelloTo)
      this.contract.methods.changeTo(this.changeTo.controls['to'].value).send({
        from: this.from
      }).on('receipt', () => {
        this.callSayHello()
      })
    } else {
      console.warn("Invalid Input")
    }
  }
  async initWeb3() {
      //@ts-ignoreany
      this.web3 = new Web3(window.ethereum)
      this.web3.eth.requestAccounts().then(accs => {
        this.error = undefined
        this.title = accs[0]
        this.from = accs[0]
        this.callSayHello()
      }).catch(error => {
        this.error = error
      })
      
  }
  
}
