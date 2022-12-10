import { Component } from '@angular/core';
import Web3 from 'web3';
import { JsonRpcRequest, Web3BaseProvider } from 'web3-types';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  web3: Web3 = new Web3();
  title = this.web3.eth.currentProvider
  jsonRPC: JsonRpcRequest = {
    id: undefined,
    jsonrpc: '2.0',
    method: ''
  }
}
