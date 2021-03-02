import { IRow } from "../interfaces";

interface CarsData {
    fields: Array<{name: string; type: 'dimension' | 'measure'}>;
    dataSource: IRow[]
}
export async function getCarsData (): Promise<CarsData> {
    try {
        const res = await fetch('/cars.json');
        const result = await res.json() as CarsData;
        return result
    } catch (error) {
        console.error(error);
        return {
            fields: [],
            dataSource: []
        }
    }
}