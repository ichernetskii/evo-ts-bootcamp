import {makeAutoObservable, observable} from "mobx";

class AppStore {
    isPopupVisible = false;

    constructor() {
        makeAutoObservable(this, {
            isPopupVisible: observable
        });
    }
}

export default new AppStore();
