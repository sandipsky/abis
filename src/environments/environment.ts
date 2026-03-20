// let hostname = document.location.hostname;
// let protocol = 'http://'
// let url = protocol + hostname

// let port = url + ':' + '8081'

// export const environment = {
//   production: false,
//   apiUrl: `${port}`
// };

export const environment = {
  production: false,
  apiUrl: 'http://front1.abisplus:8080',
  socketUrl: 'ws://front1.abisplus:8085',
  // apiUrl: 'http://192.168.0.58:8080',
  // socketUrl: 'ws://192.168.0.58:8085',

  // apiUrl: 'http://192.168.0.61:8080',
  // socketUrl: 'ws://192.168.0.61:8085',
};
