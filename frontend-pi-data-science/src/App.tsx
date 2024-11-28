import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

// Esquema de validação com Zod
const QueryPrevisionDataFormSchema = z.object({
  State: z.string().min(1, "Selecione um estado válido"),
  Region: z.string().min(1, "Selecione um estado válido"),
  Month: z.number().min(1, "Selecione um trimestre válido"),
  Year: z.string().min(1, "Selecione um ano válido"),
});

type QueryPrevisionData = z.infer<typeof QueryPrevisionDataFormSchema>;

function App() {
  const [result, setResult] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QueryPrevisionData>({
    resolver: zodResolver(QueryPrevisionDataFormSchema),
  });

  const onSubmit = async (data: QueryPrevisionData) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", data);
      setResult(`Previsão: ${response.data.prediction}.`);
    } catch (error) {
      console.error(error);
      setResult("Erro ao processar a solicitação.");
    }
  };

  return (
    <section className="h-screen w-full bg-gray-900 text-white flex justify-center items-center px-[10%]">
      <form
        className="h-2/3 border-2 rounded-l-md w-1/2 py-10 items-center flex flex-col space-y-12"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-semibold">Previsão de radiação solar</h1>
        <div className="flex flex-col space-y-6">
          <div className="flex  flex-col">
            <h2>Selecione a região Brasileiro:</h2>
            <select
              className="text-black rounded-md p-2"
              {...register("Region")}
            >
              <option value="">Selecione</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
            {errors.Region && (
              <p className="text-red-500">{errors.Region.message}</p>
            )}
          </div>

          <div className="flex  flex-col">
            <h2>Selecione o estado Brasileiro:</h2>
            <select
              className="text-black rounded-md p-2"
              {...register("State")}
            >
              <option value="">Selecione</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
            {errors.State && (
              <p className="text-red-500">{errors.State.message}</p>
            )}
          </div>

          <div className="flex flex-col rounded-md text-black">
            <h2 className="text-white font-bold">
              Selecione o ano que deseja ver:
            </h2>
            <input
              type="number"
              className="w-full rounded-md p-2"
              {...register("Year")}
            />
            {errors.Year && (
              <p className="text-red-500">{errors.Year.message}</p>
            )}
          </div>

          <div className="flex flex-col rounded-md text-black">
            <h2 className="text-white font-bold">
              Selecione o mês do ano que deseja ver:
            </h2>
            <input
              type="number"
              className="w-full rounded-md p-2"
              {...register("Month")}
            />
            {errors.Month && (
              <p className="text-red-500">{errors.Month.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="border px-6 py-2 text-lg font-semibold rounded-md bg-blue-800 hover:bg-green-800"
        >
          Solicitar
        </button>
      </form>

      <div className="h-2/3 border-2 w-1/2 rounded-r-md flex justify-center py-10 items-center">
        {result ? (
          <h1 className="text-2xl font-semibold text-center px-4">{result}</h1>
        ) : (
          <h1 className="text-2xl font-semibold">Resultado aparecerá aqui</h1>
        )}
      </div>
    </section>
  );
}

export default App;
