import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {MyService} from './services/service';
import {Login} from './pages/login/login';
import {Menu} from './pages/menu/menu';
import {Chat} from './pages/chat/chat';
import {SignUp} from './pages/signup/signup';


@App({
    templateUrl: 'build/app.html',
    providers: [MyService],
    config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
    //rootPage:any = Login;
    rootPage:any = Menu;
    //rootPage:any = Chat;

    constructor(platform:Platform) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
        });
    }
}
