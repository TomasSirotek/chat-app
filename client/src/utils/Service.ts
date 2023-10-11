
export const postRequest = async (url: string, body: any) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body
    });

    
    for(let entry of response.headers.entries()) {
        console.log('header', entry);
      }

    const data = await response.json();

    if(!response.ok) {
        let msg : string;

        if(data?.msg){
            msg = data.msg
        }else {
            msg = data;
        }

        return { err : true, msg};
    }

    
    console.log("Response header" + response.headers.get('Set-Cookie'))

    console.log("from data => " + JSON.stringify(data))

    console.log("response header" + JSON.stringify(response))
      // Check if the response includes a "Set-Cookie" header
   
    const setCookieHeader = response.headers.get('Set-Cookie');
    console.log(setCookieHeader)
    if (setCookieHeader) {
        console.log(setCookieHeader)
    // Store the cookie in the browser's cookies, local storage, or session storage
    document.cookie = setCookieHeader; // or localStorage or sessionStorage
  }

    return data;
}

export const getRequest = async (url: string) => {
    const cookie = document.cookie; // get the cookie from the browser
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Cookie': cookie 
        },
    });

    const data = await response.json();

    if(!response.ok) {
        let msg : string;

        if(data?.msg){
            msg = data.msg
        }else {
            msg = data;
        }

        return { err : true, msg};
    }

    return data;
}