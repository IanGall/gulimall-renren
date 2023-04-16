import http from '@/utils/httpRequest.js'
export function policy(param) {
   return  new Promise((resolve,reject)=>{
        http({
            // url: http.adornUrl("/thirdparty/oss/policy"),
            url: http.adornUrl("/thirdparty/oss/info"),
            method: "get",
            params: http.adornParams(param)
        }).then(({ data }) => {
            resolve(data);
        })
    });
}

export function minIoImgUpdate(url, data) {
  return  new Promise((resolve,reject)=>{
    http({
      headers: {
        'Content-Type': data.type
      },
      url: url,
      method: 'put',
      data
    }).then((res) => {
      console.log(res)
      resolve(res);
    })
  });
  //
  // return request({
  //   headers: {
  //     'Content-Type': data.type
  //   },
  //   url: url,
  //   method: 'put',
  //   data
  // })
}
