import {Page,NavController} from 'ionic-angular';
import {SignUp} from '../signup/signup';
import {MyService} from '../../services/service';

@Page({
    templateUrl: 'build/pages/todo/todo.html'
})
export class Todo {
    ref:any;
    userData:any;

    constructor(public nav:NavController, public myService:MyService) {
        this.ref = myService.getFirebaseRef();
        this.userData = JSON.parse(localStorage.getItem('firebase:session::menu-material-todo'));
        console.log(this.userData);
    }
}