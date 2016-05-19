import {Page,NavController} from 'ionic-angular';
import {SignUp} from '../signup/signup';
import {MyService} from '../../services/service';

@Page({
    templateUrl: 'build/pages/menu/menu.html'
})
export class Menu {
    ref:any;
    tab:any;
    userData:any;
    allUsers:any;
    requests:any;

    constructor(public nav:NavController, public myService:MyService) {
        this.tab = '0';
        this.ref = myService.getFirebaseRef();
        this.allUsers = myService.getAllUser();
        this.requests = myService.getRequestForMe();
        this.userData = myService.getCurrentUserData();
    }

    sendRequest(reqUser) {
        this.myService.sendRequest(reqUser);
    }

    resToReq(res, request) {
        this.myService.resToReq(res, request)
    }


}