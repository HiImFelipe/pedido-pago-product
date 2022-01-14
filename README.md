# Micro-Serviço de Produtos

## Como rodar

Inicie o download das dependências com 
```
npm install
```

você precisa de um arquivo .env com a seguinte formatação: 

```
DB_USER='postgres'
DB_PASS='senha'
DB_NAME='pedidopago'
DB_HOST='host.docker.internal'
DB_PORT=5532

APP_HOST='0.0.0.0'
```

* é recomendável que se mantenha o DB_HOST e APP_HOST como listados acima em um ambiente docker, o restante é opcional

Uma vez instaladas, você tem a opção de rodar o projeto em modo de desenvolvimento, evitando erros de compilação:

```
node run dev
```

Você também tem a opção de rodar o projeto em modo de produção, com o comando:

```
node run start
```

Rode as migrations* com o comando:
```
node run typeorm:run
```

\* O projeto utiliza TypeORM, e o padrão dele é que as migration sejam rodadas uma vez que o banco de dados já esteja de pé, pois ele tenta fazer uma conexão. Por esse motivo, as migrations devem ser rodadas depois que o projeto já está rodando e o banco de dados está criado.

Rodando os testes:
```
node run test
```

Caso prefira rodar os testes de forma verbosa, onde ele mostra a porcentagem de cobertura de cada teste, use o comando:

```
node run test:verbose
```

**Observações**: 
-  Caso não seja possível rodar o serviço corretamente em um ambiente docker, verifique se a pasta `dist/src/pb` no container contém o arquivo protobuf. Caso não exista, clone os arquivos .proto em `src/pb` para sua `dist/src/pb` local, e o mesmo será copiado com sucesso seguido de um `docker-compose up --build -d`.