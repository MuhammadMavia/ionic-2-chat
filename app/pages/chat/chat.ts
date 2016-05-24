import {Page,NavController,NavParams} from 'ionic-angular';
//import {Login} from '../login/login';
//import {Menu} from '../menu/menu';
import {MyService} from '../../services/service';
@Page({
    templateUrl: 'build/pages/chat/chat.html'
})
export class Chat {
    msg:any;
    friend:any;
    messages:any;
    currentUserProfile:any;

    constructor(public nav:NavController, public params:NavParams, public myService:MyService) {
        this.friend = params.data.profile;
        this.currentUserProfile = myService.getCurrentUserProfile();
        this.messages = myService.getChat(params.data.conversationID);
        //console.log(params.data);
        //this.ref = myService.getFirebaseRef();
    }

    sendMsg(msg) {
        this.myService.sendMsg(msg, this.params.data);
        this.msg = '';
    }
}