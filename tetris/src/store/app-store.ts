import {action, makeAutoObservable, observable} from "mobx";

class AppStore {
    isPopupVisible = false;

    constructor() {
        makeAutoObservable(this, {
            isPopupVisible: observable,
            popupVisibleToggle: action.bound
        });
    }

    popupVisibleToggle() {
        this.isPopupVisible = !this.isPopupVisible;
    }
}

export default new AppStore();
