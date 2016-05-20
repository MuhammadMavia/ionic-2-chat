import {Page,NavController} from 'ionic-angular';
import {SignUp} from '../signup/signup';
import {Menu} from '../menu/menu';
import {MyService} from '../../services/service';

@Page({
    templateUrl: 'build/pages/login/login.html'
})
export class Login {
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
                this.myService.getFirebaseRef().child('users').child(authData.uid).once("value", (user)=> {
                    localStorage.setItem('userProfile', JSON.stringify(user.val()));
                });
                this.nav.push(Menu);
                console.log("Authenticated successfully with payload:", authData);
            }
        });
    }

    goToSignUpPage() {
        this.nav.push(SignUp)
    }
}