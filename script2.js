let changeRecords;
let searchRepo;
let sortChange;

(function () {
  let records = 5
  let ascending=true
  let responseData;
  let ssFn;
  let currentPage = 0;
  let timeout;

  let clone = (data) => {
    return JSON.parse(JSON.stringify(data));
  }

  function init() {
    getData().then((data) => {
      responseData = data;
      sortRecords(data)(ascending);
      let cb = getRecords(data);
      getPagination(data.length, records, cb);
      loadPaginatedRecords(currentPage, records, cb);
  
    });  
  }

  function getData() {
    if (responseData) {
      return Promise.resolve(responseData);
    }
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            responseData = JSON.parse(this.response);
            resolve(responseData);
          }
        }
        xhttp.open("GET", "https://api.jsonbin.io/b/5c8b8f39e5cf2761bec30213", true);
        xhttp.send();
    });
  }

  function sortRecords(data) {
    return (ascending) => {
      data.sort(function(a, b) {
        if (ascending) {
          if (a.name < b.name) {
            return -1
          }
          return 0;
        } else {
          if (a.name > b.name) {
            return -1
          }
          return 0;
        }
      });
    }
  }

  function getRecords(data) {
    return function(index, records) {
      let result = [];
      let start = index * records;
      let end = start + records;
      for (let i=start; i<end; i++) {
        if (data[i]) {
          result.push(data[i]);
        }
      }
      return result;
    }
  }

  function getPagination(total, records, cb) {
    let data = Math.ceil(total / records);
    let values = [];
    document.getElementById("pagination").innerHTML = "";
    document.getElementById("main-content").innerHTML = "";
    for (let i =0; i< data; i++) {
      let node = document.createElement("li");
      node.id = `li${i}`;
      node.className = 'block';
      var aTag = document.createElement('a');
      aTag.setAttribute('href',"#");
      aTag.innerHTML = i+1;
      node.appendChild(aTag);
      node.addEventListener('click', function() {
        currentPage = i;
        loadPaginatedRecords(i, records, cb);
      });
      document.getElementById("pagination").appendChild(node)
      values.push(i)
    }
    return values;
  }

  function searchFn (allData) {
    return () => {
      let value = document.getElementById('search').value;
      let currentData = clone(allData);
      document.getElementById("main-content").innerHTML = "";
      for (let i of currentData) {
        let repo = i.repositories.filter((data) => {
          if (data.language.startsWith(value)) {
            return data;
          }
        });
        i.repositories = repo;
        let node = document.createElement("div");
        let pTag = document.createElement('p');
        pTag.innerHTML = i.name;
        for (let r of i.repositories) {
          let span = document.createElement("span");
          span.innerHTML = JSON.stringify(r);
          pTag.appendChild(span);
        }
        node.appendChild(pTag);
        document.getElementById("main-content").appendChild(node)
      }
    };
  }

  function loadPaginatedRecords (i, records, cb) {
    currentPage = i;
    document.getElementById("main-content").innerHTML = "";
    let currentRecords = cb(i, records);
    ssFn = searchFn(currentRecords);
    for (let record of currentRecords) {
      let node = document.createElement("div");
      let pTag = document.createElement('p');
      pTag.innerHTML = record.name;
      for (let repo of record.repositories) {
        let span = document.createElement("span");
        span.innerHTML = JSON.stringify(repo);
        pTag.appendChild(span);
      }
      node.appendChild(pTag);
      document.getElementById("main-content").appendChild(node)
    }
  }

  changeRecords = function (data) {
    records = data.value;
    init();
  }

  searchRepo = function _searchRepo() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      ssFn();
    }, 1000);
  }

  sortChange = function (data) {
    ascending=data.value === "1" ? true : false; 
    init();
  }

  init();
})();
