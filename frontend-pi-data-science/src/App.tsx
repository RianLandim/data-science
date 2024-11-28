import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import image from "./assets/bg-page.jpg";

// Esquema de validação com Zod
const QueryPrevisionDataFormSchema = z.object({
  State: z.string().min(1, "Selecione um estado válido"),
  Region: z.string().min(1, "Selecione uma região válida"),
  Month: z.string().min(1, "Selecione um mês válido"),
  Year: z.string().min(1, "Selecione um ano válido"),
});

type QueryPrevisionData = z.infer<typeof QueryPrevisionDataFormSchema>;
const regions = {
  N: [
    { name: "Acre", code: "AC" },
    { name: "Amapá", code: "AP" },
    { name: "Amazonas", code: "AM" },
    { name: "Pará", code: "PA" },
    { name: "Rondônia", code: "RO" },
    { name: "Roraima", code: "RR" },
    { name: "Tocantins", code: "TO" },
  ],
  NE: [
    { name: "Alagoas", code: "AL" },
    { name: "Bahia", code: "BA" },
    { name: "Ceará", code: "CE" },
    { name: "Maranhão", code: "MA" },
    { name: "Paraíba", code: "PB" },
    { name: "Pernambuco", code: "PE" },
    { name: "Piauí", code: "PI" },
    { name: "Rio Grande do Norte", code: "RN" },
    { name: "Sergipe", code: "SE" },
  ],
  CO: [
    { name: "Distrito Federal", code: "DF" },
    { name: "Goiás", code: "GO" },
    { name: "Mato Grosso", code: "MT" },
    { name: "Mato Grosso do Sul", code: "MS" },
  ],
  SE: [
    { name: "Espírito Santo", code: "ES" },
    { name: "Minas Gerais", code: "MG" },
    { name: "Rio de Janeiro", code: "RJ" },
    { name: "São Paulo", code: "SP" },
  ],
  S: [
    { name: "Paraná", code: "PR" },
    { name: "Rio Grande do Sul", code: "RS" },
    { name: "Santa Catarina", code: "SC" },
  ],
};

function App() {
  const [availableStates, setAvailableStates] = useState<
    { name: string; code: string }[]
  >([]);
  const [result, setResult] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QueryPrevisionData>({
    resolver: zodResolver(QueryPrevisionDataFormSchema),
  });

  // Monitorar seleção de região
  const selectedRegion = watch("Region");

  // Atualiza os estados disponíveis ao selecionar uma região
  const handleRegionChange = (region: string) => {
    setAvailableStates(regions[region as keyof typeof regions] || []);
  };

  const onSubmit = async (data: QueryPrevisionData) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        ...data,
        Month: Number(data.Month),
        Year: Number(data.Year),
      });
      setResult(`Previsão: ${Number(response.data.prediction).toFixed(2)}`);
    } catch (error) {
      console.error(error);
      setResult("Erro ao processar a solicitação.");
    }
  };

  const getRadiationCategory = () => {
    if (!result || !result.startsWith("Previsão:")) return null;

    const prediction = parseFloat(result.split(":")[1].trim());

    if (prediction <= 500) {
      return "A radiação é classificada como Baixa. Pode limitar o crescimento das plantas e reduzir a produtividade.";
    } else if (prediction <= 1000) {
      return "A radiação é classificada como Normal. Fornece um equilíbrio ideal para a maioria das culturas.";
    } else {
      return "A radiação é classificada como Alta. Embora beneficie algumas culturas, pode causar estresse térmico.";
    }
  };

  return (
    <section
      className="h-screen w-full text-black flex justify-center items-center px-[12%] flex-col"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="font-bold rounded-t-lg bg-white border-t-2 border-l-2 
                      border-r-2 border-gray-800 px-3">
        PI - Data Science
      </h1>

      <div className="border-2 border-gray-800 bg-white rounded-lg w-full h-4/5 flex items-center">
        <form
          className="h-fit w-1/2 flex justify-center items-center flex-col space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-2xl font-semibold">Previsão de radiação solar</h1>
          <div className="flex flex-col space-y-5">
            <div className="flex flex-col">
              <h2>Selecione a região Brasileira:</h2>
              <select
                className="w-full text-black border border-gray-800 rounded-md p-2"
                {...register("Region")}
                onChange={(e) => handleRegionChange(e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="N">Norte</option>
                <option value="NE">Nordeste</option>
                <option value="CO">Centro-Oeste</option>
                <option value="SE">Sudeste</option>
                <option value="S">Sul</option>
              </select>
              {errors.Region && (
                <p className="text-red-500 text-sm">{errors.Region.message}</p>
              )}
            </div>

            <div className="flex flex-col">
              <h2>Selecione o estado Brasileiro:</h2>
              <select
                className="w-full text-black border border-gray-800 rounded-md p-2"
                {...register("State")}
              >
                <option value="">Selecione...</option>
                {availableStates.map(({ name, code }) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
              {errors.State && (
                <p className="text-red-500 text-sm">{errors.State.message}</p>
              )}
            </div>

            <div className="flex flex-col rounded-md text-black">
              <h2>Selecione o ano que deseja ver:</h2>

              <select
                className="w-full text-black border border-gray-800 rounded-md p-2"
                {...register("Year")}
              >
                <option value="">Selecione...</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
              {errors.Year && (
                <p className="text-red-500 text-sm">{errors.Year.message}</p>
              )}
            </div>

            <div className="flex flex-col rounded-md text-black">
              <h2>Selecione o mês do ano que deseja ver:</h2>
              <input
                type="number"
                placeholder="1 (Janeiro)"
                className="w-full text-black border border-gray-800 rounded-md p-2"
                {...register("Month")}
              />
              {errors.Month && (
                <p className="text-red-500 text-sm ">{errors.Month.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="transition-colors duration-333 ease-in-out px-6 py-2 text-lg font-semibold rounded-md hover:bg-yellow-600 bg-blue-400"
          >
            Solicitar
          </button>
        </form>

        <div className="border-s-2 border-gray-800 h-full w-1/2 rounded-r-md flex flex-col justify-center py-10 items-center">
          {result ? (
            <>
              <h1 className="text-2xl font-semibold text-center px-4">
                {result}
              </h1>
              <p className="text-lg text-center mt-4 px-10">
                {getRadiationCategory()}
              </p>
            </>
          ) : (
            <h1 className="text-2xl font-semibold">Resultado</h1>
          )}
        </div>
      </div>
    </section>
  );
}

export default App;

{
  /* <input
                type="number"
                placeholder="2025"
                className="w-full text-black border border-gray-800 rounded-md p-2"
                {...register("Year")}
              />
              {errors.Year && (
                <p className="text-red-500 text-sm">{errors.Year.message}</p>
              )} */
}
