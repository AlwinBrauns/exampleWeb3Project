import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl} from '@angular/forms';
import { Web3conService } from './services/web3con.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title?: string 
  from?: string
  error?: Error
 
  changeTo: FormGroup = new FormGroup({
    to: new FormControl('')
  })
  constructor(private web3conService: Web3conService) { 
    this.changeTo.controls['to'].setValidators([
      Validators.required
    ])
    this.getSayHello()
  }
  connectWithWeb3Wallet() {
    this.error = undefined
    this.web3conService.initWeb3()
  }
  ngOnInit(): void {
    this.web3conService.getError().subscribe(
      error => {
        this.error = error
      }
    )
  }
  ngOnDestroy(): void {
  }
  getSayHello() {
    this.web3conService.callSayHello().then((msg: string) => {
      this.title = msg;
    }).catch(error => {
      this.error = error
    })
  }
  onChangeTo() {
    if(this.changeTo.controls['to'].valid && this.changeTo.controls['to'].value.length === 1) {
      this.changeTo.controls['to'].setValue(this.changeTo.controls['to'].value.toUpperCase())
    }
  }
  sendChangeTo() {
    if(this.changeTo.controls['to'].valid) {
      this.web3conService.sendChangeTo(
        this.changeTo.controls['to'].value,
        () => this.getSayHello()
      )
    }else {
      console.warn("Invalid Input")
    }
  }

}
