const http = require("http");

const products = [];
const percentages = [];
let nextIdProduct = 0;
let nextIdPercentage = 1;

const server = http.createServer((request, response) => {
    if(request.url === "/product"){
        if(request.method === "GET"){
            return response.end(JSON.stringify(products));
        }
        if(request.method === "POST"){

            request.on("data", (data) =>{
                const dataProduct = JSON.parse(data);

                let product = {
                    id: nextIdProduct++,
                    ...dataProduct,
                }

                const idPercentageProducts = Number(product.idPercentage);
                const indexPercentage = percentages.findIndex(percentage => percentage.id === idPercentageProducts);
                if(indexPercentage !== -1){
                    const percentage = percentages[indexPercentage].porcentagem;
                    const newPrice = ((percentage / 100) * Number(product.preco)) + Number(product.preco);
                    product.preco = String(newPrice);
                }

                products.push(product);
            }).on("end", () => {
                return response.end(JSON.stringify(products));
            });
        }
    }

    if(request.url.startsWith("/product")){
        if(request.method === "PUT"){
            const url = request.url;
            const splitURL = url.split("/");
            const idProduct = Number(splitURL[2]);

            const productIndex = products.findIndex(product => product.id === idProduct);

            request.on("data", (data) => {
                const dataProduct = JSON.parse(data);

                products[productIndex] = {
                    id: idProduct,
                    ...dataProduct,
                };
                const idPercentageProducts = Number(products[productIndex].idPercentage);
                const indexPercentage = percentages.findIndex(percentage => percentage.id === idPercentageProducts);
                if(indexPercentage !== -1){
                    const percentage = percentages[indexPercentage].porcentagem;
                    const newPrice = ((percentage / 100) * Number(products[productIndex].preco)) + Number(products[productIndex].preco);
                    products[productIndex].preco = String(newPrice);
                }
                

            }).on("end", () => {
                return response.end(JSON.stringify(products));
            });
        }
    } 

    if(request.url === "/percentage"){
        if(request.method === "GET"){
            return response.end(JSON.stringify(percentages))
        }

        if(request.method === "POST"){
            request.on("data", (data) => {
                const dataPercentage = JSON.parse(data);
                const percentage = {
                    id: nextIdPercentage++,
                    ...dataPercentage,
                };
                percentages.push(percentage);
            }).on("end", () =>{
                return response.end(JSON.stringify(percentages));
            });
        }
    }
});

server.listen(4012, () => console.log("Server de produtos RODANDO! (4012)"));