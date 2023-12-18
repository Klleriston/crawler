import { ObjectId } from "mongodb";

export default class City {
    constructor(public name: string, public temp: number, public id?: ObjectId) {}
}