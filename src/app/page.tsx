'use client';
import { BodyContainer } from "@/components/BodyContainer";
import { CardContainer } from "@/components/CardContainer";
import { FormModal } from "@/components/FormModal";
import { Header } from "@/components/Header";
import { Table } from "@/components/Table";
import { useTransaction } from "@/hooks/transaction/useTransaction";
import { ITransaction, TotalCard } from "@/types/transaction";
import { useMemo, useState } from "react";

export default function Home() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);

  const { data: transactionsData, isLoading } = useTransaction.FindAll();  
  const { mutateAsync: createTransaction } = useTransaction.Create();
  const { mutateAsync: deleteTransaction } = useTransaction.Delete();
  const { mutateAsync: updateTransaction } = useTransaction.Update();

  // 🔥 DELETE
  const handleDelete = (id: string) => {
    const confirm = window.confirm("Deseja excluir essa transação?");
    if (confirm) {
      deleteTransaction(id);
    }
  };

  // 🔥 EDIT
  const handleEdit = (transaction: ITransaction) => {
    setSelectedTransaction(transaction);
    setIsFormModalOpen(true);
  };

  // 🔥 CREATE + UPDATE (INTELIGENTE)
  const handleSubmitTransaction = async (transaction: ITransaction) => {
    if (selectedTransaction) {
      await updateTransaction(transaction);
    } else {
      await createTransaction(transaction);
    }

    setSelectedTransaction(null);
  };

  // 🔥 TOTAL
  const calculaTotal = useMemo(() => {
    const transactions = transactionsData ?? [];
    const totals = transactions.reduce<TotalCard>((acc, transaction) => {
      if (transaction.type === "INCOME") {
        acc.income += transaction.price;
        acc.total += transaction.price;
      } else {
        acc.outcome += transaction.price;
        acc.total -= transaction.price;
      }
      return acc;
    }, { total: 0, income: 0, outcome: 0 });

    return totals;
  }, [transactionsData]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }
  
  return (
    <div className="h-full min-h-screen">
      <Header handleOpenFormModal={() => setIsFormModalOpen(true)} />

      <BodyContainer>
        <CardContainer totalValues={calculaTotal} />

        <Table 
          data={transactionsData ?? []} 
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </BodyContainer>

      {isFormModalOpen && (
        <FormModal 
          closeModal={() => {
            setIsFormModalOpen(false);
            setSelectedTransaction(null);
          }} 
          title={selectedTransaction ? "Editar Transação" : "Criar Transação"} 
          addTransaction={handleSubmitTransaction}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
}