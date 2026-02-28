import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { Recharge } from "../backend.d";

export function useGetRechargeHistory(phoneNumber: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Recharge[]>({
    queryKey: ["rechargeHistory", phoneNumber],
    queryFn: async () => {
      if (!actor || !phoneNumber) return [];
      return actor.getRechargeHistory(phoneNumber);
    },
    enabled: !!actor && !isFetching && phoneNumber.length === 10,
  });
}

export function useSubmitRecharge() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      phoneNumber,
      operator,
      planName,
      amount,
      validity,
    }: {
      phoneNumber: string;
      operator: string;
      planName: string;
      amount: bigint;
      validity: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitRecharge(phoneNumber, operator, planName, amount, validity);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rechargeHistory", variables.phoneNumber] });
    },
  });
}
