import {Injectable} from 'angular2/core';
@Injectable()
export class MyService {
    name:any = 'Hello World';

    constructor() {

    }
    getFirebaseRef() {
        return new Firebase('https://menu-material-todo.firebaseio.com/')
    }
}