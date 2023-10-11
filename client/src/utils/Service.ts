
export const postRequest = async (url: string, body: any) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        },
        body,
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