import ViolatorHandler from "./ViolatorHandler.js";

export default class WebHandler {
    violatorHandler = ViolatorHandler;

    setViolatorInstance(instance) {
        this.violatorHandler = instance;
    }
}