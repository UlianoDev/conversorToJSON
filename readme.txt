Este é um leitor de planilhas Excel, que transforma os dados contidos nela, em um JSON.

O JSON será formado com base nos titulos das tabelas.
sendo:
{
    "data":[
        {
            "titulo:"valor",
            "titulo:"valor",
            "titulo:"valor",
            ...
        },
                {
            "titulo:"valor",
            "titulo:"valor",
            "titulo:"valor",
            ...
        },
        ...
    ]
}
O script não tem tratamento de acentuação

Insira o arquivo excel ou csv na pasta 'dist'.

Em 'index.ts' criar uma instancia da classe ToJSON, passando como paramentro o nome do arquivo, e a extensão dele.

Se for um arquivo CSV, é necessário passar o separador também.