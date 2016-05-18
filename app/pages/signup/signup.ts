import {Page,NavController} from 'ionic-angular';
import {Login} from '../login/login';
import {Todo} from '../todo/todo';
import {MyService} from '../../services/service';
@Page({
    templateUrl: 'build/pages/signup/signup.html'
})
export class SignUp {
    ref:any;

    constructor(public nav:NavController, public myService:MyService) {
        this.ref = myService.getFirebaseRef();
    }

    goToLoginPage() {
        this.nav.push(Login)
    }

    createAccount(firstName, lastName, email, password) {
        console.log(firstName._value, lastName._value, email._value, password._value);
        this.ref.createUser({
            email: email._value,
            password: password._value
        }, (error, userData)=> {
            if (error) {
                console.log("Error creating user:", error);
            } else {
                var obj = {
                    firstName: firstName._value,
                    lastName: lastName._value,
                    userName: email._value,
                    data: 'http://www.wrfoodsystem.ca/files/images/blank_profile.png',
                };
                this.ref.child(userData.uid).child('profile').set(obj, ()=> {
                    this.nav.push(Todo);
                });
                console.log("Successfully created user account with uid:", userData.uid);
            }
        });
    }
}