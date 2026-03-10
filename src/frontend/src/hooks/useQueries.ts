import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BrokerageRecord } from "../backend.d";
import { useActor } from "./useActor";

export type { BrokerageRecord };

export function useGetAllRecords() {
  const { actor, isFetching } = useActor();
  return useQuery<BrokerageRecord[]>({
    queryKey: ["records"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRecordCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["recordCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getRecordCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNextSerial() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["nextSerial"],
    queryFn: async () => {
      if (!actor) return BigInt(1);
      return actor.getNextSerialNumber();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddRecord() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      finance: string;
      customerName: string;
      mcf: string;
      product: string;
      grossAmount: number | null;
      netAmount: number | null;
      loanAmount: number | null;
      brokerageReceivedDate: string | null;
      bankReceivedDate: string | null;
      remark: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addRecord(
        data.finance,
        data.customerName,
        data.mcf,
        data.product,
        data.grossAmount,
        data.netAmount,
        data.loanAmount,
        data.brokerageReceivedDate,
        data.bankReceivedDate,
        data.remark,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["records"] });
      qc.invalidateQueries({ queryKey: ["recordCount"] });
      qc.invalidateQueries({ queryKey: ["nextSerial"] });
    },
  });
}

export function useUpdateRecord() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      finance: string;
      customerName: string;
      mcf: string;
      product: string;
      grossAmount: number | null;
      netAmount: number | null;
      loanAmount: number | null;
      brokerageReceivedDate: string | null;
      bankReceivedDate: string | null;
      remark: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateRecord(
        data.id,
        data.finance,
        data.customerName,
        data.mcf,
        data.product,
        data.grossAmount,
        data.netAmount,
        data.loanAmount,
        data.brokerageReceivedDate,
        data.bankReceivedDate,
        data.remark,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["records"] });
    },
  });
}

export function useDeleteRecord() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteRecord(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["records"] });
      qc.invalidateQueries({ queryKey: ["recordCount"] });
      qc.invalidateQueries({ queryKey: ["nextSerial"] });
    },
  });
}
