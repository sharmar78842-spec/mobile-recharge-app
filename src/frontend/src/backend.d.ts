import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Recharge {
    id: bigint;
    validity: string;
    status: string;
    date: bigint;
    operator: string;
    phoneNumber: string;
    amount: bigint;
    planName: string;
}
export interface backendInterface {
    getAllRecharges(): Promise<Array<Recharge>>;
    getRecharge(rechargeId: bigint): Promise<Recharge>;
    getRechargeHistory(phoneNumber: string): Promise<Array<Recharge>>;
    submitRecharge(phoneNumber: string, operator: string, planName: string, amount: bigint, validity: string): Promise<bigint>;
}
