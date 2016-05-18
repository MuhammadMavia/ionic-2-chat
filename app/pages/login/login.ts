import {Page,NavController} from 'ionic-angular';
import {SignUp} from '../signup/signup';
import {Todo} from '../todo/todo';
import {MyService} from '../../services/service';

@Page({
    templateUrl: 'build/pages/login/login.html'
})
export class Login {
    name:any = "Saylani";
    ref:any;

    constructor(public nav:NavController, public myService:MyService) {
        this.ref = myService.getFirebaseRef();
    }

    doLogin(email, password) {
        this.ref.authWithPassword({
            email: email._value,
            password: password._value
        }, (error, authData)=> {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                this.nav.push(Todo);
                console.log("Authenticated successfully with payload:", authData);
            }
        });
    }

    goToSignUpPage() {
        this.nav.push(SignUp)
    }
}