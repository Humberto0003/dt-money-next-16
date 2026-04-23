import { object, number, string, InferType } from "yup";

export const transactionSchema = object({
  title: string()
    .required("O título é obrigatório")
    .min(5, "O título deve conter no mínimo 5 caracteres"),

  price: number()
    .transform((value, originalValue) => {
      if (
        originalValue === "" ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return undefined;
      }
      return Number(originalValue);
    })
    .required("O preço é obrigatório")
    .positive("O preço deve ser um número positivo")
    .min(0.01, "O preço deve ser maior que zero"),

  type: string()
    .required("O tipo é obrigatório")
    .oneOf(["INCOME", "OUTCOME"], "O tipo deve ser válido"),

  category: string()
    .required("A categoria é obrigatória")
    .min(3, "A categoria deve conter no mínimo 3 caracteres"),
});

export type TransactionFormData = InferType<typeof transactionSchema>;

export const defaultValues: TransactionFormData = {
  title: "",
  price: 0,
  type: "INCOME",
  category: "",
};