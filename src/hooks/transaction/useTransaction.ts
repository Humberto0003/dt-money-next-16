import { createTransaction, deleteTransaction, updateTransaction, getTransactions } from "@/services/transaction";
import { ITransaction } from "@/types/transaction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const QUERY_KEY = "transactions";

const Create = () =>  {
   const queryClient = useQueryClient(); 

   return useMutation({
      mutationFn: (transaction: ITransaction) => createTransaction(transaction),
      onSuccess: () => {
        toast.success("Transação criada com sucesso!");
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      }
   })
}

const Delete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTransaction(id),
        onSuccess: () => {
            toast.success("Transação excluída com sucesso!");
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY]})
        }
    })
}

const Update = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transaction: ITransaction) => updateTransaction(transaction),
    onSuccess: () => {
      toast.success("Transação atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    }
  });
};

const FindAll = () => {
    return useQuery({
        queryKey: [QUERY_KEY],
        queryFn: getTransactions
    })
}

export const useTransaction = {
    Create,
    Delete,
    Update,
    FindAll
}

