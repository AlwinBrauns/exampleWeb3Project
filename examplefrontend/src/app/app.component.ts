import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl} from '@angular/forms';
import { Subscription } from 'rxjs';
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
  web3ErrorSubscription!: Subscription
 
  changeTo: FormGroup = new FormGroup({
    to: new FormControl('')
  })
  constructor(private web3conService: Web3conService) { 
    this.changeTo.controls['to'].setValidators([
      Validators.required
    ])
  }
  connectWithWeb3Wallet() {
    this.error = undefined
    this.web3conService.initWeb3()
  }
  async ngOnInit(): Promise<void> {
    this.web3ErrorSubscription = this.web3conService.getError().subscribe(
      error => {
        this.error = error
      }
    )
    await this.web3conService.initWeb3()
    this.getSayHello()
    this.web3conService.subscribeToChangeToEvent((data) => {
      console.log(data)
      this.title = "Hello " + data.returnValues.to
    })
  }
  ngOnDestroy(): void {
    this.web3ErrorSubscription.unsubscribe()
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
        () => {
          this.getSayHello()
          this.changeTo.reset() 
        }
      )
    }else {
      console.warn("Invalid Input")
    }
  }

}
