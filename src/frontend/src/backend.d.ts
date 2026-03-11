import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BrokerageRecord {
    id: bigint;
    mcf: string;
    remark: string;
    customerName: string;
    netAmount?: number;
    finance: string;
    loanAmount?: number;
    createdAt: bigint;
    grossAmount?: number;
    brokerageReceivedDate?: string;
    serialNumber: bigint;
    bankReceivedDate?: string;
    product: string;
}
export interface backendInterface {
    addRecord(finance: string, customerName: string, mcf: string, product: string, grossAmount: number | null, netAmount: number | null, loanAmount: number | null, brokerageReceivedDate: string | null, bankReceivedDate: string | null, remark: string): Promise<bigint>;
    deleteRecord(id: bigint): Promise<boolean>;
    getAllRecords(): Promise<Array<BrokerageRecord>>;
    getNextSerialNumber(): Promise<bigint>;
    getRecordCount(): Promise<bigint>;
    updateRecord(id: bigint, finance: string, customerName: string, mcf: string, product: string, grossAmount: number | null, netAmount: number | null, loanAmount: number | null, brokerageReceivedDate: string | null, bankReceivedDate: string | null, remark: string): Promise<boolean>;
}
