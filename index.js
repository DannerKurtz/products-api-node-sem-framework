const http = require("http");

const products = [];
let nextId = 0;
const server = http.createServer((request, response) => {
    if(request.url === "/product"){
        if(request.method === "GET"){
            return response.end(JSON.stringify(products));
        }
        if(request.method === "POST"){

            request.on("data", (data) =>{
                const dataProduct = JSON.parse(data);

                const product = {
                    id: nextId++,
                    ...dataProduct,
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
                }
            }).on("end", () => {
                return response.end(JSON.stringify(products));
            });
        }
    } 
});

server.listen(4012, () => console.log("Server de produtos RODANDO! (4012)"));