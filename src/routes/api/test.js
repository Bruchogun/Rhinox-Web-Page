// import fetch from "node-fetch";
// let token;

// async function rappi_get(token){
//     const response = await fetch('https://services.rappi.com/api/v2/restaurants-integrations-public-api/menu', {
//         method: 'GET',
//         headers: {
//         "Content-Type": "application/json",
//         "x-authorization": `bearer ${token.access_token}`,
//         },
//     });
//     const data = await response.json();
//     console.log(data);
// }

// async function rappi_post(){
//     const response = await fetch('https://rests-integrations.auth0.com/oauth/token', {
//         method: 'POST',
//         body: JSON.stringify({
//             "client_id": "mWtAs4S3f1yyPCVHZruFSRJsG0YlrJKc",
//             "client_secret": "KEBVQ4IomeCvLX4TAq987jdYanffjo3KmTbWkyPtLOEsgDyOAhlkgtLmME01efmO",
//             "audience": "https://int-public-api-v2/api",
//             "grant_type": "client_credentials"
//           }),
//         headers: {
//         "Content-Type": "application/json",
//         },
//     });
//     const data = await response.json();
//     console.log(data)
//     rappi_get(data)
// }
// token = rappi_post()

