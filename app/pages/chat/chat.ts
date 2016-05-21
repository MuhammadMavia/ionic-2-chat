import {Page,NavController,NavParams} from 'ionic-angular';
//import {Login} from '../login/login';
//import {Menu} from '../menu/menu';
import {MyService} from '../../services/service';
@Page({
    templateUrl: 'build/pages/chat/chat.html'
})
export class Chat {
    //ref:any;
    friend:any;

    constructor(public nav:NavController, public params:NavParams,public myService:MyService) {
        this.friend = params.data.profile;
        console.log(params.data);
        //this.ref = myService.getFirebaseRef();
    }
    sendMsg(){
        this.myService.sendMsg();
    }
}